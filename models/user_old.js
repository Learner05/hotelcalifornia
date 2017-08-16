var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema ({ 
    
    email: String,
    password: String,
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: '' 
   },
    status : {
      type: String,
      required: true,
      default: 'Active'     
    },
    admin:   {
      type: Boolean,
      default: false
    }
},{timestamps: true});

User.methods.getName = function(){
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);
//User.plugin(passportLocalMongoose, {usernameField : email});

module.exports = mongoose.model('User', User);