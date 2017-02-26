/*
* Created by harirudhra on Sat 21 Jan 2017
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