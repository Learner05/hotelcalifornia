var LocalStrategy  = require('passport-local').Strategy;
var User           = require('../models/users');


module.export      = function(app, passport){
  
    //===================================================================================================
    // Passport Session Setup
    //===================================================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });    
    
    
     // ================================================================================================
    // LOCAL SIGNUP 
    // =================================================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true    // allows us to pass back the entire request to the callback    
    }, function(req, email, password, done){
        
        //asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function(){
        
            User.findOne({local.email : email}, function(err, user){

                if (err) throw err;

                if (User) {
                    console.log ("existing user, please login");
                    return done(null, false);
                } else {

                    var newUser = new User();

                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err, user){
                        if (err) throw err;
                        return done(null, newUser);

                    }); 
                }
            });
        });
    }));
                                                  
    
    // ================================================================================================
    // LOCAL LOGIN 
    // ================================================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    
    passport.use('local-login', new LocalStrategy({
        
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true  
    },
     function(req, email, password, done){
        
        User.findOne({'local.email': email}, function(err, user){
            
            
            if (err) return done(err);
            
            if (!user) return done(null, false, req.flash('loginMessage', 'No User Found.'));
            
            if(!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops, Wrong Password'));
            
            return done(null, user);
            
        });   
    }));
    
};