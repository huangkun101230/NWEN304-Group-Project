var connectionString = process.env.DATABASE_URL || "postgres://root@localhost:5432/shopping";
var ssn;
module.exports = {
    connectionString: connectionString,
    session: ssn,
    'facebookAuth' : {
		'clientID': '675930815939700',
		'clientSecret': '4b00bc00558f4ffb95a9c85f6395ea57',
		'callbackURL': 'http://localhost:8080/auth/facebook/callback'
	}
}