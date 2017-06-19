var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
Schema = mongoose.Schema;

var ComplaintSchema = 	new mongoose.Schema({
    ticketId:{type:Number},
	user:{type:Schema.Types.ObjectId, ref:'User'},
	complain:{type: String},
	status:{type:String, enum:['IN PROGRESS', 'RESOLVED'], default:'IN PROGRESS'},
	createdOn:{type:Date},
	resolvedOn:{type:Date}

});
ComplaintSchema.plugin(autoIncrement.plugin, {
    model: 'Complaint',
    field: 'ticketId',
    startAt: 100000,
    incrementBy: parseInt(Math.random()*100)+1
});
var Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports = Complaint;
