/*
* Created by harirudhra on Sun 9 Apr 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var UserRankingSchema = new mongoose.Schema({
	user:{type:Schema.Types.ObjectId, ref:'User'},
	matchCard:{type:Schema.Types.ObjectId, ref:'MatchCard'}
});

var LeaderboardSchema = new mongoose.Schema({
	matchId:{type:String, required:true},
	userRankings:[UserRankingSchema]
});

var Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);
module.exports = Leaderboard;