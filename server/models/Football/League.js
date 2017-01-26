/**
* Created by harirudhra on Wed 25 Jan 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var LeagueSchema = new mongoose.Schema({
	leagueId:{type:String, required:true},
	name:{type:String, required:true},
	active:{type:Boolean}
});

var League = mongoose.model('League', LeagueSchema);
module.exports = League;