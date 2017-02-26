/*
* Created by harirudhra on Fri 17 Feb 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var PlayerSchema = new mongoose.Schema({
	player:{type:Schema.Types.ObjectId, ref:'Player'},
	points:{type:Number, default:0}
});

var MatchCardSchema = 	new mongoose.Schema({

	user:{type:Schema.Types.ObjectId, ref:'User'},
	match:{type:Schema.Types.ObjectId, ref:'Match'},
	players:[PlayerSchema],
	matchPoints:{type:Number, default:0},
	createdOn:{type:Date}

});

var MatchCard = mongoose.model('MatchCard', MatchCardSchema);
module.exports = MatchCard;

