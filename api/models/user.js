const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : {
        type:String,
        unique:true,
        required:'Email Cannot be Blank !!',
        match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    username : {type:String,unique:true,required:'Username Cannot be Blank !!'},
    password : {type:String, required:'Must Enter Password !!'},
    avatar : String,
    firstName :String,
    lastName : String,
    phone : {
        number: String,
        countryCode : String,
    },
    updated: { type: Date,required:true,default:Date.now},
    dateJoined : {type:Date,required:true,default:Date.now,immutable:true}
});

module.exports = mongoose.model('User',userModel);