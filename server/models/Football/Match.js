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

var LineupSchema = new mongoose.Schema({
	playerId:{type:String},
	teamId:{type:String},
	team:{type:String},
    position:{type:String},
    shirtNumber:{type:Number},
    assists:{type:Number,default:0},
    foulsCommited:{type:Number,default:0},
    foulsDrawn:{type:Number,default:0},
    goals:{type:Number,default:0},
    offsides:{type:Number,default:0},
    missedPenalties:{type:Number,default:0},
    scoredPenalties: {type:Number,default:0},
    posx:{type:Number, default:null},
    posy:{type:Number,default:null},
    redcards:{type:Number,default:0},
    saves:{type:Number,default:0},
    shotsOnGoal:{type:Number,default:0},
    shotsTotal:{type:Number,default:0},
    yellowcards:{type:Number,default:0},
    type:{type:String},
    points:{type:Number,default:0}
});

var MatchSchema = new mongoose.Schema({
	matchId:{type:String, required:true},
	team1Id:{type:String, required:true},
	team2Id:{type:String, required:true},
	status:{type:String},
	active:{type:Boolean, default:false},
	team1Score:{type:Number, default:0},
	team2Score:{type:Number, default:0},
	team1Penalties:{type:Number, default:0},
	team2Penalties:{type:Number, default:0},
	dateTimeTBA:{type:Boolean, default:null},
	startingDateTime:{type:Date},
	minute:{type:Number},
	extraMinute:{type:Number},
	injuryTime:{type:Number},
	htScore:{type:String},
	ftScore:{type:String},
	etScore:{type:String},
	seasonId:{type:String, required:true},
	stageId:{type:String},
	roundId:{type:String},
	venueId:{type:String},
	weather:WeatherSchema,
	events:[{type:Schema.Types.ObjectId, ref:'Event'}],
	lineup:[LineupSchema],
	points:{type:Number, default:0},
	pointsCalculated:{type:Boolean, default:false}
		
});

var Match = mongoose.model('Match', MatchSchema);
module.exports = Match;