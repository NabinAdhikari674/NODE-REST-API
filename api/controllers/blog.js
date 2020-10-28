const mongoose = require('mongoose');

const Blog = require('../models/blog');

exports.get_all_blogs = (request,response,next) => {
    Blog.find()
        .exec()
        .then(result => {
            console.log(result);
            response.status(200).json({
                message : "Blogs Retrived.",
                blogs : result
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

exports.get_a_blog = (request,response,next) => {
    Blog.findById(request.params.blogId)
        .exec()
        .then(result => {
            console.log(result);
            if (result){
                response.status(200).json({
                    message : "Requested Blog Found.",
                    blog : result
                });
            } else {
                response.status(404).json({
                    message:"No Blog Entry Found by that ID !!"
                });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message : "Error While Retrieving Requested Blog !!",
                error:error
            });
        });
};

exports.create_blog = (request,response,next) => {
    const filePaths =[];
    try{
        request.files.forEach(file => {
            filePaths.push(file.path);      
        });
    } catch{}
    let blog = new Blog({
        _id : new mongoose.Types.ObjectId(),
        title : request.body.title,
        author : request.loggedUser.id,
        content : request.body.content,
        images : filePaths
    });
    blog.save()
        .then(result => {
            console.log(result);
            response.status(201).json({
                message : "Blog Created Sucessfully.",
                blog : blog
            });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message : "Error During Blog Creation !!",
                error:error
            });
        });
};

exports.patch_blog = (request,response,next) => {
    const updateOpts = {};  // url : blog/blogId json : [ {"modFied" : "field to be updated/modified","value":"new value of the field" }, ]
    for (const opt of request.body){
        updateOpts[opt.modField] = opt.value;
    }
    Blog.updateOne({ _id : request.params.blogId },
        { $set: updateOpts })
        .exec()
        .then(result => {
            console.log(result);
            response.status(200).json({
                message : "Blog Updated Sucessfully.",
                updatedBlog : result
            });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message : "Error While Updating Blog !!",
                error:error
            });
        })
};

exports.delete_blog = (request,response,next) => {
    Blog.findByIdAndDelete(request.params.blogId)
        .exec()
        .then(result => {
            console.log(result);
            response.status(200).json({
                message : "Blog Deleted Sucessfully.",
                deletedBlog : result
            });
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({
                message : "Error While Deleting Blog !!",
                error:error
            });
        });
};