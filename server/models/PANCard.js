/*
* Created by harirudhra on Sat 21 Jan 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var PANCardSchema = new mongoose.Schema({
	user:{type: Schema.Types.ObjectId, ref:'User'},
	panName:{type:String, required:true},
	panNumber:{type:String, required:true},
	panDob:{type:Date, required: true}
});

var PANCard = mongoose.model('PANCard', PANCardSchema);
module.exports = PANCard;