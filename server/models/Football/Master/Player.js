/*
* Created by harirudhra on Fri 17 Feb 2017
*/
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var PlayerSchema = new mongoose.Schema({
	playerId:{type:String, required:true},
	name:{type:String,default:null},
	positionId:{type:String,default:0},
	position:{type:String,default:"None"},
	active:{type:Boolean, default:false},
	teams:[{type:Schema.Types.ObjectId, ref:'Team'}]
});

var Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
