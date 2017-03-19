/*
* Created by harirudhra on Wed 25 Jan 2017
*/
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
	eventId:{type:String, required:true},
	matchId:{type:String, required:true},
	teamId:{type:String, required:true},
	playerId:{type:String, default:null},
	minute:{type:String},
	extraMinute:{type:String, default:null},
	type:{type:String},
	assistPlayerId:{type:String},
	relatedEventId:{type:String},
	playerInId:{type:String},
	playerOutId:{type:String}

});

var Event = mongoose.model('Event',EventSchema);
module.exports = Event;