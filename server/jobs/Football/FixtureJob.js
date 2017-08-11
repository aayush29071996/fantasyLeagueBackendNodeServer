/*
 * Created by harirudhra on Sat 11 March 2017
 */

var moment = require('moment');
var request = require('request');
var CronJob = require('cron').CronJob;
var Subtract = require('array-subtract');
var _ = require('underscore');

var Match = require('../../models/Football/Match');
var Event = require('../../models/Football/Event');
var MatchCard = require('../../models/Football/MatchCard');

var Codes = require('../../Codes');
var Validation = require('../../controllers/Validation');

// var API_TOKEN_OLD = "H7H9qU3lmK1UNpqQoNxBI2PkZJec2IMAcNhByMSQ1GWhAt5tUDVtobVc1ThK";
var API_TOKEN = "EyTtWbGs9ZnUYam1xB63iXoJ4EZ4TuTKGmQaebB1tpsrxq5VcdQ3gPVgjMyz";
// var baseUrl = "https://api.soccerama.pro/v1.2/";
var baseUrl = "https://soccer.sportmonks.com/api/v2.0/";

var fireUrl = function(params, include) {
    console.log('firing url : ' + baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include);
    return baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include;
};

var responseToConsole = function(_status, _code, _data, _error) {

    var responseJSON = {
        status: _status,
        code: _code,
        data: _data,
        error: _error
    }
    return responseJSON;
}

var eventsFilter = new Subtract((EventA, EventB) => {
    return EventA.id.toString() === EventB.eventId
});


//update fixtures every 15 minutes
exports.updateFixturesJob = function() {

    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
    console.log('updateFixturesJob inside')
    var fixtureAvailCheckJob = new CronJob({

        cronTime: '*/120 * * * * *',
        onTick: function() {
            console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
            console.log('Update Fixture Job Called')

            //must be livescores/now 
            params = 'livescores/now'
            // params = 'livescores'
            include = ''

            request.get(fireUrl(params, include), function(err, response, data) {

                if (err) {
                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, err, Codes.errorMsg.UNEXP_ERROR));
                    return;
                }

                if (response.statusCode == Codes.httpStatus.NF) {
                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Codes.errorMsg.INVALID_REQ));
                    return;

                }
                if (response.statusCode == Codes.httpStatus.UNAUTH) {
                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.UNAUTH, '', Codes.errorMsg.UNAUTH_KEY));
                    return;
                }

                if (response.statusCode == Codes.httpStatus.OK) {
                    data = JSON.parse(data);

                    if (data.hasOwnProperty("error")) {
                        if (data.error.code == Codes.httpStatus.ISE) {
                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, data.error, Codes.errorMsg.INVALID_REQ));
                            return;
                        }
                    }
                    data = data.data;
                    if (data.length == 0) {
                        console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, data, 'JOB : Checking for Fixture Updates : No Live Fixtures'));
                    } else {
                        // fixtureAvailCheckJob.stop();
                        console.log(' ******** MATCHES TO BE UPDATED     :: ' + data.length + '  ********');

                        //var data = ["691324","691323","699154","699153","699151","699155","699152","730211","730218","683313","730217","683309","730215","730220","730219","730212","683310","730216"];

                        data.forEach(function(fixture, index) {
                            // console.log(Object.keys(fixture.time))
                            console.log('\n')
                            console.log('******** MATCH UPDATE STARTED FOR MATCH ID :: ' + fixture.id + ' WHICH STARTS AT ' + fixture.time.starting_at.date_time + ' UTC');
                                
                            params = 'fixtures/' + fixture.id;
                            include = 'lineup,events'

                            request.get(fireUrl(params, include), function(err, response, data) {
                                if (err) {
                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, err, Codes.errorMsg.UNEXP_ERROR));
                                    return;
                                }

                                if (response.statusCode == Codes.httpStatus.NF) {
                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Codes.errorMsg.INVALID_REQ));
                                    return;

                                }
                                if (response.statusCode == Codes.httpStatus.UNAUTH) {
                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.UNAUTH, '', Codes.errorMsg.UNAUTH_KEY));
                                    return;
                                }

                                if (response.statusCode == Codes.httpStatus.OK) {
                                    data = JSON.parse(data);

                                    if (data.hasOwnProperty("error")) {
                                        if (data.error.code == Codes.httpStatus.ISE) {
                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, data.error, Codes.errorMsg.INVALID_REQ));
                                            return;
                                        }
                                    }
                                    var updatedMatch = data.data;

                                    Match.findOne({ matchId: updatedMatch.id }).populate('events').exec(function(matchErr, match) {
                                        if (matchErr) {
                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, matchErr, Codes.errorMsg.UNEXP_ERROR));
                                            return;
                                        }

                                        if (match == null) {
                                            // console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Codes.errorMsg.F_INV_MID));
                                            console.log('******** MATCH ID NOT FOUND IN DB ::  ' + updatedMatch.id + ' NOW SEEDING FIXTURE');

                                               // console.log('adding new match')
                                                var fixture = updatedMatch;
                                                var newMatch = new Match();
                                                newMatch.matchId = fixture.id;
                                                newMatch.team1Id = fixture.localteam_id;
                                                newMatch.team2Id = fixture.visitorteam_id;
                                                newMatch.status = fixture.time.status;
                                                newMatch.team1Score = fixture.scores.localteam_score;
                                                newMatch.team2Score = fixture.scores.visitorteam_score;
                                                newMatch.team1Penalties = fixture.scores.localteam_pen_score;
                                                newMatch.team2Penalties = fixture.scores.visitorteam_pen_score;
                                                newMatch.team1Formation = fixture.formations.localteam_formation;
                                                newMatch.team2Formation = fixture.formations.visitorteam_formation;
                                                newMatch.startingDateTime = moment.utc(fixture.time.starting_at.date_time);
                                                newMatch.minute = fixture.time.minute;
                                                newMatch.extraMinute = fixture.time.extra_minute;
                                                newMatch.seasonId = fixture.season_id;
                                                newMatch.stageId = fixture.stage_id;
                                                newMatch.roundId = fixture.round_id;
                                                newMatch.venueId = fixture.venue_id;

                                                if (fixture.weather_report == null) {
                                                    newMatch.weather == null;
                                                } else {                                    
                                                    newMatch.weather = {};
                                                    newMatch.weather.code = fixture.weather_report.code;
                                                    newMatch.weather.type = fixture.weather_report.type;
                                                    newMatch.weather.icon = fixture.weather_report.icon;
                                                    newMatch.weather.temperature = fixture.weather_report.temperature.temp;
                                                    newMatch.weather.temperatureUnit = fixture.weather_report.temperature.unit;
                                                    newMatch.weather.clouds = fixture.weather_report.clouds;
                                                    newMatch.weather.humidity = fixture.weather_report.humidity;
                                                    newMatch.weather.windSpeed = fixture.weather_report.wind.speed;
                                                    newMatch.weather.windDegree = fixture.weather_report.wind.degree;
                                                }

                                                if(fixture.events.data.length > 0){

                                                    fixture.events.data.forEach(function(event, index) {

                                                        var newEvent = new Event();
                                                        newEvent.eventId = event.id;
                                                        newEvent.matchId = event.fixture_id;
                                                        newEvent.teamId = event.team_id;
                                                        newEvent.type = event.type;
                                                        newEvent.minute = event.minute;
                                                        newEvent.extraMinute = event.extra_minute;
                                                        newEvent.reason = event.reason;
                                                        newEvent.injuried = event.injuried;
                                                        newEvent.playerId = event.player_id;
                                                        newEvent.playerName = event.player_name;
                                                        newEvent.relatedPlayerId = event.related_player_id;
                                                        newEvent.relatedPlayerName = event.related_player_name;

                                                        newEvent.save(function(savedEventErr, savedEvent) {
                                                            if (savedEventErr) {
                                                                console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(savedEventErr)));
                                                                return;
                                                                
                                                            }
                                                            if (savedEvent) {
                                                                console.log('new event added')
                                                                console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Event ' + savedEvent.eventId + ' added', ''));

                                                                newMatch.events.push(savedEvent);

                                                                if (newMatch.events.length == fixture.events.data.length) {

                                                                    if(fixture.lineup.data.length > 0){

                                                                        fixture.lineup.data.forEach(function(lineup, index) {

                                                                            playerLP = {};
                                                                            playerLP.playerId = lineup.player_id;
                                                                            playerLP.playerName = lineup.player_name;
                                                                            playerLP.teamId = lineup.team_id;
                                                                            if(lineup.team_id === fixture.localteam_id){
                                                                                playerLP.team = "team1";
                                                                            } else if(lineup.team_id === fixture.visitorteam_id){
                                                                                playerLP.team = "team2";
                                                                            }
                                                                            playerLP.posx = lineup.posx;
                                                                            playerLP.posy = lineup.posy;
                                                                            playerLP.position = lineup.position;
                                                                            playerLP.shirtNumber = lineup.number;
                                                                            playerLP.additionalPosition = lineup.additional_position;
                                                                            playerLP.formationPosition = lineup.formation_position;
                                                                            playerLP.shotsOnGoal = lineup.stats.shots.shots_on_goal;
                                                                            playerLP.shotsTotal = lineup.stats.shots.shots_total;
                                                                            playerLP.goalsScored = lineup.stats.goals.scored;
                                                                            playerLP.goalsConceded = lineup.stats.goals.conceded;
                                                                            playerLP.foulsCommited = lineup.stats.fouls.commited;
                                                                            playerLP.foulsDrawn = lineup.stats.fouls.drawn;
                                                                            playerLP.redcards = lineup.stats.cards.redcards;
                                                                            playerLP.yellowcards = lineup.stats.cards.yellowcards;
                                                                            playerLP.crossesTotal = lineup.stats.passing.total_crosses;
                                                                            playerLP.crossesAccuracy = lineup.stats.passing.crosses_accuracy;
                                                                            playerLP.passesTotal = lineup.stats.passing.passes;
                                                                            playerLP.passesAccuracy = lineup.stats.passing.passes_accuracy;
                                                                            playerLP.assists = lineup.stats.other.assists;
                                                                            playerLP.offsides = lineup.stats.other.offsides;
                                                                            playerLP.saves = lineup.stats.other.saves;
                                                                            playerLP.scoredPenalties = lineup.stats.other.pen_scored;
                                                                            playerLP.missedPenalties = lineup.stats.other.pen_missed;
                                                                            playerLP.savedPenalties = lineup.stats.other.pen_saved;
                                                                            playerLP.tackles = lineup.stats.other.tackles;
                                                                            playerLP.blocks = lineup.stats.other.blocks;
                                                                            playerLP.interceptions = lineup.stats.other.interceptions;
                                                                            playerLP.clearances =  lineup.stats.other.clearances;
                                                                            playerLP.minutesPlayed =  lineup.stats.other.minutes_played;
                                                                           
                                                                            newMatch.lineup.push(playerLP);

                                                                            if(fixture.lineup.data.length == newMatch.lineup.length){
                                                                                newMatch.autoLineup = true;

                                                                                newMatch.save(function(matchSaveErr, savedMatch) {          
                                                                                    if (matchSaveErr) {
                                                                                        console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchSaveErr)));
                                                                                        return;
                                                                                    }
                                                                                    if (savedMatch) {
                                                                                        console.log('new match update')
                                                                                        console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + savedMatch.matchId + ' updated', ''));
                                                                                        return;
                                                                                    }
                                                                              });
                                                                           }
                                                                       });
                                                                    } else {
                                                                        console.log('LINEUP UN-AVAILABLE');
                                                                        var teamsQuery = {$or: [{teamId:fixture.localteam_id}, {teamId:fixture.visitorteam_id}]};
                                                                        var team1Players = [], team2Players = [];

                                                                        Team.find(teamsQuery).populate('players', '-_id -active -teams').exec(function(teamsErr, teams){
                                                                            if(teamsErr){
                                                                                console.log(teamsErr);
                                                                                return;
                                                                            } 

                                                                            var team1Obj = _.findWhere(teams,{"teamId":fixture.localteam_id.toString()})
                                                                            var team2Obj = _.findWhere(teams,{"teamId":fixture.visitorteam_id.toString()})
                                                                            
                                                                            if(typeof team1Obj !== 'undefined' && team1Obj){
                                                                                team1Players = team1Obj.players;
                                                                            } else{
                                                                                console.log('inside undefined team1 fetch -> matchId : ' + fixture.id);
                                                                            }
                                                                            
                                                                            if(typeof team2Obj !== 'undefined' && team2Obj){
                                                                                team2Players = team2Obj.players;
                                                                            } else{
                                                                                console.log('inside undefined team2 fetch -> matchId : ' + fixture.id);
                                                                            }
                                                                            

                                                                            team1Players.forEach(function(player, index){

                                                                                playerLP = {};
                                                                                playerLP.playerId = player.playerId;
                                                                                playerLP.teamId = fixture.localteam_id;    
                                                                                playerLP.team = "team1";
                                                                                playerLP.position = player.position;
                                                                                newMatch.lineup.push(playerLP);

                                                                            });

                                                                            team2Players.forEach(function(player, index){

                                                                                playerLP = {};
                                                                                playerLP.playerId = player.playerId;
                                                                                playerLP.teamId = fixture.visitorteam_id;    
                                                                                playerLP.team = "team2";
                                                                                playerLP.position = player.position;
                                                                                newMatch.lineup.push(playerLP);

                                                                            });

                                                                            newMatch.save(function(matchSaveErr, savedMatch) {          
                                                                            if (matchSaveErr) {
                                                                                console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchSaveErr)));
                                                                                return;
                                                                            }
                                                                            if (savedMatch) {
                                                                                console.log('new match update')
                                                                                console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + savedMatch.matchId + ' updated', ''));
                                                                                return;
                                                                            }
                                                                      });
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    });


                                                    } else {

                                                        if(fixture.lineup.data.length > 0){

                                                            fixture.lineup.data.forEach(function(lineup, index) {

                                                                playerLP = {};
                                                                playerLP.playerId = lineup.player_id;
                                                                playerLP.playerName = lineup.player_name;
                                                                playerLP.teamId = lineup.team_id;
                                                                if(lineup.team_id === fixture.localteam_id){
                                                                    playerLP.team = "team1";
                                                                } else if(lineup.team_id === fixture.visitorteam_id){
                                                                    playerLP.team = "team2";
                                                                }
                                                                playerLP.posx = lineup.posx;
                                                                playerLP.posy = lineup.posy;
                                                                playerLP.position = lineup.position;
                                                                playerLP.shirtNumber = lineup.number;
                                                                playerLP.additionalPosition = lineup.additional_position;
                                                                playerLP.formationPosition = lineup.formation_position;
                                                                playerLP.shotsOnGoal = lineup.stats.shots.shots_on_goal;
                                                                playerLP.shotsTotal = lineup.stats.shots.shots_total;
                                                                playerLP.goalsScored = lineup.stats.goals.scored;
                                                                playerLP.goalsConceded = lineup.stats.goals.conceded;
                                                                playerLP.foulsCommited = lineup.stats.fouls.commited;
                                                                playerLP.foulsDrawn = lineup.stats.fouls.drawn;
                                                                playerLP.redcards = lineup.stats.cards.redcards;
                                                                playerLP.yellowcards = lineup.stats.cards.yellowcards;
                                                                playerLP.crossesTotal = lineup.stats.passing.total_crosses;
                                                                playerLP.crossesAccuracy = lineup.stats.passing.crosses_accuracy;
                                                                playerLP.passesTotal = lineup.stats.passing.passes;
                                                                playerLP.passesAccuracy = lineup.stats.passing.passes_accuracy;
                                                                playerLP.assists = lineup.stats.other.assists;
                                                                playerLP.offsides = lineup.stats.other.offsides;
                                                                playerLP.saves = lineup.stats.other.saves;
                                                                playerLP.scoredPenalties = lineup.stats.other.pen_scored;
                                                                playerLP.missedPenalties = lineup.stats.other.pen_missed;
                                                                playerLP.savedPenalties = lineup.stats.other.pen_saved;
                                                                playerLP.tackles = lineup.stats.other.tackles;
                                                                playerLP.blocks = lineup.stats.other.blocks;
                                                                playerLP.interceptions = lineup.stats.other.interceptions;
                                                                playerLP.clearances =  lineup.stats.other.clearances;
                                                                playerLP.minutesPlayed =  lineup.stats.other.minutes_played;
                                                               
                                                                newMatch.lineup.push(playerLP);

                                                                if(fixture.lineup.data.length == newMatch.lineup.length){
                                                                    newMatch.autoLineup = true;

                                                               }
                                                           });
                                                        } else {
                                                            console.log('LINEUP UN-AVAILABLE');
                                                            var teamsQuery = {$or: [{teamId:fixture.localteam_id}, {teamId:fixture.visitorteam_id}]};
                                                            var team1Players = [], team2Players = [];

                                                            Team.find(teamsQuery).populate('players', '-_id -active -teams').exec(function(teamsErr, teams){
                                                                if(teamsErr){
                                                                    console.log(teamsErr);
                                                                    return;
                                                                } 


                                                                var team1Obj = _.findWhere(teams,{"teamId":fixture.localteam_id.toString()})
                                                                var team2Obj = _.findWhere(teams,{"teamId":fixture.visitorteam_id.toString()})
                                                                
                                                                if(typeof team1Obj !== 'undefined' && team1Obj){
                                                                    team1Players = team1Obj.players;
                                                                } else{
                                                                    console.log('inside undefined team1 fetch -> matchId : ' + fixture.id);
                                                                }
                                                                
                                                                if(typeof team2Obj !== 'undefined' && team2Obj){
                                                                    team2Players = team2Obj.players;
                                                                } else{
                                                                    console.log('inside undefined team2 fetch -> matchId : ' + fixture.id);
                                                                }
                                                                

                                                                team1Players.forEach(function(player, index){

                                                                    playerLP = {};
                                                                    playerLP.playerId = player.playerId;
                                                                    playerLP.teamId = fixture.localteam_id;    
                                                                    playerLP.team = "team1";
                                                                    playerLP.position = player.position;
                                                                    newMatch.lineup.push(playerLP);

                                                                });

                                                                team2Players.forEach(function(player, index){

                                                                    playerLP = {};
                                                                    playerLP.playerId = player.playerId;
                                                                    playerLP.teamId = fixture.visitorteam_id;    
                                                                    playerLP.team = "team2";
                                                                    playerLP.position = player.position;
                                                                    newMatch.lineup.push(playerLP);

                                                                });

                                                                    newMatch.save(function(matchSaveErr, savedMatch) {          
                                                                    if (matchSaveErr) {
                                                                        console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchSaveErr)));
                                                                        return;
                                                                    }
                                                                    if(savedMatch){
                                                                         console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + savedMatch.matchId + ' Updated', ''));
                                                                         return;
                                                                    }        
                                                                });
                                                               

                                                            });

                                                        }
                                                }

                                        }

                                        else if (match.matchId == updatedMatch.id) {

                                            match.status = updatedMatch.time.status;
                                            match.team1Score = updatedMatch.scores.localteam_score;
                                            match.team2Score = updatedMatch.scores.visitorteam_score;
                                            match.team1Penalties = updatedMatch.scores.localteam_pen_score;
                                            match.team2Penalties = updatedMatch.scores.visitorteam_pen_score;
                                            newMatch.team1Formation = fixture.formations.localteam_formation;
                                            newMatch.team2Formation = fixture.formations.visitorteam_formation;
                                            match.startingDateTime = moment.utc(updatedMatch.time.starting_at.date_time);
                                            match.minute = updatedMatch.time.minute;
                                            match.extraMinute = updatedMatch.time.extra_time;
                                            match.htScore = updatedMatch.scores.ht_score;
                                            match.ftScore = updatedMatch.scores.ft_score;
                                            match.etScore = updatedMatch.scores.et_score;
                                            match.injuryTime = updatedMatch.injury_time;

                                             if (updatedMatch.weather == null) {
                                                match.weather = null;
                                            } else {
                                                match.weather = {};
                                                match.weather.code = updatedMatch.weather_report.code;
                                                match.weather.type = updatedMatch.weather_report.type;
                                                match.weather.icon = updatedMatch.weather_report.icon;
                                                match.weather.temperature = updatedMatch.weather_report.temperature.temp;
                                                match.weather.temperatureUnit = updatedMatch.weather_report.temperature.unit;
                                                match.weather.clouds = updatedMatch.weather_report.clouds;
                                                match.weather.humidity = updatedMatch.weather_report.humidity;
                                                match.weather.windSpeed = updatedMatch.weather_report.wind.speed;
                                                match.weather.windDegree = updatedMatch.weather_report.wind.degree;
                                            }


                                            if (updatedMatch.events.data.length > 0) {
                                                
                                                console.log('Match ' + match.matchId);
                                                console.log(updatedMatch.events.data.length + ' events in new data');
                                                console.log(match.events.length + ' events in existing data');

                                                if (match.events.length == 0) {

                                                    console.log('Match ' + match.matchId + ' has zero events - first event to be recorded');

                                                    updatedMatch.events.data.forEach(function(event, index) {

                                                        console.log('New Event : ' + event.type  + ' Player ID ' + event.player_id);
                                                        
                                                        var newEvent = new Event();
                                                        newEvent.eventId = event.id;
                                                        newEvent.matchId = event.fixture_id;
                                                        newEvent.teamId = event.team_id;
                                                        newEvent.type = event.type;
                                                        newEvent.minute = event.minute;
                                                        newEvent.extraMinute = event.extra_minute;
                                                        newEvent.reason = event.reason;
                                                        newEvent.injuried = event.injuried;
                                                        newEvent.playerId = event.player_id;
                                                        newEvent.playerName = event.player_name;
                                                        newEvent.relatedPlayerId = event.related_player_id;
                                                        newEvent.relatedPlayerName = event.related_player_name;


                                                        newEvent.save(function(savedEventErr, savedEvent) {
                                                            if (savedEventErr) {
                                                                console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(savedEventErr)));
                                                                return;
                                                            }
                                                            if (savedEvent) {
                                                                console.log('new event added')
                                                                console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Event ' + savedEvent.eventId + ' added', ''));

                                                                match.events.push(savedEvent);

                                                                if (match.events.length == updatedMatch.events.data.length) {
                                                                    console.log(match._id  + '    ---ERROR HERE-----      ' + match.matchId);
                                                                    match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                                       
                                                                        if (matchUpdateErr) {
                                                                            // console.log(matchUpdateErr)
                                                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                                            return;
                                                                        }
                                                                        if (savedUpdatedMatch) {
                                                                             console.log(match._id  + '    --------      ' + match.matchId);
                                                                            console.log('new match update')
                                                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + savedUpdatedMatch.matchId + ' updated', ''));
                                                                            return;
                                                                        }
                                                                    });
                                                                }
                                                                return;
                                                            }
                                                        });
                                                    });

                                                } else {

                                                    var newEvents = eventsFilter.sub(updatedMatch.events.data, match.events);

                                                    if (newEvents.length > 0) {

                                                        console.log(newEvents.length + ' event(s) to be updated for match ' + match.matchId)

                                                        newEvents.forEach(function(event, index) {


                                                            var newEvent = new Event();
                                                            newEvent.eventId = event.id;
                                                            newEvent.matchId = event.fixture_id;
                                                            newEvent.teamId = event.team_id;
                                                            newEvent.type = event.type;
                                                            newEvent.minute = event.minute;
                                                            newEvent.extraMinute = event.extra_minute;
                                                            newEvent.reason = event.reason;
                                                            newEvent.injuried = event.injuried;
                                                            newEvent.playerId = event.player_id;
                                                            newEvent.playerName = event.player_name;
                                                            newEvent.relatedPlayerId = event.related_player_id;
                                                            newEvent.relatedPlayerName = event.related_player_name;


                                                            newEvent.save(function(savedEventErr, savedEvent) {
                                                                if (savedEventErr) {
                                                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(savedEventErr)));
                                                                    return;
                                                                }
                                                                if (savedEvent) {
                                                                    console.log('existing event added')
                                                                    console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Event ' + savedEvent.eventId + ' added', ''));

                                                                    match.events.push(savedEvent);
                                                                    if (match.events.length == updatedMatch.events.data.length) {
                                                                        console.log(match._id  + '    ---ERROR HERE-----      ' + match.matchId);
                                                                        match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                                            if (matchUpdateErr) {
                                                                                // console.log(matchUpdateErr);
                                                                                console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                                                return;
                                                                            }
                                                                            if (savedUpdatedMatch) {
                                                                                
                                                                                console.log('existing match update')
                                                                                console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + savedUpdatedMatch.matchId + ' updated', ''));
                                                                                return;
                                                                            }
                                                                        });
                                                                    }
                                                                    return;
                                                                }
                                                            });

                                                        });
                                                    }
                                                }
                                            }


                                            console.log('------------- LINEUP HERE -------------');
                                            if (updatedMatch.lineup.data.length > 0 && match.autoLineup) {

                                                match.lineup = [];
                                                match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                    if (matchUpdateErr) {
                                                        console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                        return;
                                                    }
                                                    if (savedUpdatedMatch) {

                                                        updatedMatch.lineup.data.forEach(function(lineup, index) {

                                                            playerLP = {};
                                                            playerLP.playerId = lineup.player_id;
                                                            playerLP.playerName = lineup.player_name;
                                                            playerLP.teamId = lineup.team_id;
                                                            if(lineup.team_id === fixture.localteam_id){
                                                                playerLP.team = "team1";
                                                            } else if(lineup.team_id === fixture.visitorteam_id){
                                                                playerLP.team = "team2";
                                                            }
                                                            playerLP.posx = lineup.posx;
                                                            playerLP.posy = lineup.posy;
                                                            playerLP.position = lineup.position;
                                                            playerLP.shirtNumber = lineup.number;
                                                            playerLP.additionalPosition = lineup.additional_position;
                                                            playerLP.formationPosition = lineup.formation_position;
                                                            playerLP.shotsOnGoal = lineup.stats.shots.shots_on_goal;
                                                            playerLP.shotsTotal = lineup.stats.shots.shots_total;
                                                            playerLP.goalsScored = lineup.stats.goals.scored;
                                                            playerLP.goalsConceded = lineup.stats.goals.conceded;
                                                            playerLP.foulsCommited = lineup.stats.fouls.commited;
                                                            playerLP.foulsDrawn = lineup.stats.fouls.drawn;
                                                            playerLP.redcards = lineup.stats.cards.redcards;
                                                            playerLP.yellowcards = lineup.stats.cards.yellowcards;
                                                            playerLP.crossesTotal = lineup.stats.passing.total_crosses;
                                                            playerLP.crossesAccuracy = lineup.stats.passing.crosses_accuracy;
                                                            playerLP.passesTotal = lineup.stats.passing.passes;
                                                            playerLP.passesAccuracy = lineup.stats.passing.passes_accuracy;
                                                            playerLP.assists = lineup.stats.other.assists;
                                                            playerLP.offsides = lineup.stats.other.offsides;
                                                            playerLP.saves = lineup.stats.other.saves;
                                                            playerLP.scoredPenalties = lineup.stats.other.pen_scored;
                                                            playerLP.missedPenalties = lineup.stats.other.pen_missed;
                                                            playerLP.savedPenalties = lineup.stats.other.pen_saved;
                                                            playerLP.tackles = lineup.stats.other.tackles;
                                                            playerLP.blocks = lineup.stats.other.blocks;
                                                            playerLP.interceptions = lineup.stats.other.interceptions;
                                                            playerLP.clearances =  lineup.stats.other.clearances;
                                                            playerLP.minutesPlayed =  lineup.stats.other.minutes_played;
                                                               
                                                            
                                                            match.lineup.push(playerLP);

                                                                if(match.lineup.length == updatedMatch.lineup.data.length){
                                                                     match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                                        if (matchUpdateErr) {
                                                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                                            return;
                                                                        }
                                                                        if (savedUpdatedMatch) {
                                                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'lineup Added', ''));
                                                                            return;
                                                                        }
                                                                    });
                                                                }
                                                            });      
                                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' 1 Updated', ''));
                                                            return;
                                                    }
                                                });
                                                }
                                            }

                                    });
                                }
                            });

                        });

                    }
                    return;
                }
            });
        },
        onComplete: function() {
            console.log('Update Fixture Job Stopped');
        },
        start: true
    });
    fixtureAvailCheckJob.start();
}




//calculate points every 1 minute
exports.calculatePointsJob = function() {
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
    console.log('calculatePointsJob inside')
    var calculatePointsJob = new CronJob({

        cronTime: '*/30 * * * * *',
        onTick: function() {

                // var twoHoursBefore = moment(moment().subtract('2','h').format("YYYY-MM-DD HH:mm:ss")).toISOString();
                // var thirtyMinsAfter = moment(moment().add('30','m').format("YYYY-MM-DD HH:mm:ss")).toISOString();
                var twoHoursBefore = moment(moment().subtract('6','d').format("YYYY-MM-DD HH:mm:ss")).toISOString();
                var thirtyMinsAfter = moment(moment().subtract('2','d').format("YYYY-MM-DD HH:mm:ss")).toISOString();
                console.log('From ' + twoHoursBefore + ' To ' + thirtyMinsAfter);
                 console.log('calculatePointsJob called')
                Match.find({startingDateTime:{$gte:twoHoursBefore, $lt:thirtyMinsAfter}}).populate('events').exec( function(matchesErr, matches){
                     console.log(' ******** MATCHES TO BE CALCULATED  :: ' + matches.length + '  ********');
                    if(matchesErr){

                           console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, matchesErr, Codes.errorMsg.UNEXP_ERROR));
                    }

                    matches.forEach(function(match, index){
                        
                        if(index == 0){

                        // if(match.active){

                            console.log('Calculating for match ' + match.matchId);

                            var goal = [], goalByAssist = [], goalByPenalty = [], goalByPenaltyMissed = [], goalSave = [], goalByPenaltySave = [], goalOwn = [];
                            var cardRed = [], cardYellow = [], cardYellowRed = [];
                            var substitution = [];

                            var cleanSheet = [];

                            var unrecorded = [];

                            var computePoints = function(playerLP, event){

                                var pos = playerLP.position;
                                //defense
                                if(pos === "D"){//pos === "CD" || pos ===  "CD-L" || pos === "CD-R" || pos === "LB" || pos === "RB" ||
                                    // console.log(pos + ' - defense');
                                    return computePointsDefense(event);
                                } else
                                //midfielder    
                                if(pos === "M"){//pos === "Midfielder" || pos === "CM-L" || pos === "CM-R" || pos === "CM" ||  pos === "LM" || pos === "RM" || pos === "AM" || 
                                    return computePointsMidfield(event);
                                    // console.log(pos + ' - midfielder');
                                } else
                                //forward
                                if(pos === "F"){//pos === "Forward" || pos === "LF" || pos === "RF" || pos === "CF" || pos === "CF-L" || pos ==="CF-R" || 
                                    // console.log(pos + ' - forward');
                                    return computePointsForward(event);
                                } else
                                //goalkeeper    
                                if(pos === "G"){//pos === "Goalkeeper" || 
                                    // console.log(pos + ' - goalkeeper');
                                    return computePointsGoalkeeper(event);
                                } else
                                //sub   
                                if(pos === "SUB"){
                                    // console.log(pos + ' - substitution');
                                    return 0;
                                } //otherwise
                                else {
                                    // console.log(pos + ' - new position');
                                    return 0;
                                }
                                
                            //console.log(playerLP)
                                
                            }

                            var computePointsDefense = function(event){
                                if(event === "goal"){
                                    return 6;
                                } else if(event === "goalByAssist"){
                                    return 3;
                                } else if(event === "goalByPenalty"){
                                    return 2;
                                } else if(event === "goalByPenaltyMissed"){
                                    return -2;
                                } else if(event === "goalOwn"){
                                    return -2;
                                } else if(event === "cardYellow"){
                                    return -1;
                                } else if(event === "cardYellowRed"){
                                    return -2;
                                } else if(event === "cardRed"){
                                    return -3;
                                } else if(event === "cleanSheet"){
                                    return 3;
                                } else {
                                    return 0;
                                }
                            }

                            var computePointsMidfield = function(event){
                                if(event === "goal"){
                                    return 5;
                                } else if(event === "goalByAssist"){
                                    return 4;
                                } else if(event === "goalByPenalty"){
                                    return 2;
                                } else if(event === "goalByPenaltyMissed"){
                                    return -2;
                                } else if(event === "goalOwn"){
                                    return -2;
                                } else if(event === "cardYellow"){
                                    return -1;
                                } else if(event === "cardYellowRed"){
                                    return -2;
                                } else if(event === "cardRed"){
                                    return -3;
                                } else if(event === "cleanSheet"){
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }

                            var computePointsForward = function(event){
                                if(event === "goal"){
                                    return 4;
                                } else if(event === "goalByAssist"){
                                    return 3;
                                } else if(event === "goalByPenalty"){
                                    return 2;
                                } else if(event === "goalByPenaltyMissed"){
                                    return -2;
                                } else if(event === "goalOwn"){
                                    return -2;
                                } else if(event === "cardYellow"){
                                    return -1;
                                } else if(event === "cardYellowRed"){
                                    return -2;
                                } else if(event === "cardRed"){
                                    return -3;
                                } else if(event === "cleanSheet"){
                                    return 0;
                                } else {
                                    return 0;
                                }
                            }

                            var computePointsGoalkeeper = function(event){
                                if(event === "goal"){
                                    return 6;
                                } else if(event === "goalByAssist"){
                                    return 3;
                                } else if(event === "goalByPenalty"){
                                    return 2;
                                } else if(event === "goalByPenaltyMissed"){
                                    return -2;
                                } else if(event === "goalOwn"){
                                    return -2;
                                } else if(event === "cardYellow"){
                                    return -1;
                                } else if(event === "cardYellowRed"){
                                    return -2;
                                } else if(event === "cardRed"){
                                    return -3;
                                } else if(event === "cleanSheet"){
                                    return 4;
                                } else {
                                    return 0;
                                }
                            }


                            var computePointsCleanSheet = function(match){
                                if(match.team1Score == 0){
                                    _.each(match.lineup, function(playerLP, index, cleanSheetEvent){
                                        if(playerLP.team === "team2"){
                                            var event = {};
                                            event.playerId = playerLP.playerId; 
                                            event.teamId = playerLP.teamId; 
                                            event.type = "cleansheet";
                                            cleanSheet.push(event);
                                        }
                                    });
                                } 

                                if(match.team2Score == 0){
                                    _.each(match.lineup, function(playerLP, index, cleanSheetEvent){
                                        if(playerLP.team === "team1"){
                                            var event = {};
                                            event.playerId = playerLP.playerId; 
                                            event.teamId = playerLP.teamId; 
                                            event.type = "cleansheet";
                                            cleanSheet.push(event);
                                        }
                                    });
                                }
                            }




                            console.log('Match Id : ' + match.matchId);
                            console.log('Events Length : ' + match.events.length);

                            _.each(match.lineup, function(playerLP, index, cleanSheetEvent){
                                    // playerLP.points = 0;
                            });

                            if(match.status === "FT"){
                                computePointsCleanSheet(match);
                            }

                            match.events.forEach(function(event, id){
                                switch(event.type) {
                                    
                                    case "goal":
                                        if("relatedPlayerId" in event){
                                            goalByAssist.push(event);
                                        } else {
                                            goal.push(event);
                                        }
                                        break;

                                    case "penalty":
                                        goalByPenalty.push(event);
                                        break;
                                    
                                    case "missed_penalty":
                                        goalByPenaltyMissed.push(event);
                                        break;

                                    case "own-goal":
                                        goalOwn.push(event);
                                        break;

                                    case "yellowcard": 
                                        cardYellow.push(event);
                                        break;

                                    case "redcard":
                                        cardRed.push(event);
                                        break;

                                    case "yellowred":
                                        cardYellowRed.push(event);
                                        break;

                                    case "substitution":
                                        substitution.push(event);
                                        break;
                                    
                                    case "pen_shootout_miss":
                                        goalByPenalty.push(event);
                                        break;

                                    case "pen_shootout_goal":
                                        goalByPenaltyMissed.push(event);
                                        break;

                                    default:
                                        unrecorded.push(event);
                                        console.log('New Event Recorded ' + event.type);
                                        break;
                                }

                            });

                            console.log('-------------------------')
                            console.log('Goals : ' + goal.length);
                            console.log('Goals With Assist : ' + goalByAssist.length);
                            console.log('Goals By Penalty : ' + goalByPenalty.length);
                            console.log('Goals By Penalty Missed : ' + goalByPenaltyMissed.length);
                            console.log('Goals Save : ' + goalSave.length);
                            console.log('Goals By Penalty Save : ' + goalByPenaltySave.length);
                            console.log('Goals (Own) : ' + goalOwn.length);
                            console.log('Yellow Cards : ' + cardYellow.length);
                            console.log('Red Cards : ' + cardRed.length);
                            console.log('YellowRed Cards : ' + cardYellowRed.length);
                            console.log('Substitution : ' + substitution.length);
                            console.log('Clean Sheets : ' + cleanSheet.length);
                            console.log('Unrecorded Events : ' + unrecorded.length);
                            console.log('-------------------------')

                            var recordedEvents = {};
                            recordedEvents["goal"] = goal;
                            recordedEvents["goalByAssist"] = goalByAssist;
                            recordedEvents["goalByPenalty"] = goalByPenalty;
                            recordedEvents["goalByPenaltyMissed"] = goalByPenaltyMissed;
                            recordedEvents["goalSave"] = goalSave;
                            recordedEvents["goalByPenaltySave"] = goalByPenaltySave;
                            recordedEvents["goalOwn"] = goalOwn;
                            recordedEvents["cardYellow"] = cardYellow;
                            recordedEvents["cardRed"] = cardRed;
                            recordedEvents["cardYellowRed"] = cardYellowRed;
                            recordedEvents["substitution"] = substitution;
                            recordedEvents["cleanSheet"] = cleanSheet;

                            // console.log('Recorded Events Array Length : ' + JSON.stringify(recordedEventsArray, null, 2));
                            console.log('Recorded Events Object Length : ' + _.size(recordedEvents));

                            _.each(recordedEvents,function(recordedEvent, key, recordedEvents){
                                if(recordedEvent.length > 0){
                                    console.log('Calculating Points for Event: ' + key);
                                    _.each(recordedEvent, function(_event, index, recordedEvent){
                                         // console.log('---------------- MATCH LINEUP ----------------');
                                            // console.log(match.lineup);
                                         // console.log('---------------- MATCH LINEUP LENGTH----------------');
                                         // console.log(match.lineup.length);
                                          // console.log('---------------- DEBUGGING STARTS ----------------');

                                        console.log('\n---------------- EVENT ID ---------------- : ' + _event.eventId);  
                                        console.log('\n---------------- PLAYER ID ---------------- : ' + _event.playerId);
                                        if(!(_event.computed)){
                                          if(_event.playerId != null){

                                            // console.log('LINEUP of player ' + _.findWhere(match.lineup,{"playerId":_event.playerId}));
                                            var playerX = _.findWhere(match.lineup,{"playerId":_event.playerId}); 

                                            if(playerX !== undefined && playerX){

                                                Event.update({eventId:_event.eventId},{$set:{computed:true}}).exec(function(eventUptErr, eventUpt){
                                                    if(eventUptErr){
                                                        console.log(eventUptErr);
                                                    }
                                                    console.log('Event Updated As Computed ');
                                                });

                                                if(key === "substitution"){

                                                    console.log('---------------- SUBSTITUTION ----------------\n');
                                                    // console.log(key + " for player " + _.findWhere(match.lineup,{"playerId":_event.playerId}).playerId);
                                                  
                                                    _.findWhere(match.lineup,{"playerId":_event.playerId}).points = _.findWhere(match.lineup,{"playerId":_event.playerId}).points +  computePoints(_.findWhere(match.lineup,{"playerId":_event.playerId}),key);
                                                
                                                } else if(key === "goalByAssist"){

                                                    console.log('---------------- GOAL BY ASSIST ----------------\n');
                                                    // console.log(key + " - goal for player " + _.findWhere(match.lineup,{"playerId":_event.playerId}).playerId);
                                                    // console.log(key + " - assist for player " + _.findWhere(match.lineup,{"playerId":_event.relatedPlayerId}).playerId);
                                                    
                                                    _.findWhere(match.lineup,{"playerId":_event.playerId}).points = _.findWhere(match.lineup,{"playerId":_event.playerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.playerId}),"goal");
                                                    
                                                    if(_event.relatedPlayerId != null){

                                                        _.findWhere(match.lineup,{"playerId":_event.relatedPlayerId}).points = _.findWhere(match.lineup,{"playerId":_event.relatedPlayerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.relatedPlayerId}),"goalByAssist");
                                                    
                                                    }
                                                
                                                } else {
                                                     console.log('---------------- ' + key + ' ----------------\n');
                                                     // console.log('Player ID : ' + _event.playerId);

                                                      // console.log(key + " for player " + _.findWhere(match.lineup,{"playerId":_event.playerId}).playerId);
                                                     _.findWhere(match.lineup,{"playerId":_event.playerId}).points = _.findWhere(match.lineup,{"playerId":_event.playerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.playerId}),key);
                                                   
                                                
                                                }
                                            } else {                                                
                                                 console.log("Player Id " + _event.playerId + " not found in lineup of event "  + _event.eventId + " of match " + _event.matchId + "\n");
                                            
                                            }
                                          } else {
                                            
                                            console.log("Player Id is null for event "  + _event.eventId + " of match " + _event.matchId + "\n");
                                          
                                          }
                                      } else{
                                        console.log("Event Id " + _event.eventId + " already computed\n");
                                      }

                                            
                                    });
                                }
                            });

                            //console.log(match.lineup)
                            match.save(function(matchSaveErr, savedMatch){
                                if (matchSaveErr) {
                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchSaveErr)));                                    
                                    return;
                                } 

                                    MatchCard.find({match:savedMatch._id}).populate('match players').exec(function(matchCardsErr, matchCards){
                                        if(matchCardsErr){
                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, matchCardErr, Codes.errorMsg.UNEXP_ERROR));
                                            return;
                                        }
                                        console.log('Update matchCards');
                                        if(matchCards.length == 0){
                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, '', Codes.errorMsg.F_NO_MC_M));
                                            return;
                                        }

                                        _.each(matchCards, function(matchCard, index, matchCards){
                                                var lineupInMatch = {};
                                                var matchPoints = 0;
                                                lineupInMatch = savedMatch.lineup;
                                                _.each(lineupInMatch, function(lineup, index, lineups){
                                                    // console.log('MATCHCARD PLAYERS');
                                                    // console.log(matchCard);
                                                    var player = _.findWhere(matchCard.players,{"playerId":lineup.playerId});
                                                    if(player !== undefined && player){
                                                         _.findWhere(matchCard.players,{"playerId":lineup.playerId}).points = lineup.points;
                                                         matchPoints = matchPoints + _.findWhere(matchCard.players,{"playerId":lineup.playerId}).points;
                                                    }
                                                    
                                                });

                                                matchCard.matchPoints = matchPoints;
                                                matchCard.save(function(matchCardSaveErr, savedMatchCard){
                                                if (matchCardSaveErr) {
                                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchCardSaveErr)));                                    
                                                    return;
                                                } 
                                                 if(savedMatchCard){
                                                    console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' Points Calculated', ''));
                                                    return;
                                                }
                                               });
                                        });
                                            

                                });

                            });
                        // } //match.active
                        }

                    });              
                });
            
        },
        onComplete: function() {
            console.log('Calculate Points Job Stopped');
        },
        start: true
    });
    calculatePointsJob.start();
}
