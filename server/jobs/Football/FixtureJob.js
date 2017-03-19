/*
 * Created by harirudhra on Sat 11 March 2017
 */

var moment = require('moment');
var request = require('request');
var CronJob = require('cron').CronJob;
var Subtract = require('array-subtract');

var Match = require('../../models/Football/Match');
var Event = require('../../models/Football/Event');

var Codes = require('../../Codes');
var Validation = require('../../controllers/Validation');

var API_TOKEN = "H7H9qU3lmK1UNpqQoNxBI2PkZJec2IMAcNhByMSQ1GWhAt5tUDVtobVc1ThK";
var baseUrl = "https://api.soccerama.pro/v1.2/";

var fireUrl = function(params, include) {
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

            //must be livescore/now	
            params = 'livescore'
            include = ''

            request.get(fireUrl(params, include), function(err, response, data) {

                if (err) {
                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
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
                        console.log(data.length + ' matches to be updated');

                        data.forEach(function(fixture, index) {

                            params = 'livescore/match/' + fixture.id
                            include = 'lineup,events'

                            request.get(fireUrl(params, include), function(err, response, data) {
                                if (err) {
                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
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
                                    var updatedMatch = data;

                                    Match.findOne({ matchId: updatedMatch.id }).populate('events').exec(function(matchErr, match) {
                                        if (matchErr) {
                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
                                            return;
                                        }

                                        if (match == null) {
                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, '', Codes.errorMsg.F_INV_MID));
                                            return;
                                        }

                                        if (match.matchId == updatedMatch.id) {

                                            match.status = updatedMatch.status;
                                            match.team1Score = updatedMatch.home_score;
                                            match.team2Score = updatedMatch.away_score;
                                            match.team1Penalties = updatedMatch.home_score_penalties;
                                            match.team2Penalties = updatedMatch.away_score_penalties;
                                            if (updatedMatch.date_time_tba == 1 || updatedMatch.date_time_tba == true) {
                                                match.dateTimeTBA = true;
                                            } else if (updatedMatch.date_time_tba == 0 || updatedMatch.date_time_tba == false) {
                                                match.dateTimeTBA = false;
                                            }
                                            match.startingDateTime = moment.utc(updatedMatch.starting_date + ' ' + updatedMatch.starting_time);
                                            match.minute = updatedMatch.minute;
                                            match.extraMinute = updatedMatch.extra_time;
                                            match.htScore = updatedMatch.ht_score;
                                            match.ftScore = updatedMatch.ft_score;
                                            match.etScore = updatedMatch.et_score;
                                            match.injuryTime = updatedMatch.injury_time;


                                            if (updatedMatch.events.data.length > 0) {
                                            	
                                            	console.log('Match ' + match.matchId);
                                                console.log(updatedMatch.events.data.length + ' events in new data');
                                                console.log(match.events.length + ' events in existing data');

                                                if (match.events.length == 0) {

                                                    console.log('Match ' + match.matchId + ' has zero events - first event to be recorded');

                                                    updatedMatch.events.data.forEach(function(event, index) {

                                                        var newEvent = new Event();
                                                        newEvent.eventId = event.id;
                                                        newEvent.matchId = event.match_id;
                                                        newEvent.teamId = event.team_id;
                                                        newEvent.minute = event.minute;
                                                        newEvent.extraMinute = event.extra_min;
                                                        newEvent.type = event.type;
                                                        if (event.hasOwnProperty("player_id")) {
                                                            newEvent.playerId = event.player_id;
                                                        }
                                                        if (event.hasOwnProperty("assist_id")) {
                                                            newEvent.assistPlayerId = event.assist_id;
                                                        }
                                                        if (event.hasOwnProperty("related_event_id")) {
                                                            newEvent.relatedEventId = event.related_event_id;
                                                        }
                                                        if (event.hasOwnProperty("player_in_id")) {
                                                            newEvent.playerInId = event.player_in_id;
                                                        }
                                                        if (event.hasOwnProperty("player_out_id")) {
                                                            newEvent.playerOutId = event.player_out_id;
                                                        }

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

                                                                    match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                                        if (matchUpdateErr) {
                                                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                                            return;
                                                                        }
                                                                        if (savedUpdatedMatch) {
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
                                                            newEvent.matchId = event.match_id;
                                                            newEvent.teamId = event.team_id;
                                                            newEvent.minute = event.minute;
                                                            newEvent.extraMinute = event.extra_min;
                                                            newEvent.type = event.type;
                                                            if (event.hasOwnProperty("player_id")) {
                                                                newEvent.playerId = event.player_id;
                                                            }
                                                            if (event.hasOwnProperty("assist_id")) {
                                                                newEvent.assistPlayerId = event.assist_id;
                                                            }
                                                            if (event.hasOwnProperty("related_event_id")) {
                                                                newEvent.relatedEventId = event.related_event_id;
                                                            }
                                                            if (event.hasOwnProperty("player_in_id")) {
                                                                newEvent.playerInId = event.player_in_id;
                                                            }
                                                            if (event.hasOwnProperty("player_out_id")) {
                                                                newEvent.playerOutId = event.player_out_id;
                                                            }

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

                                                                        match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                                            if (matchUpdateErr) {
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



                                            if (updatedMatch.lineup.data.length > 0) {


                                            	match.lineup = [];
                                            	match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                    if (matchUpdateErr) {
                                                        console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                        return;
                                                    }
                                                    if (savedUpdatedMatch) {

                                                    	updatedMatch.lineup.data.forEach(function(lineup, index) {

                                                   		playerLP = {};

                                                        playerLP.position = lineup.position;
                                                        playerLP.shirtNumber = lineup.shirt_number;
                                                        playerLP.assists = lineup.assists;
                                                        playerLP.foulsCommited = lineup.fouls_commited;
                                                        playerLP.foulsDrawn = lineup.fouls_drawn;
                                                        playerLP.goals = lineup.goals;
                                                        playerLP.offsides = lineup.offsides;
                                                        playerLP.missedPenalties = lineup.missed_penalties;
                                                        playerLP.scoredPenalties = lineup.scored_penalties;
                                                        playerLP.posx = lineup.posx;
                                                        playerLP.posy = lineup.posy;
                                                        playerLP.redcards = lineup.redcards;
                                                        playerLP.saves = lineup.saves;
                                                        playerLP.shotsOnGoal = lineup.shots_on_goal;
                                                        playerLP.shotsTotal = lineup.shots_total;
                                                        playerLP.yellowcards = lineup.yellowcards;
                                                        playerLP.type = lineup.type;

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
                                                        console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' Updated', ''));
                                                        return;
                                                    }
                                                });
                                            	}
                                            }

                                            if (updatedMatch.weather == null) {
                                                match.weather == null;
                                            } else {
                                                match.weather = {};
                                                match.weather.code = updatedMatch.weather.code;
                                                match.weather.type = updatedMatch.weather.type;
                                                match.weather.icon = updatedMatch.weather.icon;
                                                match.weather.temperature = updatedMatch.weather.temperature.temp;
                                                match.weather.temperatureUnit = updatedMatch.weather.temperature.unit;
                                                match.weather.clouds = updatedMatch.weather.clouds;
                                                match.weather.humidity = updatedMatch.weather.humidity;
                                                match.weather.windSpeed = updatedMatch.weather.windSpeed;
                                                match.weather.windDegree = updatedMatch.weather.windDegree;
                                            }

                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' Updated', ''));
                                            return;

                                    });
                                }
                            });

                        });
                        // var fixtureUpdateJob = new CronJob({
                        // 	cronTime: '*2/',
                        // });
                        // fixtureUpdateJob.start();

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
