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
};