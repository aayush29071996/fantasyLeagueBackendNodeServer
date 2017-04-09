/*
* Created by harirudhra on Sun 1 Jan 2017
*/
var LoginController = require('./controllers/LoginController');
var UserController = require('./controllers/UserController');
var InviteController = require('./controllers/InviteController');

var FixturesHandler = require('./handlers/Football/FixturesHandler');
var TeamsHandler = require('./handlers/Football/TeamsHandler');
var PlayersHandler = require('./handlers/Football/PlayersHandler');

var FixtureController = require('./controllers/Football/FixtureController');
var TeamController = require('./controllers/Football/TeamController');
var PlayerController = require('./controllers/Football/PlayerController');
var PointsSystemController = require('./controllers/Football/PointsSystemController');

module.exports = function(app) {

	var __dirname =  './public/';

	app.all('/', function(req, res){
		res.sendFile('index.html', {
			root: __dirname
		});
	});

	app.all('/admin', function(req, res){
		res.sendFile('dashboard/index.html', {
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

	//seed routes
	app.get('/seedCompetitionsSeasons', FixturesHandler.populateCompetitionsAndSeasons);
	app.get('/seedFixtures', FixturesHandler.populateSeasonsWithFixtures);
	app.get('/seedTeams',TeamsHandler.populateTeamsForAllSeasons);
	app.get('/seedPlayers',PlayersHandler.populatePlayersForAllTeams);

	app.get('/mergeTeams',TeamsHandler.mergeTeamDuplicates);	

	app.get('/historyFixturesAdmin', FixtureController.getFixturesHistoryAdmin);
	app.get('/liveFixturesAdmin', FixtureController.getFixturesLiveAdmin);
	app.get('/upcomingFixturesAdmin', FixtureController.getFixturesUpcomingAdmin);


	//football fixture routes
	app.get('/historyFixtures', FixtureController.getFixturesHistory);
	app.get('/liveFixtures', FixtureController.getFixturesLive);
	app.get('/upcomingFixtures', FixtureController.getFixturesUpcoming);

	//RUD admin routes for fixtures
	app.get('/competions',FixtureController.getCompetitionsAndSeasons);
	app.get('/fixtures', FixtureController.getAllFixtures);
	app.get('/fixtures/:seasonId', FixtureController.getFixturesBySeason);
	app.get('/fixture/:matchId',FixtureController.getFixture);
	//TODO: app.put('/fixture/:id', FixtureController.updateFixture);
	//TODO: app.delete('/fixture/:id', FixtureController.deleteFixture);

	//CRUD admin routes for teams
	app.get('/teams', TeamController.getAllTeams);
	app.get('/team/:teamId', TeamController.getTeam);
	app.post('/team/id', TeamController.getTeamIdAvailability);
	app.post('/team/toggleStatus', TeamController.toggleTeamStatus);
	app.post('/team/', TeamController.createTeam);
	app.put('/team/', TeamController.updateTeam);
	app.delete('/team/', TeamController.deleteTeam);
	app.delete('/team/player/',TeamController.removePlayerFromTeam);

	//CRUD admin routes for players
	app.get('/players', PlayerController.getAllPlayers);
	app.get('/player/:playerId', PlayerController.getPlayer);
	app.post('/player/id', PlayerController.getPlayerIdAvailability);
	app.post('/player/toggleStatus', PlayerController.togglePlayerStatus);
	app.post('/player/', PlayerController.createPlayer);
	app.put('/player/', PlayerController.updatePlayer);
	app.delete('/player/', PlayerController.deletePlayer);

	//MatchCard routes
	app.post('/createMatchCard', PointsSystemController.createMatchCard);
	app.get('/computeMatchPoints/:matchId', PointsSystemController.computeMatchPoints);
	//app.post('/getMatchCard', PointsSystemController.getMatchCard);


};