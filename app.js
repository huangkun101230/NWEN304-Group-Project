var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var faker = require('faker');
var session = require('express-session');
var appRoot = require('app-root-path');
require(appRoot+"/database/db-init.js");
var sleep = require('sleep');
sleep.sleep(10); // its a hack to wait for the db to start 
var models = require('./models');
var passport = require('passport');
var flash = require('connect-flash');
var models = require('./models');

app.use(express.static('./public'));

var secret = process.env.SESSION_SECRET || "ssshhhhh"
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: true,
    maxAge: 24*60*60*1000,
    //duration: 30 * 60 * 1000,
    //activeDuration: 5 * 60 * 1000 
  }
}));

app.use(require('./config/passport'));

app.use(passport.initialize());
app.use(passport.session());  //persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session


app.use(require('./routes/index'));


models.sequelize.sync().then(function () {
  var products =  models.products;

  //checks if products table is empty if it is then add test data
  products.count().then(function(c){
    if (c == 0) {
      var rows = []
      for (var index = 0; index < 50; index++) {
        var row = {};
        row['product_name'] = faker.commerce.productName();
        row['product_des'] =  faker.lorem.sentences();
        row['price'] = faker.commerce.price(); 
        row['in_stock'] = faker.random.number();
        rows.push(row);
      }
      products.bulkCreate(rows);      
    }
  });


  
  app.listen(port, function () {
    console.log('Example app listening on port 8080!');
  });
});
module.exports = app;
