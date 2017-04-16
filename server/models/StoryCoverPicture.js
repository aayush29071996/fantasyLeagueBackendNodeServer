/*
 * Created by harirudhra on Fri 14 Apr 2017
 */

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var StoryCoverPictureSchema = new mongoose.Schema({
	story:{type: Schema.Types.ObjectId, ref:'Story'},
	fileName:{type:String},
	filePath:{type:String},
	fileType:{type:String}
});

var StoryCoverPicture = mongoose.model('StoryCoverPicture', StoryCoverPictureSchema);
module.exports = StoryCoverPicture;  