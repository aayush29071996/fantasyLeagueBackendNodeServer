var User = require('../models/User');
var HttpStatus = require('http-status');
var Validation = require('./Validation');
var moment = require('moment');
var trim = require('trimmer');
var uuid = require('uuid');
var crypto = require('crypto');
var md5 = require('md5');
var nodemailer = require('nodemailer');
var fs = require('fs');
var key = 'jallikattu';
var otpGenerator = require('otp-generator')
 

var errorMsg = {
	UNEXP_ERROR : 'unexpected error in accessing data',
	USER_NOT_FOUND : 'user not found',
	EMAIL_IN_USE : 'email already in use',
	USERNAME_IN_USE : 'username already in use',
	MOBILE_IN_USE : 'mobile number in use',
	INVALID_TOKEN : 'invalid reset password token',
	OLD_PASS_DOESNT_MATCH: 'Old Password does not match'
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

var transporter = nodemailer.createTransport({
    service: 'gmail',
	auth: {
		user: 'reach.fantumn@gmail.com', // Your email id
		pass: 'shenbagam-6' // Your password
	}
});

exports.resetPasswordRequest = function(req, res){
	User.findOne({email:req.body.email}, function(err, user){
		if(err){
			res.status(httpStatus.ISE).json({
				status: status.FAILURE,
				code: httpStatus.ISE,
				data: '',
				error: errorMsg.UNEXP_ERROR
			});
			return;
		}
		if(user == null){
			res.status(httpStatus.BR).json({
				status: status.FAILURE,
				code: httpStatus.BR,
				data: '',
				error: errorMsg.USER_NOT_FOUND
			});
			return;
		}
		user.resetPasswordToken = otpGenerator.generate(6, { alphabets:false, upperCase: false, specialChars: false });
		user.resetPasswordExpires = moment.utc().add('1','h');
		user.save(function (saveErr, saveUser){
			if(saveErr){
				res.status(httpStatus.BR).json({
					status: status.FAILURE,
					code: httpStatus.BR,
					data: '',
					error: Validation.validatingErrors(saveErr)
				});
				return;
			}
			sendResetPasswordRequestMail(user.email, user.resetPasswordToken, user.username);
			res.status(httpStatus.OK).json({
				status: status.SUCCESS,
				code: httpStatus.OK,
				data: user.resetPasswordToken,
				error: ''
			});
		});
		
	});
}

exports.resetPasswordResponse = function(req, res){
	User.findOne({resetPasswordToken:req.params.token, resetPasswordExpires:{$gt: moment.utc()}}, function(err, user){
		if(err){
			res.status(httpStatus.ISE).json({
				status: status.FAILURE,
				code: httpStatus.ISE,
				data: '',
				error: errorMsg.UNEXP_ERROR
			});
			return;
		}
		if(user == null){
			res.status(httpStatus.BR).json({
				status: status.FAILURE,
				code: httpStatus.BR,
				data: '',
				error: errorMsg.INVALID_TOKEN
			});
			return;
		}

		res.status(httpStatus.OK).json({
			status: status.SUCCESS,
			code: httpStatus.OK,
			data: user.email,
			error: ''
		});
		
	});
}

exports.resetPassword = function(req, res){
	User.findOne({resetPasswordToken:req.params.token, resetPasswordExpires:{$gt: moment.utc()}}, function(err, user){
		if(err){
			res.status(httpStatus.ISE).json({
				status: status.FAILURE,
				code: httpStatus.ISE,
				data: '',
				error: errorMsg.UNEXP_ERROR
			});
			return;
		}
		if(user == null){
			res.status(httpStatus.BR).json({
				status: status.FAILURE,
				code: httpStatus.BR,
				data: '',
				error: errorMsg.INVALID_TOKEN
			});
			return;
		}

		var hash = encrypt(key, trimmed(req.body.password));
		user.password = hash;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		user.save(function (saveErr, saveUser){
			if(saveErr){
				res.status(httpStatus.BR).json({
					status: status.FAILURE,
					code: httpStatus.BR,
					data: '',
					error: Validation.validatingErrors(saveErr)
				});
				return;
			}
			//sendResetPasswordMail(user.email);
			res.status(httpStatus.OK).json({
				status: status.SUCCESS,
				code: httpStatus.OK,
				data: user.email,
				error: ''
			});
		});
		
	});
}


exports.changePassword = function(req, res){
	User.findOne({email:req.body.email, password:encrypt(key, req.body.oldPassword)}).exec(function(err, user){
		if(err){
			res.status(httpStatus.ISE).json({
				status: status.FAILURE,
				code: httpStatus.ISE,
				data: '',
				error: errorMsg.UNEXP_ERROR
			});
			return;
		}
		if(user == null){
			res.status(httpStatus.BR).json({
				status:status.FAILURE,
				code: httpStatus.BR,
				data: '',
				error: errorMsg.OLD_PASS_DOESNT_MATCH
			});
			return;
		}

		user.password = encrypt(key, req.body.newPassword);
		user.save(function (saveErr, saveUser){
				if(saveErr){
					res.status(httpStatus.BR).json({
						status: status.FAILURE,
						code: httpStatus.BR,
						data: '',
						error: Validation.validatingErrors(saveErr)
					});
					return;
				}
				res.status(httpStatus.OK).json({
					status: status.SUCCESS,
					code: httpStatus.OK,
					data: '',
					error: ''
				});
			});
		
	});
}


function encrypt(key, data){
	var cipher = crypto.createCipher('aes-256-cbc', key);
	var crypted = cipher.update(data, 'utf-8', 'hex');
	crypted += cipher.final('hex');

	return crypted;
}

function decrypt(key, data){
	var decipher = crypto.createDecipher('aes-256-cbc', key);
	var decrypted = decipher.update(data, 'hex', 'utf-8');
	decrypted += decipher.final('utf-8');

	return decrypted;
}

function trimmed(data){
	if(data != undefined)
		return trim(data);
	return data;
}
function sendResetPasswordRequestMail(toAddr, token, username){

    var mailOptions = {
	    from: 'Fantumn <reach.fantumn@gmail.com>',
	    sender: 'Fantumn <reach.fantumn@gmail.com>',
	    to: toAddr,
	    subject: 'FANTUMN - Reset Password',
	    html:'<br><p>Hello '+ username +',<br><br><img src="https://inyards.herokuapp.com/logo.png"/><br><br>Someone (hopefully you) has requested a password reset for your Fantumn account.<br><br><b>Please use this code to reset your password for your account: ' + token +'</b><br><br>If you don\'t wish to reset your password, disregard this email and no action will be taken.</p><br><br><p>Regards,<br>Admin Team<br>Fantumn</p><br><br><hr><br><p><center><i>Please do not reply to this email; this address is not monitored. Please use our contact page.</i></center></p>'
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
			return;
	    }else{
	        console.log('Reset Password Mail sent: ' + info.response);
	       return;
	    }
	});
}