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
	UNEXP_ERROR : 'unexpected error in accessing data'
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
        user: 'reachinyards@gmail.com', // Your email id
        pass: 'dev-2017' // Your password
    }
});

exports.sendFeedback = function(req, res){
	User.findOne({username:req.body.username}, function(err, user){
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
		
			sendFeedbackMail('admin@inyards.com', req.body.feedback ,user);
			res.status(httpStatus.OK).json({
				status: status.SUCCESS,
				code: httpStatus.OK,
				data: '',
				error: ''
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

function sendFeedbackMail(toAddr, feedback,user){
var date1 = new Date(user.createdOn);
var date2 = new Date();
var timeDiff = Math.abs(date2.getTime() - date1.getTime());
var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
var message="";
for (var i=0;i<feedback.length;i++)
	message+='<p>'+feedback[i]+'</p>';
    var mailOptions = {
	    from: 'InYards <noreply@inyards.com>',
	    sender: 'InYards <noreply@inyards.com>',
	    replyTo: user.email,
	    to: toAddr,
	    subject: 'InYards - User Feedback',
	    html:'<br><p>Hi there!,<br><br>This is a feedback sent by '+ user.username +'.<br><br>The Sender has been using the InYards Product for '+ diffDays +' days until now.<br><br>The Sender said...<br><blockquote>' + message +'</blockquote><br><br></p><br><br><p>Sender:<br>Username: <b>'+ user.username+'</b><br>Email: <b>'+ user.email+'</b></p><br><br><hr><br><p><center><i>Reply to this email to send mail to the sender.</i></center></p>'
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
			return;
	    }else{
	        console.log('Feedback Mail sent: ' + info.response);
	       return;
	    };
	});
}