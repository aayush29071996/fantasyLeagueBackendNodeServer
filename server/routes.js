/**
* Created by harirudhra on Sun 1 Jan 2017
*/
var LoginController = require('./controllers/LoginController');
var UserController = require('./controllers/UserController');
var InviteController = require('./controllers/InviteController');

module.exports = function(app) {

	var __dirname =  './public/';

	app.all('/', function(req, res, next){
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
	app.all('/api', function(req, res, next){
		res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    	res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    	return next();
	});
	app.post('/api/username', UserController.validate);
	app.post('/register', UserController.save);

	//login routes
	app.post('/authenticate', LoginController.authenticate);


};