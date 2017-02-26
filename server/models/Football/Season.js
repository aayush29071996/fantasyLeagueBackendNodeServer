/*
* Created by harirudhra on Wed 25 Jan 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var SeasonSchema = new mongoose.Schema({

	seasonId:{type:String, required:true},
	competitionId:{type:String, required:true},
	name:{type:String, required:true},
	active:{type:Boolean, default:false},
	competition:{type:Schema.Types.ObjectId, ref:'Competition'}
	
});

var Season = mongoose.model('Season', SeasonSchema);
module.exports = Season;