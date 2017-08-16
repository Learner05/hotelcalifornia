var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ItemSchema = new Schema ({
    
    name       : {type: String, required: true,unique: true},
	image      : {type: String, required: true},
	category   : {type: String, required: true},
    details    : [{
        size   : {type: String, required: true},
        price  : {type: Number, required: true}
    }],
	description: {type: String, required: true}
},{timestamps: true});
    

var Items = mongoose.model('item', ItemSchema);

module.exports = Items;