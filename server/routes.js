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
var PitchController = require('./controllers/PitchController');

module.exports = function(app) {

	var __dirname =  './public/';

	app.all('/', function(req, res){
		res.sendFile('index.html', {
			root: __dirname
		});
	});

	app.get('/admin', function(req, res){
		res.sendFile('dashboard/index.html', {
			root: __dirname
		});
	});
	
	app.get('/pitch', function(req,res){
		res.sendFile('pitch/index.html', {
			root: __dirname	
		});	
	});
	
	app.get('/mpitch', function(req,res){
		res.sendFile('mpitch/index.html', {
			root: __dirname	
		});	
	});
	
	//invite route
	app.post('/invite', InviteController.save);

	// Admin Authentication
	app.post('/admin', function(req,res){
		if(req.body.username == 'pradeepbaskaran' && req.body.password == 'fantasysportsreinvented')
			res.send({ success: true });
		else
			res.send({ success: false });
	});
	
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

	//football fixture routesa
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
	app.delete('/team/:teamId', TeamController.deleteTeam);
	app.delete('/team/player/',TeamController.removePlayerFromTeam);

	//CRUD admin routes for players
	app.get('/players', PlayerController.getAllPlayers);
	app.get('/player/:playerId', PlayerController.getPlayer);
	app.post('/player/id', PlayerController.getPlayerIdAvailability);
	app.post('/player/toggleStatus', PlayerController.togglePlayerStatus);
	app.post('/player/', PlayerController.createPlayer);
	app.put('/player/', PlayerController.updatePlayer);
	app.delete('/player/:playerId', PlayerController.deletePlayer);

	//MatchCard routes
	app.post('/createMatchCard', PointsSystemController.createMatchCard);
	// app.get('/computeMatchPoints/:matchId', PointsSystemController.computeMatchPoints);
	//app.post('/getMatchCard', PointsSystemController.getMatchCard);
	app.get('/leaderboard/', PointsSystemController.getMatchLeaderboard);


	app.post('/category', PitchController.createCategory);
	app.get('/categories', PitchController.getCategories);

	app.get('/pitch/:storyId', PitchController.getStory);
	app.get('/pitches', PitchController.getAllStories);
	app.post('/pitch', PitchController.saveStory);
	app.post('/pitchByUser', PitchController.getStoriesByUser);
	app.post('/pitch/view', PitchController.viewStory);
	app.post('/pitch/like', PitchController.likeStory);
	app.post('/pitch/share', PitchController.shareStory);
	app.post('/pitch/comment', PitchController.commentStory);
	app.post('/pitch/approve', PitchController.approveStory);
	app.post('/pitch/publish', PitchController.publishStory);

	app.get('/Live',PitchController.LiveScores);
	app.get('/Fixture',PitchController.Fixtures);
	app.get('/Commentary',PitchController.Commentary);
	app.get('/Stats',PitchController.Stats);
	app.get('/Standings',PitchController.Standings);
	app.get('/Videos',PitchController.Videos);
	app.get('/TopScorers',PitchController.TopScorers);
};