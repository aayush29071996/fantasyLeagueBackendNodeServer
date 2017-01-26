/**
* Created by harirudhra on Sun 1 Jan 2017
*/
var LoginController = require('./controllers/LoginController');
var UserController = require('./controllers/UserController');
var InviteController = require('./controllers/InviteController');

module.exports = function(app) {

	var __dirname =  './public/';

	app.all('/', function(req, res){
		res.sendFile('index.html', {
			root: __dirname
		});
	});

	app.all('/about', function(req, res){
		res.sendFile('about.html', {
			root: __dirname
		});
	});

	//invite route
	app.post('/invite', InviteController.save);

	//user routes
	app.post('/username', UserController.validate);
	app.post('/register', UserController.save);

	//login routes
	app.post('/authenticate', LoginController.authenticate);


};