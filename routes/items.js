var express = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Verify  = require('./verify');
var items   = require('../models/items');


var itemsRouter  = express.Router();
itemsRouter.use(bodyParser.json());

itemsRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    
    items.find({}, function(err,items){
        if (err) throw err;
        res.json(items);
    });
})
.post(Verify.verifyAdminUser, function(req,res,next){
    
    items.create(req.body, function(err, item){
        if (err) throw err;
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('Added the Dish with an ID: ' + item.id);
    });
})

.delete(Verify.verifyAdminUser, function(req,res,next){
    
    items.remove({}, function(err,result){
        if (err) throw err;
        res.json(result);
    });
});

//=============================================================================

itemsRouter.route('/:item_id')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    items.find({'_id' : req.params.item_id}, function(err, item){
        if (err) throw err;
        res.json(item);
    });
})  
.put(Verify.verifyAdminUser, function(req,res,next){
    items.updateOne({'_id' : req.params.item_id}, 
    {$set : req.body},
    {new : true},function(err, result){
        if (err) throw err;
        items.find({'_id' : req.params.item_id}, function(err, item){
        if (err) throw err;
        res.json(item);
    });
    });
})
.delete(Verify.verifyAdminUser, function(req,res,next){
    items.deleteOne({'_id' : req.params.item_id}, function(err, result){
        if (err) throw err;
        items.find({}, function(err, items){
        if (err) throw err;
        res.json(items);
    });
});
});

module.exports = itemsRouter;


