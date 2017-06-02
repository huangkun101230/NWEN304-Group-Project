var connectionString = process.env.DATABASE_URL || "postgres://root@localhost:5432/shopping";
var ssn;
module.exports = {
    connectionString: connectionString,
    session: ssn
}