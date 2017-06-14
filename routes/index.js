var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
// create application/json parser
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
  /*
  client.query("INSERT INTO user_cart (user_id) VALUES ($1);",[id], 
  function(err, result) {
      if (err) {
        throw err;
      }
  });
  */
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
    res.status(500).json({success: false, data: "not logged on"});
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
    }
    res.json(user);
  });
})

//adds items to the cart of a particular user 
router.get('/addtocart',jsonParser,function(res,req,next){
  var user = ssn.user;
  if(user == null){
    res.status(500).json({success: false, data: "not logged on"});
  }
  

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


module.exports = router;
