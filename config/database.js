var connectionString = process.env.DATABASE_URL || "postgres://root@localhost:5432/shopping";
var pg = require('pg');
var client = new pg.Client(connectionString);
var sleep = require('sleep');
sleep.sleep(5); // its a hack to wait for the db to start 


client.connect(function(err, client) {
    if (err) {
        throw err;
    }
});

module.exports = client;
