var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var path = require("path");
var appRoot = require('app-root-path');
var client = require(appRoot+"/config/database.js");
var app = require(appRoot+'/app.js');
var ssn ;

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

  if (login) {
    return true;
  } else {
    return false;
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  ssn = req.session;
  ssn.user;
  ssn.pass; 
});

//registers a new user into database for the user_cart and users tables 
router.post('/register',jsonParser,function(req, res, next){

  var data = req.body
  if (data == null || data.user == null || data.pass == null) {
    return res.status(500).json({success: false, data: "empty username or password"});
  }
  var id;

  client.query("INSERT INTO users (username,password) VALUES ($1,$2) RETURNING user_id;",[data.user,data.pass], 
  function(err, result) {
      if (err) {
        throw err;
      }
      id = result.rows[0].user_id;
  });
  var cartQuery = "CREATE TABLE IF NOT EXISTS  "+data.user+"_cart (id SERIAL  PRIMARY KEY NOT NULL, product_id BIGINT , amount  BIGINT)"
  client.query(cartQuery, 
  function(err, result) {
      if (err) {
        throw err;
      }
  });
  
  return res.status(200).json({success: true, data: "successfully added user"});
});

router.get('/login',jsonParser,function(req, res, next){
  var data = req.body
  if (data === null || data.user === null || data.pass === null) {
     return res.status(500).json({success: false, data: "empty username or password"});
  }
  ssn = req.session;
  ssn.user = data.user;
  ssn.pass = data.pass;

  if (loginCheck(ssn.user,ssn.pass)) {
    
    res.redirect('/')
  } else {
    res.status(200).json({success: false, data: "wrong username or password"});
  }  
  

});

router.get('/logout',jsonParser,function(req, res, next){
  req.session.destroy(function(err){
    if(err){
      throw err;
    } else{
      res.redirect('/');
    }
  });

});

// gets the row which has information about the user e.g username, password and whats in the users cart
router.get('/user',jsonParser,function(req, res, next) {
  var user = ssn.user;
  if(user == null){
    return res.status(500).json({success: false, data: "not logged on"});
  }
  var query = client.query("SELECT * FROM users WHERE username=$1",[user], 
  function(err, result) {
      if (err) {
        throw err;
      }
  });

  var user = [];
  query.on('row', function(row) {
    user.push(row);
  });
  // After all data is returned, close connection and return results
  query.on('end', function() {
    if (user.length == 0) {
      res.status(500).json({success: false, data: "could not find user"});
    }else {
      res.json(user);
    }
  });
})

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
  }
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
  }
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
  // After all data is returned, close connection and return results
  query.on('end', function() {
    if (user.length == 0) {
      res.status(500).json({success: false, data: "could not find product"});
    }else {
      res.json(user);
    }
  });

});

router.get('/user/cart',function(res,req,next){
  var user = ssn.user;
  if(user == null){
    return res.status(500).json({success: false, data: "not logged on"});
  } else if(req.params.id == null){
    return res.status(500).json({success: false, data: "no product to add to cart"});
  }
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
  client.query("DELETE FROM "+user+"_cart where product_id=$1",[item], 
  function(err, result) {
      if (err) {
        return res.status(500).json({success: false,data: err});
      }
      res.status(200).json({success: true,data: "updated cart"});
  });

});



module.exports = router;
