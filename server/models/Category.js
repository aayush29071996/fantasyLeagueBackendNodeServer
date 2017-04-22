/*
 * Created by harirudhra on Fri 14 Apr 2017
 */

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var CategorySchema = new mongoose.Schema({
	name:{type:String}
});

var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;