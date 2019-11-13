var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UsersModel = new Schema({
    name : { type : String },
    email  : { type : String, unique : true },
    password : { type : String},
    oldPassword : { type : Array },
    attemptStatus : { type : Boolean, default : false },
    createdDate : { type : Date, default: Date.now }
})
module.exports = mongoose.model('User',UsersModel)