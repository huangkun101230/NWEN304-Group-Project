var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var path = require("path");

var fs = require('fs');

app.use(require('./routes/index'));

var pg = require('pg');

app.get('/', function (req, res) {
	//res.sendFile(  path.join(__dirname,'project1-part1-template','project1'));
});


app.listen(port, function () {
	console.log('Example app listening on port 8080!');
});
