	/*
	* Created by harirudhra on Wed 25 Jan 2017
	*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var CompetitionSchema = new mongoose.Schema({
	competitionId:{type:String, required:true, unique:true},
	name:{type:String, required:true},
	active:{type:Boolean},
	currentSeason:{type:String}
});

var Competition = mongoose.model('Competition', CompetitionSchema);
module.exports = Competition;