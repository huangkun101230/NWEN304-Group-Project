var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var models = require('../models');
var configAuth = require('./auth');

module.exports = function(passport) {
	passport.serializeUser(function(user, done){
		done(null, user);	//save user.id in the session
	});

	passport.deserializeUser(function(id, done){
      models.users.findById(id).then(function(user) {
        if(user){
          done(null, user.get());
        }
        else{
          done(user.errors,null);
        }
      });
	});


	passport.use('local-signup', new LocalStrategy(
		function(username, password, done){
			models.users.findOne({
				where: {
					username: username,
					password: password
				} 
			})
			.then(function(result){
				if(result){
					return done(null,false,{message: "already created"});
				} else{
					models.users.create({
						username: username,
						password: password
					})
					.then(function(newUser){
						if(!newUser){
							return done(null,false,{message: "user was not created"});
						} else{
							//return done(null,newUser);
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
								done(null,newUser);
							})
							.catch(function(err){
								done(null, false, {message: err});
							});
						}
					})
					.catch(function(err){
						return done(null,false,{message: err});
					});
				}
			})
			.catch(function(err){
				return done(null,false,{message: err})
			})		
			
		})
	);


	passport.use('local-login', new LocalStrategy(
	function(username, password, done){
		process.nextTick(function(){
    		models.users.findOne({ 
        		where: {
            		username: username
        		} 
    		}).then(function(user){
        		if (user != null) {
					done(null, user);            
        		} else {
        			done(null, false, {message:'wrong username or password'});
        		}
				
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
