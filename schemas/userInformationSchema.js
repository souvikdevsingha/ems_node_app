var mongoose = require('mongoose')
var Schema = mongoose.Schema;

userInformationSchema = mongoose.Schema({
    designation : String,
    userId : String,
    role : String,
    assignedDate : String,
    assignedBy : String,
    repoterName : String,
    reporterId : String,
    rolecode : String
})

userInfo = mongoose.model( 'UserInfo', userInformationSchema ) ; 
module.exports = userInfo;