/*
* Created by harirudhra on Wed 25 Jan 2017
*/


//Added shortName and duplicateLogo datatypes by Aayush

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var TeamSchema = new mongoose.Schema({
	teamId:{type:String, required:true, unique:true},
	name:{type:String, required:true},
	shortName:{type:String, default:null},
	logo:{type:String},
	duplicateLogo:{type:String, default: null},
	tshirtDesign:{type:String, default: null},
	active:{type:Boolean,default:false},
	players:[{type:Schema.Types.ObjectId, ref:'Player'}],
	competitions:[{type:Schema.Types.ObjectId, ref:'Competition'}]
});

var Team = mongoose.model('Team', TeamSchema);
module.exports = Team;