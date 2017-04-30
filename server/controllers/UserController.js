/*
* Created by harirudhra on Sat 21 Jan 2017
*/

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

var errorMsg = {
	UNEXP_ERROR : 'unexpected error in accessing data',
	USER_NOT_FOUND : 'user not found',
	EMAIL_IN_USE : 'email already in use',
	USERNAME_IN_USE : 'username already in use',
	MOBILE_IN_USE : 'mobile number in use'
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


//Validate username for availability
exports.validate = function(req, res){
	//console.log(req.body);
	User.findOne({'username' : new RegExp('^' + req.body.username + '$', 'i')}, function(err, user){
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
			res.status(httpStatus.OK).json({
				status:status.SUCCESS,
				code: httpStatus.OK,
				data: req.body.username,
				error: ''
			});
			return;
		}
		res.status(httpStatus.OK).json({
			status:status.FAILURE,
			code: httpStatus.BR,
			data: '',
			error: errorMsg.USERNAME_IN_USE
		});
	})
};

//Saves User
exports.save = function(req, res){
	console.log(req.body);
	User.findOne({'email' : new RegExp('^' + req.body.email + '$', 'i')}, function(err, user){
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
			var user = new User;
			var hash = encrypt(key, trimmed(req.body.password));
			user.password = hash;
			user.email = trimmed(req.body.email).toLowerCase();
			user.avatar = "https://www.gravatar.com/avatar/"+md5(trimmed(req.body.email).toLowerCase()) +".jpg?s=200";
			user.username = trimmed(req.body.username);
			user.dob = moment.utc(req.body.dob);
			user.location.city = req.body.city;
			user.location.country = req.body.country[0]==""?req.body.country.join(""):req.body.country.join(",");
			user.location.countryCode = req.body.countryCode;
			user.location.region = req.body.region;
			user.location.regionName = req.body.regionName;
			user.location.isp = req.body.isp;
			user.location.lat = req.body.lat;
			user.location.lon = req.body.lon;
			user.location.zip = req.body.zip;
			user.location.timezone = req.body.timezone;
			user.location.ip = req.body.ip;
			user.token = uuid.v4();
			user.status = 'ACTIVE';
			user.createdOn = moment.utc();
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
				sendWelcomeMail(user.email);
				user.password = null;
				res.status(httpStatus.OK).json({
					status: status.SUCCESS,
					code: httpStatus.OK,
					data: user,
					error: ''
				});
			});
			return;
		}

		res.status(httpStatus.BR).json({
			status: status.FAILURE,
			code: httpStatus.BR,
			data: '',
			error: errorMsg.EMAIL_IN_USE
		});
	})

};


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

function sendWelcomeMail(toAddr){
	var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '', // Your email id
            pass: '' // Your password
        }
    });
    var htmlstream = fs.createReadStream('public/pitch/welcome_mail.html', {
			root: __dirname
		});
    var mailOptions = {
    from: 'Inyards Pitch <noreply@inyards.com>',
    replyTo: 'support@inyards.com',
    sender: 'Inyards Pitch <noreply@inyards.com>',
    to: toAddr,
    subject: 'You are now a Pitcher!',
    html: htmlstream 
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
		return;
    }else{
        console.log('Welcome Mail sent: ' + info.response);
       return;
    };
});
}