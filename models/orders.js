var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var OrderSchema = new Schema ({
    
    ordernum    : {type: String},
    orderdetails : [{
        dishId    : {type: String, required: true},
        dishPrice : {type: Number, required: true}
    }], 
    dishcount   : {type: Number, required: true},
    ordertotal  : {type: Number, required: true},
    orderedby   : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
},{timestamps: true});
    

var Orders = mongoose.model('order', OrderSchema);

module.exports = Orders;