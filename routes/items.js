var express = require('express');
var itemsRouter  = express.Router();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Verify  = require('./verify');
var items   = require('../models/items');




itemsRouter.use(bodyParser.json());

itemsRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    
    items.find({}, function(err,items){
        if (err) throw err;
        res.json(items);
    });
})
.post(Verify.verifyAdminUser, function(req,res,next){
    
    items.create(req.body, function(err, items){
        if (err) throw err;
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('Added the Dish with an ID: ');
    });
})

.delete(Verify.verifyAdminUser, function(req,res,next){
    
    items.remove({}, function(err,result){
        if (err) throw err;
        res.json(result);
    });
});





module.exports = itemsRouter;


