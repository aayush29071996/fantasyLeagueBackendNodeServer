/*
* Created by harirudhra on Sat 21 Jan 2017
*/

var User = require('../models/User');
var HttpStatus = require('http-status');
var Validation = require('./Validation');
var moment = require('moment');
var configAuth = require('../auth');
var trim = require('trimmer');
var uuid = require('uuid');
var crypto = require('crypto');
var md5 = require('md5');
var nodemailer = require('nodemailer');
var fs = require('fs');
var key = 'jallikattu';
var UserProfile = require('../models/UserProfile')
var smtpTransport = require('nodemailer-smtp-transport');
var profilePicture = require('../models/Football/Master/profilePicture');

// var LocalStrategy    = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy  = require('passport-twitter').Strategy;
// var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
// var User = require('../models/UserProfile');
var Userlocal = require('../models/User');

var errorMsg = {
	UNEXP_ERROR : 'unexpected error in accessing data',
	USER_NOT_FOUND : 'user not found',
	EMAIL_IN_USE : 'email already in use',
	USERNAME_IN_USE : 'username already in use',
	MOBILE_IN_USE : 'mobile number in use',
	INVALID_TOKEN : 'invalid reset password token',
	OLD_PASS_DOESNT_MATCH: 'Old Password does not match',
	NO_USERS_FOUND : 'no users found',
	INVALID_PASS_U: 'username and password does not match',
	INVALID_PASS_E: 'email and password does not match',
	FACEBOOK_IN_USE:'facebook account already in use',
	GOOGLE_IN_USE:'facebook account already in use'
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
var transporter = nodemailer.createTransport(smtpTransport({
	service:'gmail',
	auth: {
		user: 'reach.fantumn@gmail.com', // Your email id
		pass: 'shenbagam-6' // Your password
	}
}));

// load all the things we need


// var baseUrl = "http://localhost:9000"
// var baseUrl = "https://inyards.com"
// var baseUrl = "https://inyards.herokuapp.com"


//facebook
/*
passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
		profileFields	: ['name', 'email', 'link', 'locale', 'timezone'],
        passReqToCallback : true
    },
    function(req, token, refreshToken, profile, done) {

		profile = profile._json;
		console.log(profile);
        process.nextTick(function() {
          if (!req.user) {
			  	console.log("No user!!");
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                  if(err){
              			 res.status(httpStatus.ISE).json({
              				status: status.FAILURE,
              				code: httpStatus.ISE,
              				data: '',
              				error: errorMsg.UNEXP_ERROR
              			})
						console.log(err);
              			return done(err);
              		}
                  if (user) {
                        return done(null, user.user); // user found, return that user
                  	}
                	else {
                        // if there is no user, create them
						var eval = baseUrl + "/emailAvailable/" + profile.email;
						request({ url:eval, json:true }, function(err, response, head) {

							if(head.code==200){
								//email avalailable
								var cdate = new Date();
								console.log("writting!");
								var newUserProfile            = new User();
								newUserProfile.facebook.id    = profile.id;
								newUserProfile.facebook.token = token;
								newUserProfile.facebook.name  = profile.first_name + ' ' + profile.last_name;
								newUserProfile.facebook.email = profile.email;
								newUserProfile.facebook_id = profile.id;

								var newUser			= new Userlocal();
								newUser.name    	= profile.first_name + ' ' + profile.last_name;
								newUser.email		= profile.email;
								newUser.createdOn   = cdate;
								newUser.facebook_link = true;

								newUser.save(function(err,data){
									if(err){
										return done(err);
									}
									else{
										newUserProfile.user = data._id;
										newUserProfile.save(function(err,data){
											if(err){
												return done(err);
											}
										});
									}
									//session
									return done(null, data._id);
									//return done(null, newUser);
								});
							}
							else{
								//login
								console.log("Already Exists!");
								Userlocal.find({email:head.data},function(err,doc){
									if(doc[0].facebook_link) return done(null,doc[0]._id);
									else {
										return done(err);
									}
								});
							}
						});
					}
                });
        }
        else {
                // user already exists and is logged in, we have to link accounts
				//check if already linked
				objId = req.user.id;
				console.log("Hello world!");
				console.log("objId : " + objId);
				var eval = baseUrl + "/facebookAvailable/" + profile.id;
				request({ url:eval, json:true }, function(err, response, head) {
					console.log(head.code);
					if(head.code == 200)//no other facebook link
					{
						var newFacebook = {

							"id" 	: profile.id,
							"token" : token,
							"name"	: profile.first_name + ' ' + profile.last_name,
							"email" : profile.email
						}
						User.update({user:objId},{facebook:newFacebook,facebook_id:profile.id},function(err,raw){

							if(err){
								res.status(httpStatus.BR).json({
									status: status.FAILURE,
									code: httpStatus.BR,
									data: '',
									error: errorMsg.UNEXP_ERROR
								});
							}
							Userlocal.update({_id:objId},{facebook_link:true},function(err,raw){

								if(err){
									return done(err);
								}
								else{
									return done(null,objId);
								}
							});
						});
						return done(null,objId);
					}
					else{
						//already in use
						return done(err);
					}
				});
				//
            }
        });
	}));
*/


	//google
			// passport.use(new GoogleStrategy({

			// 	clientID        : configAuth.googleAuth.clientID,
			// 	clientSecret    : configAuth.googleAuth.clientSecret,
			// 	callbackURL     : configAuth.googleAuth.callbackURL,
			// 	passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

			// },
			// function(req, token, refreshToken, profile, done) {


			// 		process.nextTick(function() {

			// 				console.log(profile.emails);
			// 				// check if the user is already logged in
			// 				if (!req.user) {

			// 						User.findOne({ 'google.id' : profile.id }, function(err, user) {
			// 								if(err){
			// 									res.status(httpStatus.ISE).json({
			// 										status: status.FAILURE,
			// 										code: httpStatus.ISE,
			// 										data: '',
			// 										error: errorMsg.UNEXP_ERROR
			// 									})
			// 									return done(err);
			// 								}

			// 								if (user) {
			// 										return done(null, user.user);//user found, return the user
			// 								}
			// 								else {
			// 										//if ther is no user return them
			// 										console.log("writting!");
			// 										var eval = baseUrl + "/emailAvailable/" + profile.emails[0].value;
			// 										request({ url:eval, json:true },function(err,response,data){

			// 											if(data.code==200){

			// 												//email available
			// 												var cdate = new Date();
			// 												var newUserProfile            = new User();
			// 												newUserProfile.google.id    = profile.id;
			// 												newUserProfile.google.token = token;
			// 												newUserProfile.google.name  = profile.displayName;
			// 												newUserProfile.google.email = profile.emails[0].value;
			// 												newUserProfile.google_id = profile.id;

			// 												var newUser			= new Userlocal();
			// 												newUser.name    	= profile.diplayName;
			// 												newUser.username	= profile.displayName;
			// 												newUser.email		= profile.emails[0].value;
			// 												newUser.createdOn	= cdate;
			// 												newUser.google_link = true

			// 												newUser.save(function(err,data){
			// 													if(err){
			// 														return done(err);
			// 													}
			// 													else{
			// 														newUserProfile.user = data._id;
			// 														newUserProfile.save(function(err,data){
			// 															if(err){
			// 																return done(err);
			// 															}
			// 														});
			// 													}
			// 													return  done(null,data._id);
			// 													//return done(null, newUser);
			// 												});

			// 											}
			// 											else{
			// 												//login
			// 												console.log("Already Exists!");
			// 												Userlocal.find({email:data.data},function(err,doc){
			// 													if(doc[0].google_link) return done(null,doc[0]._id);
			// 													else {
			// 														return done(err);/******/
			// 													}
			// 												});

			// 											}
			// 										});
			// 								}
			// 						});

			// 				}
			// 				else
			// 				{
			// 						// user already exists and is logged in, we have to link accounts
			// 						//check if already linked
			// 						var objId = req.user.id;
			// 						var eval = baseUrl + "/googleAvailable/" + profile.id;
			// 						request({ url:eval, json:true }, function(err, response, head) {
			// 							console.log(head.code);
			// 							if(head.code == 200)//no other facebook link
			// 							{
			// 								var newGoogle = {

			// 										"id" 	: profile.id,
			// 										"token" : token,
			// 										"name"	: profile.displayName,
			// 										"email" : profile.emails[0].value
			// 								}
			// 								User.update({user:objId},{google:newGoogle,google_id:profile.id},function(err,raw){

			// 										if(err){
			// 											res.status(httpStatus.ISE).json({
			// 												status: status.FAILURE,
			// 												code: httpStatus.ISE,
			// 												data: '',
			// 												error: errorMsg.EMAIL_IN_USE
			// 											});
			// 										}
			// 										Userlocal.update({_id:objId},{google_link:true},function(err,raw){

			// 												if(err){
			// 													return done(err);
			// 												}
			// 												else{
			// 													return done(null,req.user);
			// 												}
			// 										});
			// 								});
			// 							}
			// 							else{
			// 								//already in use
			// 								return done(err);
			// 							}
			// 						});

			// 						//
			// 				}

			// 		});

			// }));










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

		//ONLY FOR SOCIAL AUTH

		if(user !=null){
			if(user.social_auth == true){
		//		var social_auth;
				if(user.facebook.auth_token != null){
				//	social_auth =user.facebook.auth_token;
					res.status(httpStatus.OK)
						.json({
							status: status.SUCCESS,
							code: httpStatus.OK,
							data: user,
							error: ''

						});
					return;
				}
				else{
		//			social_auth = user.google.accessToken;
					res.status(httpStatus.OK)
						.json({
							status: status.SUCCESS,
							code: httpStatus.OK,
							data: user,
							error: ''

						});
					 return;
				}


			}

		}

		if(user == null){
			var user = new User;
			var hash = encrypt(key, trimmed(req.body.password));
			user.password = hash;
			user.email = trimmed(req.body.email).toLowerCase();
			user.avatar = "https://www.gravatar.com/avatar/"+md5(trimmed(req.body.email).toLowerCase()) +".jpg?s=200";
			user.username = trimmed(req.body.username);
			user.dob = moment.utc(req.body.dob);
			// user.location.city = req.body.city;
			// user.location.country = req.body.country[0]==""?req.body.country.join(""):req.body.country.join(",");
			// user.location.countryCode = req.body.countryCode;
			// user.location.region = req.body.region;
			// user.location.regionName = req.body.regionName;
			// user.location.isp = req.body.isp;
			// user.location.lat = req.body.lat;
			// user.location.lon = req.body.lon;
			// user.location.zip = req.body.zip;
			// user.location.timezone = req.body.timezone;
			// user.location.ip = req.body.ip;
			user.token = uuid.v4();
			user.status = 'ACTIVE';
			user.createdOn = moment.utc();
			user.digitalSignature = req.body.digitalSignature;
			user.social_auth = req.body.social_auth;
			user.facebook.social_id = req.body.facebook.social_id;
			user.facebook.auth_token = req.body.facebook.auth_token;
			user.facebook.profile = req.body.facebook.profile;
			user.google.accessToken = req.body.google.accessToken;
			user.google.idToken = req.body.google.idToken;
			user.google.imgUrl = req.body.google.imgUrl;

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
				sendWelcomeMail(saveUser.email);
				delete saveUser.password;
				// Save for USERPROFILE

				var userProfile = new UserProfile;
				userProfile.user = saveUser._id
				userProfile.username = trimmed(req.body.username);
				userProfile.createdOn = moment.utc();

				userProfile.save(function (saveErr, savedUserProfile){
					if(saveErr){
						res.status(httpStatus.BR).json({
							status: status.FAILURE,
							code: httpStatus.BR,
							data: '',
							error: Validation.validatingErrors(saveErr)
						});
						return;
					}
					res
						.status(httpStatus.OK)
						.json({
							status: status.SUCCESS,
							code: httpStatus.OK,
							data: saveUser,
							error: ''
						});
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

//Updates User
exports.update = function(req, res){
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
			res.status(httpStatus.BR).json({
				status: status.FAILURE,
				code: httpStatus.BR,
				data: '',
				error: errorMsg.NO_USERS_FOUND
			});
		}


		var user = new User;
		var hash = encrypt(key, trimmed(req.body.password));
		user.password = hash;
		user.email = trimmed(req.body.email).toLowerCase();
		user.avatar = "https://www.gravatar.com/avatar/"+md5(trimmed(req.body.email).toLowerCase()) +".jpg?s=200";
		user.username = trimmed(req.body.username);
		user.dob = moment.utc(req.body.dob);
		// user.location.city = req.body.city;
		// user.location.country = req.body.country[0]==""?req.body.country.join(""):req.body.country.join(",");
		// user.location.countryCode = req.body.countryCode;
		// user.location.region = req.body.region;
		// user.location.regionName = req.body.regionName;
		// user.location.isp = req.body.isp;
		// user.location.lat = req.body.lat;
		// user.location.lon = req.body.lon;
		// user.location.zip = req.body.zip;
		// user.location.timezone = req.body.timezone;
		// user.location.ip = req.body.ip;
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
			user.password = null;
			res.status(httpStatus.OK).json({
				status: status.SUCCESS,
				code: httpStatus.OK,
				data: user,
				error: ''
			});
		});
		return;

	})

};

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
		user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
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
			sendResetPasswordRequestMail(user.email, user.resetPasswordToken);
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
	User.findOne({resetPasswordToken:req.body.token, resetPasswordExpires:{$gt: moment.utc()}}, function(err, user){
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
			sendResetPasswordMail(user.email);
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



exports.getAllUsers = function(req, res){
	User.find({}).select('-password -token').populate('users').exec(function(err, users){
		if(err){
			res.status(httpStatus.ISE).json({
				status: status.FAILURE,
				code: httpStatus.ISE,
				data: '',
				error: errorMsg.UNEXP_ERROR
			});
			return;
		}
		if(users.length > 0){
			res.status(httpStatus.OK).json({
				status:status.SUCCESS,
				code: httpStatus.OK,
				data: users,
				error: ''
			});
			return;
		}
		res.status(httpStatus.OK).json({
			status:status.FAILURE,
			code: httpStatus.BR,
			data: '',
			error: errorMsg.NO_USERS_FOUND
		});
		return;
	});
}


exports.getUser = function(req, res){
	User.findOne({id:req.body._id}, function(err, user){
		if(err){
			res.status(httpStatus.ISE).json({
				status: status.FAILURE,
				code: httpStatus.ISE,
				data: '',
				error: errorMsg.UNEXP_ERROR
			});
			return;
		}
	//	user.password = null;
		if(user == null){
			res.status(httpStatus.BR).json({
				status: status.FAILURE,
				code: httpStatus.BR,
				data: '',
				error: errorMsg.USER_NOT_FOUND
			});
			return;
		}
		res.status(httpStatus.OK).json({
			status: status.SUCCESS,
			code: httpStatus.OK,
			data: user,
			error:''
		});
	});
}

//Profile Route by Aayush Patel

exports.updateProfile = function(req, res){
	const updates = Object.assign({}, req.body)
	delete updates._id
	UserProfile.findOneAndUpdate({user: req.body._id} , updates ,{new:true}, function(err, user){
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
				error: errorMsg.NO_USERS_FOUND
			});
		}

		if(user){
			res.status(httpStatus.OK).json({
				status: status.SUCCESS,
				code: httpStatus.OK,
				data: user,
				error: ''
			});
		}
		return;

	})

};


exports.getProfile = function(req, res){
	console.log(req.params._id);

	UserProfile.findOne({ user: req.params._id}, function(err, userProfile){
		if(err){
			res.status(httpStatus.ISE).json({
				status: status.FAILURE,
				code: httpStatus.ISE,
				data: '',
				error: errorMsg.UNEXP_ERROR
			})
			return;
		}
		if(userProfile == null){
			res.status(httpStatus.BR).json({
				status: status.FAILURE,
				code: httpStatus.BR,
				data: '',
				error: errorMsg.USER_NOT_FOUND
			})
			return;
		}



			res.status(httpStatus.OK).json({
				status: status.SUCCESS,
				code: httpStatus.OK,
				data: userProfile,
				error:''
			});





	});

};

//REPORT PROBLEM CONTROLLER

exports.reportSuggestMail = function(req, res){

	var name = req.body.name;
	var phoneNumber = req.body.phoneNumber;
	var email =   req.body.email;
    var subject =  req.body.subject;
    var content =   req.body.content;

	if(subject== 'report') {
		sendReportProblemMail(email, subject, content);
		res.status(httpStatus.OK).json({
			status: status.SUCCESS,
			code: httpStatus.OK,
			data: 'Report mail sent to'+email ,
			error:''
		});
	}
	else{
		sendSuggestMail(email, subject, content);
		res.status(httpStatus.OK).json({
			status: status.SUCCESS,
			code: httpStatus.OK,
			data: 'Suggestion mail sent to'+ email ,
			error:''
		});
	}

};


function encrypt(key, data){
	console.log('encrypt called with key ' + key + ' and data :: ' + data);
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
    var htmlstream = fs.createReadStream('public/welcomeMail/Fantumn.html', {
			root: __dirname
		});
    var mailOptions = {
	    from: 'Fantumn <reach.fantumn@gmail.com>',
	    replyTo: 'reach.fantumn@gmail.com',
	    sender: 'Fantumn <reach.fantumn@gmail.com>',
	    to: toAddr,
	    subject: 'Welcome to Fantumn!',
	    html: htmlstream
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
			return;
	    }else{
	        console.log('Welcome Mail sent: ' + info.response);
	       return;
	    }
	});
}

function sendResetPasswordRequestMail(toAddr, token){
  //   var htmlstream = fs.createReadStream('public/pitch/reset_password_mail.html', {
		// 	root: __dirname
		// });
    var mailOptions = {
	    from: 'Fantumn <reach.fantumn@gmail.com>',
	    replyTo: 'reach.fantumn@gmail.com',
	    sender: 'Fantumn <reach.fantumn@gmail.com>',
	    to: toAddr,
	    subject: 'Fantumn - Reset Password',
	    text:'https://inyards.com/reset/' + token
	    // html: htmlstream
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

function sendResetPasswordMail(toAddr){
  //   var htmlstream = fs.createReadStream('public/pitch/reset_password_mail.html', {
		// 	root: __dirname
		// });
    var mailOptions = {
	    from: 'Fantumn <reach.fantumn@gmail.com>',
	    replyTo: 'reach.fantumn@gmail.com',
	    sender: 'Fantumn <reach.fantumn@gmail.com>',
	    to: toAddr,
	    subject: 'Fantumn - Password Reset Successful',
	    text:'Password has been reset'
	    // html: htmlstream
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


// Report a problem mail

function sendReportProblemMail(email,subject, content){

	var mailOptions = {
		from: email ,
		replyTo:email,
		sender: 'reach.fantumn@gmail.com',
		to: 'reach.fantumn@gmail.com',
		subject: subject,
		text: content
	};

	transporter.sendMail(mailOptions, function(error, problem){
		if(error){
			console.log(error);
			return;
		}else{
			console.log('Problem Mail sent: ' + problem.response);

			return;
		}
	});

}

//SUGGEST MAIL TO BE SENT

function sendSuggestMail(email, subject, content){

	var mailOptions = {
		from: email ,
		replyTo:email,
		sender: 'reach.fantumn@gmail.com',
		to: 'reach.fantumn@gmail.com',
		subject: subject,
		text: content
	};

	transporter.sendMail(mailOptions, function(error, suggestion){
		if(error){
			console.log(error);
			return;
		}else{
			console.log('Suggest Mail sent: ' + suggestion.response);

			return;
		}
	});

}
