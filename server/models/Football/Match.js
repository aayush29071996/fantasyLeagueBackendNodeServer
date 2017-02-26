/*
* Created by harirudhra on Wed 25 Jan 2017
*/


var mongoose = require('mongoose');
Schema = mongoose.Schema;

var WeatherSchema = new mongoose.Schema({
	code:{type:String},
	type:{type:String},
	icon:{type:String},
	temperature:{type:Number},
	temperatureUnit:{type:String},
	clouds:{type:String},
	humidity:{type:String},
	windSpeed:{type:String},
	windDegree:{type:String}
});

var MatchSchema = new mongoose.Schema({
	matchId:{type:String, required:true},
	team1Id:{type:String, required:true},
	team2Id:{type:String, required:true},
	status:{type:String},
	team1Score:{type:Number, default:0},
	team2Score:{type:Number, default:0},
	team1Penalties:{type:Number, default:0},
	team2Penalties:{type:Number, default:0},
	dateTimeTBA:{type:Boolean, default:null},
	startingDateTime:{type:Date},
	minute:{type:Number},
	extraMinute:{type:Number},
	seasonId:{type:String},
	stageId:{type:String},
	roundId:{type:String},
	venueId:{type:String},
	weather:WeatherSchema,
	events:[{type:Schema.Types.ObjectId, ref:'Event'}]
		
});

var Match = mongoose.model('Match', MatchSchema);
module.exports = Match;