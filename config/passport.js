var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var users = require('../models');
var configAuth = require('./auth');

module.exports = function(passport) {
	passport.serializeUser(function(user, done){
		console.log("serializeUser" + user);
		done(null, user.id);	//save user.id in the session
	});

	passport.deserializeUser(function(id, done){
		models.users.findById(id, function(err, user){		//retrieve the object
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy(
	function(username, password, done){
		process.nextTick(function(){
			console.log(data);
			models.users.findOrCreate({
    			where: {
      				username: username,
      				password: password
    			},
    			defaults: {
      				username: username,
      				password: password
    			}
  			}).spread(function(user,created){
    			if (created) {
      				
      				var dbName = username+"_cart" 
      				models.sequelize.define(dbName,{
        			id: {
          				allowNull: false,
          				autoIncrement: true,
          				primaryKey: true,
          				type: models.Sequelize.INTEGER
        			},
        			product_id: models.Sequelize.INTEGER,
        			amount: models.Sequelize.INTEGER
      				});
      				models.sequelize.sync()
      				.then(function(){
						done(null,user);
		        	})
      				.catch(function(err){
      					done(null, false, {message: 'The emial already taken'});
      				});
    			} else {
						done(null,false, {message: 'Already added user'});		
					}
  			});
		});
	}));


	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			var data = req.body
    		models.users.findOne({ 
        		where: {
            		username: data.user
        		} 
    		}).then(function(user){
        		if (user != null) {
            		// ssn = req.session;
            		// ssn.user = data.user;
            		// ssn.pass = data.pass;
					done(null, user);            
        		} else {
        			done(null, false, {message:'wrong username or password'});
        		}
				return done(null, user);
			});
		});
	}));


	// passport.use(new FacebookStrategy({
	//     clientID: configAuth.facebookAuth.clientID,
	//     clientSecret: configAuth.facebookAuth.clientSecret,
	//     callbackURL: configAuth.facebookAuth.callbackURL
	// },
	// function(accessToken, refreshToken, profile, done) {
	//     process.nextTick(function(){
	//     	User.findOne({'facebook.id': profile.id}, function(err, user){
	//     		if(err)
	//     			return done(err);
	//     		if(user)
	//     			return done(null, user);
	//     		else {
	//     			var newUser = new User();
	//     			newUser.facebook.id = profile.id;
	//     			newUser.facebook.token = accessToken;
	//     			newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	//     			newUser.facebook.email = profile.emails[0].value;

	//     			newUser.save(function(err){
	//     				if(err)
	//     					throw err;
	//     				return done(null, newUser);
	//     			})
	//     			console.log(profile);
	//     		}
	//     	});
	//     });
	// }));
};
