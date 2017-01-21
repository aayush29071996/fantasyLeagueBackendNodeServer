/**
* Created by harirudhra on Sun 1 Jan 2017
*/
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var InviteSchema = new mongoose.Schema({
	email: {type: String, required:true}
})

var Invite = mongoose.model('Invite', InviteSchema);
module.exports = Invite;