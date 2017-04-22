/*
 * Created by harirudhra on Fri 14 Apr 2017
 */

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var ProfilePictureSchema = new mongoose.Schema({
	user:{type: Schema.Types.ObjectId, ref:'User'},
	fileName:{type:String},
	filePath:{type:String},
	fileType:{type:String}
});

var ProfilePicture = mongoose.model('ProfilePicture', ProfilePictureSchema);
module.exports = ProfilePicture;  