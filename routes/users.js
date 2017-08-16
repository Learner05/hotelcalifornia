var express = require('express');
var router = express.Router();
var Verify = require('./verify');
var passport = require('passport');
var User     = require('../models/user');

// Home Page with User Login Options =========================
router.get('/users', Verify.verifyAdminUser, function(req, res, next) {

  User.find({}, function(err, users){
      res.json(users);
  });
  //res.send('respond with a resource');
});


// User Login Page ===========================================

// Show Login Page to the User
router.get('/login', function(req,res,next){
    res.send('Send the Login Page');
});


// Submit Login Page with the email & password ===============

router.post('/login', function(req,res,next){
   passport.authenticate('local', function(err,user,info){
       if(err) return next(err);
       
       if(!user){
           return res.status(401).json({
               err: info
           });
       }
       
       console.log("value of the user"+ user);
       
       req.login(user, function(err){
           
           console.log("error"+ err);
           if (err){
               return res.status(500).json({
               err: 'Could not log in user... lol'
               });
           }
           
           var token = Verify.getToken(user);
           res.status(200).json({
               status : 'Login Successful',
               success: true,
               token  : token   
           });   
       });   
   })(req,res,next);     
});


//Sign up Page with the email & Address ======================

router.post('/signup', function(req, res) {
    User.register(new User({ username : req.body.username }),
      req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        
        if(req.body.firstname){
            user.firstname = req.body.firstname;
        }
        
        if(req.body.lastname){
            user.lastname = req.body.lastname;
        }
        
        if(req.body.admin){
            user.admin = req.body.admin;
        }
        
        user.save(function(err,user){
            passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });
});


// Logout the User ===========================================
router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
