/*
 * Created by harirudhra on Fri 14 Apr 2017
 */

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
	user:{type:Schema.Types.ObjectId, ref:'User'},
	comment:{type:String},
	createdOn:{type:Date}
});

var StorySchema = new mongoose.Schema({
	user:{type:Schema.Types.ObjectId, ref:'User', required:true},
	status:{type:String, enum:['CREATED', 'APPROVED' ,'PUBLISHED','REPORTED'], default:'CREATED'},
	category:{type:Schema.Types.ObjectId, ref:'Category'},
	title:{type:String},
	content:{type:String},
	titleTeaser:{type:String},
	teaserContent:{type:String},
	coverPicture:{type:String},
	//coverPicture:{type:Schema.Types.ObjectId, ref:'StoryCoverPicture'},
	countsView:{type:Number,default:0},
	likes:[{type:Schema.Types.ObjectId, ref:'User'}],
	shares:[{type:Schema.Types.ObjectId, ref:'User'}],
	trendIndex:{type:Number, default:0},
	comments:[CommentSchema],
	reports:[CommentSchema],
	createdOn:{type:Date},
	approvedOn:{type:Date},
	publishedOn:{type:Date}
});

var Story = mongoose.model('Story', StorySchema);
module.exports = Story;