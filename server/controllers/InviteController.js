var HttpStatus =  require('http-status');
var Invite = require('../models/Invite');
var Validation = require('./Validation');

//Saves invite
exports.save = function(req, res){
	console.log('email save request arrived from ' + req.body.email);
	Invite.findOne({'email': new RegExp('^' + req.body.email + '$', 'i')}, function (err, invite){
		if(err){
			res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: 'failure',
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: '',
                error: 'unexpected error in accessing data'
			});
			return;
		}
		if(invite == null) {
			console.log('inside null');
			var newInvite = new Invite;
			newInvite.email = req.body.email;
			newInvite.save(function(saveErr, saveInvite){
				if(saveErr){
					res.status(HttpStatus.BAD_REQUEST).json({
						status: 'failure',
						code: HttpStatus.BAD_REQUEST,
						data: '',
						error: Validation.validatingErrors(saveErr)
					});
					return;
				}
				res.status(HttpStatus.OK).json({
                    status: 'success',
                    code: HttpStatus.OK,
                    data: newInvite,
                    error: ''
			        });
			        return;
			});
		} else{
			res.status(HttpStatus.OK).json({
	            status: 'success',
	            code: HttpStatus.OK,
	            data: '',
	            error: 'Email Already in use'
  		    });
			return;
		}
	});
};