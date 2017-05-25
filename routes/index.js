var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
//var connectionString = process.env.DATABASE_URL || "postgres://root@localhost:5432/shopping";
//var pg = require('pg');
var path = require("path");
var appRoot = require('app-root-path');
var client = require(appRoot+"/config/database.js");

function loginCheck(user,pass){
  var login = [];
  var query = client.query("select exists(select (username,password) from users where username=$1 and password=$2)",[data.user,data.pass], 
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
    console.log(login);
  });

  if (login) {
    return true;
  } else {
    return false;
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {

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

  client.query("INSERT INTO user_cart (user_id) VALUES ($1);",[id], 
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

  if (loginCheck(data.user,data.pass)) {
    res.redirect('/')
  } else {
    res.status(200).json({success: false, data: "wrong username or password"});
  }  
  

});


module.exports = router;
