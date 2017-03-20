/*
* Created by harirudhra on Wed 25 Jan 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var TeamSchema = new mongoose.Schema({
	teamId:{type:String, required:true},
	name:{type:String, required:true},
	logo:{type:String},
	active:{type:Boolean,default:false},
	players:[{type:Schema.Types.ObjectId, ref:'Player'}],
	competitions:[{type:Schema.Types.ObjectId, ref:'Competition'}]
});

var Team = mongoose.model('Team', TeamSchema);
module.exports = Team;