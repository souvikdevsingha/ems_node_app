const { check, validationResult } = require('express-validator');
class Validators{
    validateUserReq(){
        console.log('in')
        return [
            check('username','username : Enter a Valid Username').notEmpty().isLength({min:8, max:20}),
            check('password','Password : Enter a valid password ').notEmpty().isLength({min:6,max:15}),
            check('email','Email : Enter a valid Email Address').notEmpty().isEmail().isLength({min:5,max:30}),
            check('role',"Role : Enter a Valid Role").notEmpty(),
            check('haveAllPermission','Consent : Have All Permission?Must be selected').notEmpty().isBoolean(),
            check('name','Name : Enter a valid Name').notEmpty().isLength({min:5,max:30}),
        ]
    }

    validateUserInfoReq(){
        return [
            check('designation', "Designation : Designation is required").notEmpty(),
            check('userId', "User Id : Invalid userId").notEmpty(),
            check('role', "Role : Invalid role").isIn(["ADMIN","USER","SUBADMIN"]),
            check('assignedBy','Assigned By : Input Required').notEmpty(),
            check('repoterName','Reporter Name : Input Required').notEmpty(),
            check('reporterId','Reporter Id : Input Required').notEmpty(),
            check('rolecode','Role Code : Invalid Role Code').notEmpty().isIn(['MGR','ASM','JDV','SRDV','TL','HED'])
        ]
    }
}

module.exports = new Validators();