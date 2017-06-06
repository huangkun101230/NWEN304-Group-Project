var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var faker = require('faker');
var session = require('express-session');
var appRoot = require('app-root-path');
var models = require('/models');
require(appRoot+"/database/db-init.js");
app.use(express.static(appRoot+'/public'));
//app.use(express.urlencoded());
var secret = process.env.SESSION_SECRET || "ssshhhhh"
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));





app.use(require('./routes/index'));

models.sequelize.sync().then(function () {
  var products =  models.products;
  var count;
  products.count().then(function(c){
    count = c;
  });
  if (count == 0) {
    products
      .build({
        product_name: faker.commerce.productName,
        product_des: faker.lorem.sentences,
        price: faker.commerce.price,
        in_stock: faker.random.number
      })
      .save();
  }

  app.listen(port, function () {
    console.log('Example app listening on port 8080!');
  });
});
module.exports = app;
