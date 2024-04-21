var mongoose = require('mongoose')
var Schema = mongoose.Schema;

tokenSchema = mongoose.Schema({
    token : String,
    createdAt : String,
    validTill : String
})

Token = mongoose.model('TokenSchema',tokenSchema);
module.exports = Token;