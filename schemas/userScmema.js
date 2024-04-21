var mongoose = require('mongoose')
var Schema = mongoose.Schema;

userSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String,
    role : String,
    haveAllPermission : Boolean,
    userId : String,
    name : String
})

User = mongoose.model('UserSchema',userSchema);
module.exports = User;