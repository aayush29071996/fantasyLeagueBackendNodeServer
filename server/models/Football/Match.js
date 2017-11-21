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
    shirtNumber:{type:Number},
    position:{type:String},
    posx:{type:Number, default:null},
    posy:{type:Number,default:null},
    additionalPosition:{type:String},
    formationPosition:{type:String},
    shotsTotal:{type:Number, default:0},
    shotsOnGoal:{type:Number, default:0},
    goalsScored:{type:Number, default:0},
    goalsConceded:{type:Number, default:0},
    foulsCommited:{type:Number,default:0},
    foulsDrawn:{type:Number,default:0},
    redcards:{type:Number,default:0},
    yellowcards:{type:Number,default:0},
    crossesTotal:{type:Number,default:0},
    crossesAccuracy:{type:Number,default:0},
    passesTotal:{type:Number,default:0},
    passesAccuracy:{type:Number,default:0},
    assists:{type:Number,default:0},
    offsides:{type:Number,default:0},
    saves:{type:Number,default:0},
    scoredPenalties: {type:Number,default:0},
    missedPenalties:{type:Number,default:0},
    savedPenalties:{type:Number,default:0},
    tackles:{type:Number,default:0},
    blocks:{type:Number,default:0},
    interceptions:{type:Number,default:0},
    clearances:{type:Number,default:0},
    minutesPlayed:{type:Number,default:0},
    points:{type:Number,default:0}
});

var MatchSchema = new mongoose.Schema({
	matchId:{type:String, required:true, unique:true},
	team1Id:{type:String, required:true},
	team2Id:{type:String, required:true},
	status:{type:String},
	active:{type:Boolean, default:false},
	team1Score:{type:Number, default:0},
	team2Score:{type:Number, default:0},
	team1Penalties:{type:Number, default:0},
	team2Penalties:{type:Number, default:0},
	team1Formation:{type:String},
	team2Formation:{type:String},
	team1CoachId:{type:String},
	team2CoachId:{type:String},
	team1StandingPosition:{type:Number},
	team2StandingPosition:{type:Number},
	startingDateTime:{type:Date},
	minute:{type:Number},
	extraMinute:{type:Number},
	injuryTime:{type:Number},
	htScore:{type:String},
	ftScore:{type:String},
	etScore:{type:String},
	seasonId:{type:String, required:true},
	competitonId:{type:String},
	stageId:{type:String},
	roundId:{type:String},
	aggregateId:{type:String},
	venueId:{type:String},
	refreeId:{type:String},
	commentaries:{type:Boolean, default:false},
	attendance:{type:Number},
	weather:WeatherSchema,
	events:[{type:Schema.Types.ObjectId, ref:'Event'}],
	lineup:[LineupSchema],
	autoLineup:{type:Boolean, default:false},
	points:{type:Number, default:0},
	pointsCalculated:{type:Boolean, default:false},
	bonusPointsCalculated:{type:Boolean, default:false},
	leaderboard:{type:Schema.Types.ObjectId, ref:'Leaderboard'},
	matchCompleted:{type:Boolean, default:false},
	pointsCalculationType:{type:Boolean, default:false}
		
});

var Match = mongoose.model('Match', MatchSchema);
module.exports = Match;