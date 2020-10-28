const roleConfig = require('./roles.json');
const {ROLES,LEVELS,ACTIONS,PERMISSIONS} = roleConfig;

const warnStr = '\x1b[33m'+'\x1b[1m'+'WARNING (from \'roles.js\') : '+'\x1b[22m'+'In \'roles.json\' : '; // x1b[36m //BLUE

//checking for consistency in the roles.json file
Object.entries(PERMISSIONS).forEach(role=> {
    if(!ROLES.includes(role[0])){
        console.warn(warnStr,'ROLES not Consistent, ',role[0],' not Found in ROLES config.','\x1b[0m');
    }
    Object.entries(role[1]).forEach(level=> {
        if(!LEVELS.includes(level[0])){
            console.warn(warnStr,'LEVELS not Consistent, ',role[0]+'.'+level[0],' not Found in LEVELS config.','\x1b[0m');
        }
        Object.entries(level[1]).forEach(action=> {
            if(!ACTIONS.includes(action[1])){
                console.warn(warnStr,'ACTIONS not Consistent, ',role[0]+'.'+level[0]+'.'+action[1],' not Found in ACTIONS config.','\x1b[0m');
            }
        });
    });
});

exports.authorize = (request,response,next)=> {
    console.log(request.userData);
    next()
};
