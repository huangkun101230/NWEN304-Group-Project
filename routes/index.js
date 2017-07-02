module.exports = function(passport){

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var path = require("path");


router.use(jsonParser);

var config  = require("../config/auth");
var models = require("../models");



/* GET home page. */
router.get('/', function(req, res, next) {
  var auth = req.isAuthenticated();
  res.render('index.ejs',{
    login: auth
  });
});

router.get('/login',function(req, res, next){
  res.render('login.ejs',{
    login: req.isAuthenticated()
  });
});

router.get('/register',function(req, res, next){
  res.render('register.ejs',{
    login: req.isAuthenticated()
  });
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/shop', function(req, res){
    models.products.findAll()
    .then(function(result){
      //res.json(result);
      res.render('shop.ejs',{
        login: req.isAuthenticated(),
        products: result
      })
    }).catch(function(err){
      res.status(500).json({success: false, data: err});
    });
});

router.get('/usercart',isLoggedIn,function(req, res){
  var user = req.user.username;
  var dbName = "cart_"+user+"s"
  var query = "SELECT * FROM "+dbName+ " INNER JOIN products ON  "+dbName+ ".product_id=products.product_id"
  models.sequelize.query(query)
  .then(function(result){
    res.render('usercart.ejs',{
      login: req.isAuthenticated(),
      products: result[0]
    });
  })
  .catch(function(err){
    res.status(500).json({success: false, data: err})
  })
});
/*
register routes
////////////////////////////////////////////////////////////////////////////////////
*/

/*
register routes
////////////////////////////////////////////////////////////////////////////////////
*/



//registers a new user into database for the user_cart and users tables 
router.post('/register',jsonParser,function(req, res, next){

  var data = req.body
  if (data == null || data.username == '' || data.password == '') {
    return res.status(500).json({success: false, data: "empty username or password"});
  } else {
    console.log("This works :)");
    next();
  }

},
  passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  })
);

/*
login routes
////////////////////////////////////////////////////////////////////////////////////
*/

//logins a user
router.post('/login',jsonParser,function(req, res, next){
  var data = req.body;
  if (Object.keys(data).length == 0) {
     return res.status(500).json({success: false, data: "empty username or password"});
  } else {
    next();
  }
}, passport.authenticate('local-login',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})
);

//logs out a user
router.post('/logout',jsonParser,function(req, res, next){
  req.session.destroy(function(err){
    if(err){
       next(err);
    } else{
      res.redirect('/');
    }
  });

});


router.get('/user',function(req, res, next){
  var data = {
    user: req.user,
    auth: req.isAuthenticated() 
  }
  res.status(200).json(data);
});



// /*
// user cart and info routes
// ////////////////////////////////////////////////////////////////////////////////////
// */




//adds items to the cart of a particular user
router.post('/addtocart',jsonParser,function(req, res, next){
    var user = req.user;
    if(typeof user == 'undefined'){
        return res.status(500).json({success: false, data: "not logged on"});
    } else if(req.body.prodId == '' || req.body.amount == 0){
        return res.status(500).json({success: false, data: "no product to add to cart"});
    } else {
        next();
    }


},function(req, res, next){
    var data = req.body;
    var user = req.user.username;
    var dbName = "cart_"+user+"s"
    var querySelect = "SELECT product_id FROM "+dbName+" WHERE product_id = "+data.prodId
    models.sequelize.query(querySelect)
        .then(function(result){

            var user = result[0]
            if (user.length === 0) {
                var queryInsert = "INSERT INTO "+dbName+" (product_id,amount) VALUES ("+data.prodId+","+data.amount+")"
                models.sequelize.query(queryInsert)
                    .then(function(result){
                        res.status(200).json({success: true, data: result})
                    })
            } else {
                res.status(200).json({success: false, data: "did not add product"})
            }

        })
        .catch(function(err){
            res.status(500).json({success: false, data: err})
        })
});


//changes amount of certain product in cart
router.post('/user/cart/amount/:id',jsonParser,function(req, res, next){
  var user = req.user;
  if(typeof user == 'undefined'){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(res.body.prodId == '' || req.params.id == '' || res.body.amount == 0){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  } else {
    next();
  }
},function (req, res, next) {
  var user = req.user.id;
  var data = req.body;
  var id = req.params.id;
  
  var dbName = "cart_"+user+"s";

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
  var user = req.user;
  if(typeof user == 'undefined'){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(req.params.id == null){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  } else {
    next();
  }

},function(req, res, next){
  var user = req.user.id;
  var id = req.params.id;
  var dbName = "cart_"+user+"s"

  var query = "SELECT * FROM "+dbName+" WHERE product_id="+id
  models.sequelize.query(query)
    .then(function(result){
      var product = result[1].fields
      res.status(200).json(product)
    })
    .catch(function(err){
      res.status(500).json({success: false, data: err})
    })
  
});

//gets the cart bases of the user 
router.get('/user/cart',function(req, res, next){
  var user = req.user;
  
  if(typeof user == 'undefined'){
    res.status(500).json({success: false, data: "not logged on"});
  } else {
    next();
  }
},function(req, res, next){
  var user = req.user.id;
  var dbName = "cart_"+user+"s"
  var query = "SELECT * FROM "+dbName+ " INNER JOIN products ON  "+dbName+ ".product_id=products.product_id"
  models.sequelize.query(query)
    .then(function(result){
      res.status(200).json(result[0])
    })
    .catch(function(err){
      res.status(500).json({success: false, data: err})
    })
});

router.delete('/user/cart/delete/:id',function(req, res, next) {
  var user = req.user;
  var item = req.params.id
    console.log("-------the product id: 'user/cart/delete/${id}' "+item);
  if(typeof user == 'undefined'){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(typeof item == 'undefined'){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  } else {
    next();
  }
},function(req, res, next){
  var user = req.user.id;
  var id = req.params.id
  var dbName = "cart_"+user+"s"
  var query = "DELETE FROM "+dbName+" WHERE product_id = "+id
  models.sequelize.query(query)
  .then(function(result){
    var count = result[1].rowCount; 
    if (count > 0) {
      res.status(200).json({success: true,data: "successfully removed product"})
    } else {
      res.status(500).json({success: false,data: "unsuccessfully removed product"})
    }
  })
  .catch(function(err){
    res.status(500).json({success: false,data: err})
  });


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


//Search from products
router.post('/search',function(req, res){
  var name = req.body.product_name;
    models.products.findOne({
      where: {product_name: name}
    }).then(function(results){
      res.json(results);
    });
 });

//Facebook
// Redirect the user to Facebook for authentication.
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
// router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
  return router;
}