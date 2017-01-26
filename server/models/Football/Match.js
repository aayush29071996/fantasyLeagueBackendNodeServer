/**
* Created by harirudhra on Wed 25 Jan 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var MatchSchema = new mongoose.Schema({
	matchId:{type:String, required:true},
	homeTeamId:{type:String, required:true},
	awayTeamId:{type:String, required:true},
	status:{type:String},
	homeScore:{type:Number, default:0},
	awayScore:{type:Number, default:0},
	homePenalties:{type:Number, default:0},
	awayPenalties:{type:Number, default:0},
	dateTimeTBA:{type:Boolean, default:null},
	startingDateTime:{type:Date},
	minute:{type:Number},
	extraMinute:{type:Number},
	seasonId:{type:String},
	roundId:{type:String},
	venueId:{type:String},
	events:[EventSchema]
		
});

var Match = mongoose.model('Match', MatchSchema);
module.exports = Match;