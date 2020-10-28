const { response } = require("express");
const Blog = require('../../models/blog');

const roles = require('./roles.js');

exports.auth = function (role) {
    return(request,response,next)=> {
        if(role ==='CREATE'){
            //console.log("Creation of Blog");
            next()
        } else {
            Blog.findById(request.params.blogId)
            .then( result=> {
                if (!result){
                    response.status(404).json({
                        message:"No Blog Entry Found by that ID !!"
                    });
                }
                else{
                    if(role ==='PATCH' || role === 'DELETE') {
                        if(result.author == request.loggedUser.id) {
                            //console.log("Result : ",result);
                            next()
                        } else {
                            //console.log("blog aother : ",result.author);
                            //console.log("logged : ",request.loggedUser.id);
                            response.status(403).json({
                                message:"You are not Authorized to perform the action !!"
                            });
                        }                   
                    }                   
                }
            })
            .catch( error => {
                console.error(error);
                response.status(500).json({
                    message : "Error While Retrieving Requested Blog !!",
                    error:error
                });
            });
        }
        
    }
}