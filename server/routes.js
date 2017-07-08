/*
* Created by harirudhra on Sun 1 Jan 2017
*/
var LoginController = require('./controllers/LoginController');
var UserController = require('./controllers/UserController');
var ResetController = require('./controllers/ResetController');
var InviteController = require('./controllers/InviteController');
var ContactController = require('./controllers/ContactController');

// var UserProfileController = require('./controllers/UserProfileController');

// var ContactController = require('./controllers/ContactController');
var FixturesHandler = require('./handlers/Football/FixturesHandler');
var TeamsHandler = require('./handlers/Football/TeamsHandler');
var PlayersHandler = require('./handlers/Football/PlayersHandler');


var RosterController = require('./controllers/Football/RosterController');
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

	app.get('/pitch/all', function(req,res){
		res.sendFile('pitch/views/all.html', {
			root: __dirname
		});
	});
	app.get('/pitch/trending', function(req,res){
		res.sendFile('pitch/views/trending.html', {
			root: __dirname
		});
	});
	app.get('/pitch/recent', function(req,res){
		res.sendFile('pitch/views/recent.html', {
			root: __dirname
		});
	});

	app.get('/mpitch', function(req,res){
		res.sendFile('mpitch/index.html', {
			root: __dirname
		});
	});

	app.get('/logo',function(req,res){
		res.sendFile('logo.png', {
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

	app.get('/users', UserController.getAllUsers);
	app.post('/getUser', UserController.getUser);

	// app.get('/auth/google',passport.athenticate('google',{scope:['profile','email']}));

	// app.get('/auth/google/callback',
		// passport.athenticate('google',{successRedirect: '/profile',failureRedirect:'/'}));
	app.get('/logout',function(req,res){
		res.logout();
		res.redirect('/');
	})


	// app.post('/reset', UserController.resetPasswordRequest);
	// app.get('/reset/:token', UserController.resetPasswordResponse);
	// app.post('/reset/:token', UserController.resetPassword);
	// app.post('/changePassword', UserController.changePassword);
	app.post('/reset', ResetController.resetPasswordRequest)
	app.get('/reset/:token', ResetController.resetPasswordResponse);
	app.post('/reset/:token', UserController.resetPassword);
	app.post('/changePassword', UserController.changePassword);

	app.post('/feedback', ContactController.sendFeedback);


	app.get('/roster/:matchId', RosterController.getRoster);
	//app.post('/complaint', ContactController.sendComplaint);


	app.get('/playerHistory/:username', PointsSystemController.getPlayerHistory);


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
	app.put('/fixture',FixtureController.toggleFixtureStatus);
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
	app.put('/player/:playerId/position/:positionId', PlayerController.updatePlayerPosition);
	app.delete('/player/:playerId', PlayerController.deletePlayer);

	//MatchCard routes
	app.post('/createMatchCard', PointsSystemController.createMatchCard);
	app.get('/displayPlayers', PointsSystemController.displayPlayers);
	app.get('/leaderboard/:matchId', PointsSystemController.getMatchLeaderboard);

	app.post('/category', PitchController.createCategory);
	app.get('/categories', PitchController.getCategories);

	app.get('/pitch/:storyId', PitchController.getStory);
	app.get('/pitches', PitchController.getAllStories);
	app.get('/pitchesByRecent', PitchController.getRecentStories);
	app.get('/pitchesByTrend', PitchController.getTrendingStories);
	app.post('/pitch', PitchController.saveStory);
	app.post('/pitchesByUser', PitchController.getStoriesByUser);
	app.post('/pitch/view', PitchController.viewStory);
	app.post('/pitch/like', PitchController.likeStory);
	app.post('/pitch/share', PitchController.shareStory);
	app.post('/pitch/comment', PitchController.commentStory);
	app.post('/pitch/report', PitchController.reportStory);
	// app.post('/pitch/approve', PitchController.approveStory);
	// app.post('/pitch/publish', PitchController.publishStory);

	// app.get('/Live',PitchController.LiveScores);
	// app.get('/Fixture',PitchController.Fixtures);
	// app.get('/Commentary',PitchController.Commentary);
	// app.get('/Stats',PitchController.Stats);
	// app.get('/Standings',PitchController.Standings);
	// app.get('/Videos',PitchController.Videos);
	// app.get('/TopScorers',PitchController.TopScorers);

};
