var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var faker = require('faker');
var session = require('express-session'); 
var models = require('./models');
var passport = require('passport');
var flash = require('connect-flash');
var models = require('./models');
var bodyParser = require('body-parser');
var enforce = require('express-sslify');
var csv = require("fast-csv");



app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

require('./config/passport')(passport);
/*
app.use(function (req, res, next) {
 // Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*')
 // // Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH,DELETE');
 // Request headers you wish to allow ,
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-AllowHeaders');
 // Pass to next layer of middleware
	next();
});*/


var SequelizeStore = require('connect-session-sequelize')(session.Store);

var env = process.env.ENVIRONMENT || "dev"
var secret = process.env.SESSION_SECRET || "ssshhhhh"

if (env === "dev") {
    app.use(session({
      secret: secret,
      resave: false,
      saveUninitialized: true,
      store: new SequelizeStore({
        db: models.sequelize
      }),
      cookie: { 
        maxAge: 24*60*60*1000,
        //duration: 30 * 60 * 1000,
        //activeDuration: 5 * 60 * 1000 
      }
    }));
} else {
  //app.set(sslRedirect())
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
  app.use(function (req, res, next){

  });
  //app.set('trust proxy', 1)
  app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: models.sequelize
    }),
    //proxy : true,
    cookie: { 
      secure: true,
      maxAge: 24*60*60*1000,
      //duration: 30 * 60 * 1000,
      //activeDuration: 5 * 60 * 1000 
    }
  }));
}

app.use(passport.initialize());
app.use(passport.session());  //persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

app.use(require('./routes/index')(passport));


models.sequelize.sync().then(function () {
  var products =  models.products;

  //checks if products table is empty if it is then add test data
  products.count().then(function(c){
    if (c == 0) {
      var rows = []

/*      csv
      .fromPath("./csv-files/apparel.csv")
      .on("data", function(data){
        
        var row = {};
        row['product_name'] = data[0];
        if (data.length == 5) {
            row['product_des'] = data[4];
        } else {
          row['product_des'] = faker.lorem.sentences();
        }
        row['price'] = faker.commerce.price();
        row['in_stock'] = faker.random.number(); 
        row['picture_dir'] = data[5];
        rows.push(row);
        
      })
      .on("end", function(){
          products.bulkCreate(rows);  
          
      });*/
     
      
      for (var index = 0; index < 20; index++) {
        var row = {};
        row['product_name'] = faker.commerce.productName();
        row['product_des'] =  faker.lorem.sentences();
        row['price'] = faker.commerce.price(); 
        row['in_stock'] = faker.random.number();
        row['picture_dir'] = faker.image.image()
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
