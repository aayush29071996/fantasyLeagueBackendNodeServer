/*
* Created by harirudhra on Wed 25 Jan 2017
*/
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
	matchId:{type:String, required:true},
	teamId:{type:String, required:true},
	playerId:{type:String, required:true},
	minute:{type:String},
	extraMinute:{type:String, default:null},
	type:{type:String},
	assistId:{type:String, default:null},
	relatedEventId:{type:String, default:null},
	playerInId:{type:String, default:null},
	playerOutId:{type:String, default:null}

});

var Event = mongoose.model('Event',EventSchema);
module.exports = Event;