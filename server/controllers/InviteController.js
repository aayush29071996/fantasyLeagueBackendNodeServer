var HttpStatus =  require('http-status');
var fs = require('node-fs');

exports.save = function(req, res){
	var email = req.body.email;
	fs.appendFile('invite-emails.txt', '\n' + email, function (err){
		if(err){
			res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: 'failure',
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: '',
                error: 'unexpected error in accessing or writing file'
			});
			return;
		}
		else{
			res.status(HttpStatus.OK).json({
                    status: 'success',
                    code: HttpStatus.OK,
                    data: email,
                    error: ''
                });
		}
	});
};