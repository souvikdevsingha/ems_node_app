var mongoose = require('mongoose')
var Schema = mongoose.Schema;

menuSchema = mongoose.Schema({
    menuHeadname : String,
    allowedUser : Array,
    submenu : Array
})

Menu = mongoose.model('MenuSchema',menuSchema);
module.exports = Menu;