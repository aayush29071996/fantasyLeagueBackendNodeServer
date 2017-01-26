/**
* Created by harirudhra on Wed 25 Jan 2017
*/
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var PlayerSchema = new mongoose.Schema({
	playerId:{type:String, required:true},
	name:{type:String,required:true},
	positionId:{type:String},
	position:{type:String}
});

var Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
