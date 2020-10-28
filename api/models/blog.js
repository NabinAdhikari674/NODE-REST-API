const mongoose = require('mongoose');
const User = require('./user');

const blogModel = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    author: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required:"Every blog has it\'s Creator !!"},
    title : {type:String,required:"A blog must have a Title !!"},
    content : {type:String,required:"A blog cannot be made without Content !!"},
    images : Array
});

module.exports = mongoose.model('Blog',blogModel);