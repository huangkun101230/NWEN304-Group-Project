var appRoot = require('app-root-path');
var client = require(appRoot+'/config/database.js');
var faker = require('faker');

client.query("CREATE TABLE IF NOT EXISTS  users (user_id  SERIAL PRIMARY KEY NOT NULL, username  TEXT NOT NULL, password  TEXT NOT NULL)", 
function(err, result) {
    if (err) {
      throw err;
    }
});
/*
client.query("CREATE TABLE IF NOT EXISTS  user_cart (id SERIAL  PRIMARY KEY NOT NULL, user_id BIGINT , items BIGINT[])", 
function(err, result) {
    if (err) {
      throw err;
    }
});
*/
client.query("CREATE TABLE IF NOT EXISTS  products (products_id  SERIAL PRIMARY KEY NOT NULL, product_name TEXT NOT NULL, product_des TEXT NOT NULL,price TEXT,in_stock INTEGER, picture_dir TEXT);", 
function(err, result) {
    if (err) {
      throw err;
    }
});

var empty = [];
var productsQuery = client.query("SELECT count(*) FROM (SELECT 1 FROM products LIMIT 1) AS t", 
  function(err, result) {
      if (err) {
        throw err;
      }
         
});

productsQuery.on('row', function(row) {
  empty.push(row);
});
// After all data is returned, close connection and return results
productsQuery.on('end', function() {
  //res.json(login);
  empty = JSON.stringify(empty);
  empty = JSON.parse(empty)[0].count
});

if (empty == 0) {
  for (var index = 0; index < 50; index++) {
    client.query("INSERT INTO products (product_name,product_des,price,in_stock) VALUES ($1,$2,$3,20)",[faker.commerce.productName(),faker.lorem.sentences(),faker.commerce.price()], 
    function(err, result) {
        if (err) {
          throw err;
        }
    });
    
  }
}