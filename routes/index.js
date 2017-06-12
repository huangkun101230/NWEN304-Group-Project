var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var path = require("path");
var appRoot = require('app-root-path');
var client = require(appRoot+"/config/database.js");
var config  = require(appRoot+"/config/auth");
var ssn = config.session;
var models = require(appRoot+"/models");



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

},function(req,res,next){
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
    products_id: {
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

/*
login routes
////////////////////////////////////////////////////////////////////////////////////
*/

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
    var user = ssn.user;

    if(user == null){
        return res.status(500).json({success: false, data: "not logged on"});
    } else {
        next();
    }
},function(req,res,next){
  var user = ssn.user;
  models.users.findOne({
      where: {
          username: user
      }
  }).then(function(result){
    console.log(result);
  });
});






//adds items to the cart of a particular user 
router.put('/addtocart',jsonParser,function(res,req,next){
  var user = ssn.user;
  if(user == null){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(res.body.prodId == null || res.body.amount == null){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  }
  var data = res.body;
  client.query("UPDATE users SET cart = cart || '{$1} WHERE username=$3",[data.prodId,user], 
  function(err, result) {
      if (err) {
        return res.status(500).json({success: false,data: err});
      }
      res.status(200).json({success: true,data: "updated cart"});
  });
});

//changes amount of certain product in cart
router.put('/user/cart/amount/:id',jsonParser,function(res,req,next){
  var user = ssn.user;
  if(user == null){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(res.body.prodId == null || req.params.id == null){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  } else {
    next();
  }


},function (res,req,next) {
  var user = ssn.user;
  var data = res.body;
  client.query("UPDATE "+user+"_cart SET amount = $1 WHERE product_id=$2",[data.prodId, req.params.id], 
  function(err, result) {
      if (err) {
        return res.status(500).json({success: false,data: err});
      }
      res.status(200).json({success: true,data: "updated cart"});
  });  
});

router.get('/user/cart/:id',function(res,req,next){
  var user = ssn.user;
  if(user == null){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(req.params.id == null){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  } else {
    next();
  }

},function(res,req,next){
  var user = ssn.user;
  var query = client.query("SELECT * FROM "+user+"_cart WHERE product_id=$2",[req.params.id], 
  function(err, result) {
      if (err) {
        return res.status(500).json({success: false,data: err});
      }
      
  }); 
  var user = [];
  query.on('row', function(row) {
    user.push(row);
  });
  // After all data is returned, return results
  query.on('end', function() {
    if (user.length == 0) {
      res.status(500).json({success: false, data: "could not find product"});
    }else {
      res.json(user);
    }
  });  
});
//gets the cart bases of the user 
router.get('/user/cart',function(res,req,next){
  var user = ssn.user;
  if(user == null){
    return res.status(500).json({success: false, data: "not logged on"});
  } else {
    next();
  }
},function(req,res,next){
  var user = ssn.user;
  var query = client.query("SELECT * FROM "+user+"_cart ", 
  function(err, result) {
      if (err) {
        return res.status(500).json({success: false,data: err});
      }
      
  }); 

  var user = [];
  query.on('row', function(row) {
    user.push(row);
  });
  // After all data is returned, close connection and return results
  query.on('end', function() {
    res.json(user);
  });
});

router.delete('user/cart/delete/:id',function(res,req,next) {
  var user = ssn.user;
  var item = req.params.id
  if(user == null){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(item == null){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  }


},function(res,req,next){
  var user = ssn.user;
  var item = req.params.id
  client.query("DELETE FROM "+user+"_cart where product_id=$1",[item], 
  function(err, result) {
      if (err) {
        return res.status(500).json({success: false,data: err});
      } else {
        res.status(200).json({success: true,data: "updated cart"});
      }
      
  });
});

/*
products  routes
////////////////////////////////////////////////////////////////////////////////////
*/

//GET from product table
router.get('/products',function(req,res){
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



module.exports = router;
