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
	resetPasswordToken:{type:String},
	resetPasswordExpires:{type:Date},
	avatar:{type:String},
	location:{
	  city: {type:String},
	  country: {type:String},
	  countryCode: {type:String},
	  isp: {type:String},
	  lat: {type:Number},
	  lon: {type:Number},
	  ip: {type:String},
	  region: {type:String},
	  regionName: {type:String},
	  timezone: {type:String},
	  zip: {type:String}
	},
	dob:{type:Date, required:true},
	token:{type:String, required:true},
	status:{type:String, enum:['ACTIVE', 'INACTIVE' ,'BLOCKED'], default:'ACTIVE'},
	createdOn:{type:Date, required: true},
	userPoints:{type:Number, default:1}
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.'});
