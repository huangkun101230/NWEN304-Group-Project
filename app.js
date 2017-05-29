var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var faker = require('faker');
var session = require('express-session');
var appRoot = require('app-root-path');
require(appRoot+"/database/db-init.js");

//app.use(express.urlencoded());
var secret = process.env.SESSION_SECRET || "ssshhhhh"
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));





app.use(require('./routes/index'));


app.listen(port, function () {
	console.log('Example app listening on port 8080!');
});
module.exports = app;
