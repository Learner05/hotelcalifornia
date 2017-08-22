var express     = require('express');
var orderRouter = express.Router();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var Verify      = require('./verify');
var orders      = require('../models/orders');



orderRouter.use(bodyParser.json());

orderRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    
    orders.find({})
    .populate('orderedby')
    .exec(function(err,orders){
        if (err) throw err;
        res.json(orders);
    });
})
.post(Verify.verifyAdminUser, function(req,res,next){
    
    orders.create(req.body, function(err, order){
        if (err) throw err;
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('Added the Dish with an ID: ' + order.id);
    });
})

.delete(Verify.verifyAdminUser, function(req,res,next){
    
    orders.remove({}, function(err,result){
        if (err) throw err;
        res.json(result);
    });
});


orderRouter.route('/:order_id')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    orders.find({'_id' : req.params.order_id}, function(err, order){
        if (err) throw err;
        res.json(order);
    });
})  
.put(Verify.verifyAdminUser, function(req,res,next){
    orders.updateOne({'_id' : req.params.order_id}, 
    {$set : req.body},
    {new : true},function(err, result){
        if (err) throw err;
        orders.find({'_id' : req.params.order_id}, function(err, order){
        if (err) throw err;
        res.json(order);
    });
    });
})
.delete(Verify.verifyAdminUser, function(req,res,next){
    orders.deleteOne({'_id' : req.params.order_id}, function(err, result){
        if (err) throw err;
        orders.find({}, function(err, orders){
        if (err) throw err;
        res.json(orders);
    });
});
});

module.exports = orderRouter;