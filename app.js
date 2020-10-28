// Request Handler Middleware
const express = require('express');
const app = express();
const morgan = require('morgan');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const blogRoutes = require('./api/routes/blog');
const userRoutes = require('./api/routes/user');
const adminRoutes = require('./api/routes/admin');

const MongoURL = 'mongodb+srv://'+process.env.MongoDB_USER+':'+
    process.env.MongoDB_PW+'@portfoliocluster674.lrxpn.mongodb.net/'+
    process.env.MongoDB_NM+'?retryWrites=true&w=majority';
const connPara = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
};
mongoose.connect(MongoURL,connPara)
    .then(result => console.log("## MongoDB Connection Successful"))
    .catch(error => console.error("## MongoDB Connection Error :\n",error));
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());

app.use((request,response,next) => {
    response.header("Access-Control-Allow-Origin",'*'); //In place of * place the website to allow. * allows everything
    response.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if (request.method === "OPTIONS"){
        response.header('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
        return  response.status(200).json({});
    }
    next();
});

app.use('/blog',blogRoutes);
app.use('/user',userRoutes);
app.use('/admin',adminRoutes);

app.use((request,response,next) => {
    const error = new Error("Request Not Found !");
    error.status = 404;
    next(error);
});
app.use((error,request,response,next) => {
    response.status(error.status || 500);
    response.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;