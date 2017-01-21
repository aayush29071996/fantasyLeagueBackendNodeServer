/**
* Created by harirudhra on Sat 21 Jan 2017
*/
var User = require('../models/User');
var HttpStatus = require('http-status');
var Validation = require('./Validation');
var moment = require('moment');
var trim = require('trimmer');
var crypto = require('crypto');
var key = 'jallikattu';

var errorMsg = {
	UNEXP_ERROR : 'unexpected error in accessing data',
	USER_NOT_FOUND : 'user not found',
	EMAIL_IN_USE : 'email already in use',
	USERNAME_IN_USE : 'username already in use',
	MOBILE_IN_USE : 'mobile number in use',
	INVALID_PASS: 'username and password does not match'
}

var status = {
	SUCCESS : 'success',
	FAILURE : 'failure'
}

var httpStatus = {
	OK : HttpStatus.OK,
	ISE : HttpStatus.INTERNAL_SERVER_ERROR,
	BR : HttpStatus.BAD_REQUEST
}

exports.authenticate = function(req, res){
	//console.log(req.body);
	if(req.body.password){
		var password = encrypt(key, trimmed(req.body.password));
	}

	User.findOne({username: new RegExp('^' + req.body.username + '$', 'i'), password: password}, {password:0}, function(err, user){
		if(err){
			res.status(httpStatus.ISE).json({
				status: status.FAILURE,
				code: httpStatus.ISE,
				data: '',
				error: errorMsg.UNEXP_ERROR
			})
			return;
		}
		if(user == null){
			res.status(httpStatus.BR).json({
				status: status.FAILURE,
				code: httpStatus.BR,
				data: '',
				error: errorMsg.INVALID_PASS
			})
			return;
		}
		res.status(httpStatus.OK).json({
			status: status.SUCCESS,
			code: httpStatus.OK,
			data: user,
			error:''
		});
	});

};

function encrypt(key, data) {
	var cipher = crypto.createCipher('aes-256-cbc', key);
	var encrypted = cipher.update(data, 'utf-8', 'hex');
	encrypted += cipher.final('hex');

	return encrypted;
}

function decrypt(key, data) {
	var decipher = crypto.createDecipher('aes-256-cbc', key);
	var decrypted = decipher.update(data, 'hex', 'utf-8');
	decrypted += decipher.final('utf-8');

	return decrypted;
}

function trimmed(value){
	if(value != undefined){
		return trim(value);
	}
	return value;
}