var User   = require('../models/user');
var jwt    = require('jsonwebtoken');

var config = require('../config/database');

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {
        expiresIn : 3600
    });
};

exports.verifyOrdinaryUser = function(req, res, next){
    
    // check token received in the request
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
        
        jwt.verify(token, config.secretKey, function(err, decoded){
            if (err) {
                var err = new Error('You are not Authenticated');
                err.status = 401;
                return next(err);
            } else {
                req.decoded = decoded;
                next();
            }
        });    
    } else {
        var err = new Error('No Token Provided');
        err.status = 403;
        return next(err);  
    }
};


exports.verifyAdminUser = function(req, res, next){
    
    // check token received in the request
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
        
        jwt.verify(token, config.secretKey, function(err, decoded){
            if (err) {
                console.log(err);
                var err = new Error('You are not Authenticated');
                err.status = 401;
                return next(err);
            } else {
                req.decoded = decoded;
                if (req.decoded._doc.admin){  
                      next();
                } else {
                  var err = new Error('Not an Admin');
                  err.status = 403;
                  return next(err);       
                }
            }
        });    
    } else {
        var err = new Error('No Token Provided');
        err.status = 403;
        return next(err);  
    }
};