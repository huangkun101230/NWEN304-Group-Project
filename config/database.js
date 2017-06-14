<<<<<<< Updated upstream
var connectionString = process.env.DATABASE_URL || "postgres://huangkun:123@depot:5432/shopping";
var pg = require('pg').native;
=======
var connectionString = process.env.DATABASE_URL || "postgres://root:123@localhost:5432/shopping";
var pg = require('pg');
>>>>>>> Stashed changes
var client = new pg.Client(connectionString);


client.connect(function(err, client) {
    if (err) {
        throw err;
    }
});

module.exports = client;