/*
* Created by harirudhra on Sat 20 May 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;


var PostionPointSchema = new mongoose.Schema({
	goal:{type:Number, default:0},
	goalByAssist:{type:Number, default:0},
	goalByPenalty:{type:Number, default:0},
	goalByPenaltyMissed:{type:Number, default:0},
	goalOwn:{type:Number, default:0},
	cardYellow:{type:Number, default:0},
	cardYellowRed:{type:Number, default:0},
	cardRed:{type:Number, default:0},
	cleanSheet:{type:Number, default:0}
});

var PointSystemSchema = new mongoose.Schema({
	name:{type:String, required:true},
	currentlyActive:{type:Boolean, required:true, default:false},
	defense:PostionPointSchema,
	forward:PostionPointSchema,
	midfield:PostionPointSchema,
	goalkeeper:PostionPointSchema
});

var PointSystem = mongoose.model('PointSystem', PointSystemSchema);
module.exports = PointSystem;