/*
* Created by harirudhra on Sat 21 Jan 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
	name:{type:String},
	username:{type:String, required: true, unique: true },
	email:{type: String, required: true, unique:true},
	password:{type:String, required:true},
	dob:{type:Date, required:true},
	token:{type:String, required:true},
	status:{type:String, enum:['ACTIVE', 'INACTIVE' ,'BLOCKED'], default:'ACTIVE'},
	createdOn:{type:Date, required: true},
	userPoints:{type:Number, default:0}
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.'});