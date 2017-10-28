/*
* Created by harirudhra on Fri 17 Feb 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var PlayerSchema = new mongoose.Schema({
	playerId:{type:String, required:true},
	name:{type:String,required:true},
	positionId:{type:String,default:0},
	position:{type:String,default:"None"},
	active:{type:Boolean, default:false},
	points:{type:Number, default:0}
});

var MatchCardSchema = new mongoose.Schema({

	user:{type:Schema.Types.ObjectId, ref:'User'},
	matchId:{type:String, required:true},
	match:{type:Schema.Types.ObjectId, ref:'Match'},
	players:[PlayerSchema],
	matchPoints:{type:Number, default:0},
	createdOn:{type:Date}

});

var MatchCard = mongoose.model('MatchCard', MatchCardSchema);
module.exports = MatchCard;

