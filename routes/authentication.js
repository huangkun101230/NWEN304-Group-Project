var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var path = require("path");
var appRoot = require('app-root-path');
var client = require(appRoot+"/config/database.js");
var config  = require(appRoot+"/config/auth");
var ssn = config.session;


module.exports = router;
