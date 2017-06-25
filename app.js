var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var path = require("path");
var faker = require('faker');
var session = require('express-session');
var appRoot = require('app-root-path');
require(appRoot+"/database/db-init.js");
var sleep = require('sleep');
sleep.sleep(10); // its a hack to wait for the db to start 
var models = require('./models');
var passport = require('passport');
var flash = require('connect-flash');
app.use(express.static('./public'));

//app.use(express.urlencoded());
var secret = process.env.SESSION_SECRET || "ssshhhhh"
app.use(session({
  secret: secret,
  cookie: { secure: true }
}));

app.use(require('./config/passport'));

app.use(passport.initialize());
app.use(passport.session());  //persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session


app.use(require('./routes/index'));


app.listen(port, function () {
	console.log('Example app listening on port 8080!');
});
module.exports = app;
