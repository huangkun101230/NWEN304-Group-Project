var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var connectionString = process.env.DATABASE_URL || "postgres://huangkun:123@depot:5432/shopping";
var path = require("path");
var appRoot = require('app-root-path');
var client = require(appRoot+"/config/database.js");
var cors = require('cors');
var ssn ;

router.use(jsonParser);

router.use(cors());

router.use(express.static(__dirname+'/public'));

var ERROR_LOG = console.error.bind(console);

router.use(bodyParser.urlencoded({
  extended:true
}));

//Define a route for a basic case
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'public','index.html'));
});

//GET from product table
router.get('/test_database',function(req,res){
  //SQL Query>Select Data
  var results = [];

  var query = client.query('select * from products');
    
  //Stream results back one row at a time
  query.on('row',function(row){
    results.push(row);
  });
  //After all data is returned, close connection and return results
  query.on('end',function(row){
//    client.end();
    res.json(results);
  });
});

function loginCheck(user,pass){
  var login = [];
  var query = client.query("select exists(select (username,password) from users where username=$1 and password=$2)",[user,pass], 
  function(err, result) {
      if (err) {
        throw err;
      }
         
  });
  query.on('row', function(row) {
    login.push(row);
  });
  // After all data is returned, close connection and return results
  query.on('end', function() {
    //res.json(login);
    login = JSON.stringify(login);
    login = JSON.parse(login)[0].exists
    //console.log(login);
  });
//var path = require("path");

var config  = require("../config/auth");
var ssn ;//= config.session;
var models = require("../models");



/* GET home page. */
router.get('/', function(req, res, next) {
  ssn = req.session;
  ssn.user;
  ssn.pass; 
});

//registers a new user into database for the user_cart and users tables 
router.post('/register',jsonParser,function(req, res, next){

  var data = req.body
  if (data == null || data.user == '' || data.pass == '') {
    return res.status(500).json({success: false, data: "empty username or password"});
  } else {
    next();
  }

},function(req, res, next){
  //creates user in database
  var data = req.body
  models.users.findOrCreate({
    where: {
      username: data.user
    },
    defaults: {
      username: data.user,
      password: data.pass
    }
  }).spread(function(user,created){
    if (created) {
      next();
    } else {
      res.status(500).json({success: false, data: "already added user"});
    }
  });
},function(req, res, next){
  //creates user cart
  var data = req.body
  var dbName = data.user+"_cart" 
  models.sequelize.define(dbName,{
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: models.Sequelize.INTEGER
    },
    product_id: models.Sequelize.INTEGER,
    amount: models.Sequelize.INTEGER
  });
  models.sequelize.sync()
    .then(function(){
      res.status(200).json({success: true, data: "successfully added user"});
    })
    .catch(function(err){
       res.status(500).json({success: false, data: err});
    });
});

router.get('/login',jsonParser,function(req, res, next){

/*
login routes
////////////////////////////////////////////////////////////////////////////////////
*/

// logins a user
router.post('/login',jsonParser, function(){
  passport.authenticate('local-login',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})},function(req, res, next){
//logins a user
router.post('/login',jsonParser,function(req, res, next){
  var data = req.body
  if (Object.keys(data).length == 0) {
     return res.status(500).json({success: false, data: "empty username or password"});
  } else {
    next();
  }
},function(req, res, next){
    var data = req.body
    models.users.findOne({ 
        where: {
            username: data.user
        } 
    }).then(function(user){
        if (user != null) {
            ssn = req.session;
            ssn.user = data.user;
            ssn.pass = data.pass;
            
            res.status(200).json({success: true, data: "yes"})    
        } else {
            res.status(500).json({success: false, data: "wrong username or password"})
        }

    });
});
// router.post('/login',jsonParser,function(req, res, next){
//   var data = req.body
//   if (Object.keys(data).length == 0) {
//      return res.status(500).json({success: false, data: "empty username or password"});
//   } else {
//     next();
//   }
// },function(){
//   passport.authenticate('local-login',{
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }).then(function(user){
//         if (user != null) {
//             ssn = req.session;
//             ssn.user = data.user;
//             ssn.pass = data.pass;
            
//             res.status(200).json({success: true, data: "yes"})    
//         } else {
//             res.status(500).json({success: false, data: "wrong username or password"})
//         }

//     });
// });

//logs out a user
router.post('/logout',jsonParser,function(req, res, next){
  req.session.destroy(function(err){
    if(err){
       next(err);
    } else{
      res.status(200).json({success: true, data: "yes"})
    }
  });

});

/*
user cart and info routes
////////////////////////////////////////////////////////////////////////////////////
*/


// gets the row which has information about the user e.g username, password and whats in the users cart
router.get('/user',function(req, res, next) {
    console.log(console.log(req.session.user));
    var user = ssn;

    if(typeof user == 'undefined'){
        return res.status(500).json({success: false, data: "not logged on"});
    } else {
        next();
    }
},function(req, res, next){
  var user = ssn.user;
  models.users.findOne({
      where: {
          username: user
      }
  })
  .then(function(result){
    console.log(result);
  })
  .catch(function(err){
    res.status(500).json({success: false, data: err});
  });

});






//adds items to the cart of a particular user 
router.put('/addtocart',jsonParser,function(res,req,next){
  var user = ssn;
  if(typeof user == 'undefined'){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(res.body.prodId == '' || res.body.amount == 0){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  } else {
    next();
  }

 
},function(req, res, next){
  var data = res.body;
  var user = ssn.user;
  var dbName = user+"_carts"

  var query = "INSERT INTO "+dbName+" (product_id,amount) SELECT "+data.prodId+", "+data.amount+" FROM "+dbName+" WHERE not exists (select * from "+dbName+" where col1 = "+data.prodId+")LIMIT 1" 
  models.sequelize.query(query)
    .then(function(result){
      
      res.status(200).json({success: true, data: result})
    })
    .catch(function(err){
      res.status(500).json({success: false, data: err})
    })
});

//changes amount of certain product in cart
router.post('/user/cart/amount/:id',jsonParser,function(res,req,next){
  var user = ssn;
  if(typeof user == 'undefined'){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(res.body.prodId == '' || req.params.id == '' || res.body.amount == 0){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  } else {
    next();
  }


},function (req, res, next) {
  var user = ssn.user;
  var data = res.body;
  var id = req.params.id;
  
  var dbName = user+"_carts";

  var query = "UPDATE "+dbName+"SET amount = "+data.amount+" WHERE product_id="+id
  models.sequelize.query(query)
    .then(function(result){
      
      res.status(200).json({success: true, data: result})
    })
    .catch(function(err){
      res.status(500).json({success: false, data: err})
    })

});

router.get('/user/cart/:id',function(req, res, next){
  var user = ssn;
  if(typeof user == 'undefined'){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(req.params.id == null){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  } else {
    next();
  }

},function(res,req,next){
  var user = ssn.user;
  var id = req.params.id;
  var dbName = user+"_carts"

  var query = "SELECT * FROM "+dbName+" WHERE product_id="+id
  models.sequelize.query(query)
    .then(function(result){
      var h = result[1].fields
      res.status(200).json(h)
    })
    .catch(function(err){
      res.status(500).json({success: false, data: err})
    })
  
});
//gets the cart bases of the user 
router.get('/user/cart',function(req, res, next){
  var user = ssn;
  
  if(typeof user == 'undefined'){
    res.status(500).json({success: false, data: "not logged on"});
  } else {
    next();
  }
},function(req,res,next){
  var user = ssn.user;
  var dbName = user+"_carts"
  var query = "SELECT * FROM "+dbName
  models.sequelize.query(query)
    .then(function(result){
      var h = result[1].fields
      res.status(200).json(result[0])
    })
    .catch(function(err){
      res.status(500).json({success: false, data: err})
    })
  /*
  models.Sequelize.model(dbName).findAll()
    .then(function(result){
      res.json(result);
    })
    .catch(function(err){
      res.status(500).json({success: false,data: err});
    });
    */
});

router.delete('user/cart/delete/:id',function(req, res, next) {
  var user = ssn;
  var item = req.params.id
  if(typeof user == 'undefined'){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(item == null){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  }


},function(req, res, next){
  var user = ssn.user;
  var id = req.params.id
  var dbName = user+"_cart"
  models.get(dbName).destroy({
    where: {
      product_id: id
    }
  }).then(function(result){
    if(result > 0 ){
      res.status(200).json({success: true, data: "delete product from cart"});
    } else {
      res.status(500).json({success: false, data: "did not delete product from cart"});
    }
  }).catch(function(err){
    res.status(500).json({success: false, data: err});
  })

});

/*
products  routes
////////////////////////////////////////////////////////////////////////////////////
*/

//GET from product table
router.get('/products',function(req, res, next){
  models.products.findAll()
    .then(function(result){
      res.json(result);
    }).catch(function(err){
      res.status(500).json({success: false, data: err});
    });

});

//gets a certain product based off its id 
router.get('/products/:id',function(req, res, next){
  var id = req.params.id;
  if (typeof id == 'undefined') {
    res.status(500).json({success: false, data: "not logged on"});
  } else {
    next();
  }
},function(req, res, next){
  var id = req.params.id;
  models.products.findById(id)
    .then(function(result){
      res.status(200).json(result);
    })
    .catch(function(err){
      res.status(500).json({success: false, data: err});
    });
});




/*
search products
////////////////////////////////////////////////////////////////////////////////////
*/

//GET(search) from product table
router.post('/products/search',jsonParser,function(req, res, next){
  var data = req.body
  if (Object.keys(data).length == 0) {
     return res.status(500).json({success: false, data: "empty search item"});
  } else {
    next();
  }
},function(req, res){
    var results = [];

  	var query = client.query('select * from products where product_id=$1"',[item]);
    
  //Stream results back one row at a time
  query.on('row',function(row){
    results.push(row);
  });
  //After all data is returned, close connection and return results
  query.on('end',function(row){
    res.json(results);
  });

});
//Search from products
router.get('/search',function(req, res){
    models.products.findOne({
      where: {products_name: req},
      attributes: ['id', ['name','products_name']]
    }).then(function(results){
      res.json(results);
    });
 });

//Facebook
Redirect the user to Facebook for authentication.
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

// Facebook will redirect the user to this URL after approval.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));



module.exports = router;
