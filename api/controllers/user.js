const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.get_all_users = (request,response,next) => {
    User.find()
        .exec()
        .then(result => {
            response.status(200).json({
                message : "Users Retrived.",
                users : result
            });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message : "Error While Retrieving Blogs !!",
                error : error
            });
        });
};

exports.get_a_user = (request,response,next) => {
    User.findById(request.params.userId)
        .exec()
        .then(result => {
            console.log(result);
            if (result){
                response.status(200).json({
                    message : "Requested User Found.",
                    user : result
                });
            } else {
                response.status(404).json({
                    message:"No User Found by that ID !!"
                });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message : "Error While Retrieving Requested User Details !!",
                error:error
            });
        });
};

exports.signup_user = (request,response,next)=> {
    let avatarPath ="";
    if(request.file){
        avatarPath=request.file.path;
    }
    User.findOne({$or:[{'email':request.body.email},{'username':request.body.username}]})
        .exec()
        .then(user=> {
            if(user){
                if (user.username === request.body.username){
                    return response.status(409).json({
                        message : "User with that Username already Exists !!"
                    });   
                } else if (user.email === request.body.email){
                    return response.status(409).json({
                        message : "User with same Email already Exists !!"
                    });
                } 
            } else{
                bcrypt.hash(request.body.password,10,(error,hash)=> {
                    if (error){
                        return response.status(500).json({
                            message : "Password could not be Hashed !!",
                            error : error
                        });
                    } else{
                        let user = new User({
                            _id : new mongoose.Types.ObjectId(),
                            email : request.body.email,
                            username : request.body.username,
                            password : hash,
                            avatar : avatarPath,
                            firstName : request.body.firstName,
                            lastName : request.body.lastName,
                            phone : {
                                number : request.body.number,
                                countryCode : request.body.countryCode
                            }
                        });
                        user.save()
                        .then(result => {
                            //console.log(result);
                            response.status(201).json({
                                message : "User Created Sucessfully.",
                                createdUser : {
                                    userId : result._id,
                                    username : result.username,
                                    email : result.email
                                }
                            });
                        })
                        .catch(error => {
                            console.error(error);
                            response.status(500).json({
                                message : "Error During User Sign Up !!",
                                error:error
                            });
                        });
                    }
                });
            }
        });

    
};

exports.login_user = (request,response,next) => {
    User.findOne({$or:[{'email':request.body.user},{'username':request.body.user}]})
    .exec()
    .then(user=> {
        if(user){
            bcrypt.compare(request.body.password,user.password,(error,result)=>{
                if(error){
                    return response.status(500).json({
                        message : "Auth Failed. Try Again !!"
                    });
                }
                if(result){
                    const token = jwt.sign({
                        _id : user._id,
                        username : user.username
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn : "10 days"
                        });
                    response.status(200).json({
                        message : "User Logged In. Auth Successful.",
                        token : token
                    });
                }
                else{
                    response.status(401).json({
                        message : "User/Password Not Found/Correct !!"
                    });
                }
            });
        }
        else{
            response.status(401).json({
                message : "User/Password Not Found/Correct !!"
            });
        }
    })
    .catch(error => {
        console.error(error);
        response.status(500).json({
            message : "Error While Logging In.Try Again !!",
            error:error
        });
    });

};

exports.patch_user = (request,response,next) => {
    const updateOpts = {};  // url : blog/blogId json : [ {"modFied" : "field to be updated/modified","value":"new value of the field" }, ]
    for (const opt of request.body){
        updateOpts[opt.modField] = opt.value;
    }
    User.updateOne({ _id : request.params.userId },
        { $set: updateOpts })
        .exec()
        .then(result => {
            console.log(result);
            response.status(200).json({
                message : "User Details Updated Sucessfully.",
                updatedUser : result
            });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message : "Error While Updating User Details !!",
                error:error
            });
        })
};

exports.delete_user = (request,response,next) => {
    User.findByIdAndDelete(request.params.userId)
        .exec()
        .then(result => {
            console.log(result);
            response.status(200).json({
                message : "User Deleted Sucessfully.",
                deletedUser : {
                    email : result.email,
                    username: result.username
                }
            });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message : "Error While Deleting the User !!",
                error:error
            });
        });
};