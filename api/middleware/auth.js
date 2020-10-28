const jwt = require('jsonwebtoken');

//authorization token required with value  as : Bearer jwt_token_value
module.exports = (request,response,next)=> {
    try {
        let token = request.headers.authorization.split(' ')[1];
        const loggedUser = jwt.verify(token,process.env.JWT_KEY);
        request.loggedUser = loggedUser;
        next();
    } catch (error){
        return response.status(401).json({
            message : "Auth Failed. Try Again !!"
        })
    }
};