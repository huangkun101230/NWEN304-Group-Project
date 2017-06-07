var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var path = require("path");
var appRoot = require('app-root-path');
var config  = require(appRoot+"/config/auth");
var ssn = config.session;
var models = require(appRoot+"/models");

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
router.get('/logout',jsonParser,function(req, res, next){
  req.session.destroy(function(err){
    if(err){
       next(err);
    } else{
      res.status(200).json({success: true, data: "yes"})
    }
  });

});


module.exports = router;
