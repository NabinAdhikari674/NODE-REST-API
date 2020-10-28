const ROLE = {
    ADMIN : 'admin',
    STAFF : 'staff',
    CLIENT : 'client',
    BASIC : 'basic'
}

exports.authROLE = (request,response,next)=> {
    if (request.userData.ROLE === 'ADMIN' || request.params){
        next()
    }
    else if (request.userData.ROLE){

    }
};