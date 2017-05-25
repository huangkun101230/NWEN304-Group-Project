var connectionString = process.env.DATABASE_URL || "postgres://root@localhost:5432/shopping";
var pg = require('pg');
var client = new pg.Client(connectionString);
client.connect(function(err, client) {
    if (err) {
        throw err;
    }
});

module.exports = client;