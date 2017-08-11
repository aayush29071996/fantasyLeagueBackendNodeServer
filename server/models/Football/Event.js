/*
* Created by harirudhra on Wed 25 Jan 2017
*/
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
	eventId:{type:String},
	matchId:{type:String},
	teamId:{type:String},
	playerId:{type:String},
	playerName:{type:String},
	minute:{type:String},
	extraMinute:{type:String},
	type:{type:String},
	relatedPlayerId:{type:String},
	relatedPlayerName:{type:String},
	reason:{type:String},
	injuried:{type:String},
	computed:{type:Boolean, default:false}
});

var Event = mongoose.model('Event',EventSchema);
module.exports = Event;