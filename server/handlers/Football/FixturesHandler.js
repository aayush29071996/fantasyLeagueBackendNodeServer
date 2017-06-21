/*
 * Created by harirudhra on Sun 29 Jan 2017
 */

var request = require('request');
var moment = require('moment');

var Competition = require('../../models/Football/Competition');
var Season = require('../../models/Football/Season');
var Match = require('../../models/Football/Match');
var Event = require('../../models/Football/Event');

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

exports.populateCompetitionsAndSeasons = function(req, res) {

    params = 'leagues';
    include = 'season';

    request.get(fireUrl(params, include), function(err, response, data) {

        if (err) {
            res.status(Codes.httpStatus.ISE).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.ISE,
                data: '',
                error: Codes.errorMsg.UNEXP_ERROR
            });
            return;
        }

        if (response.statusCode == Codes.httpStatus.NF) {
            res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.INVALID_REQ
            });
            return;

        }
        if (response.statusCode == Codes.httpStatus.UNAUTH) {
            res.status(Codes.httpStatus.UNAUTH).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.UNAUTH,
                data: '',
                error: Codes.errorMsg.UNAUTH_KEY
            });
            return;
        }

        if (response.statusCode == Codes.httpStatus.OK) {
            data = JSON.parse(data);

            if (data.hasOwnProperty("error")) {
                if (data.error.code == Codes.httpStatus.ISE) {
                    res.status(Codes.httpStatus.BR).json({
                        status: Codes.status.FAILURE,
                        code: Codes.httpStatus.BR,
                        data: '',
                        error: Codes.errorMsg.INVALID_REQ
                    });
                    return;
                }
            }

            data = data.data;
            //console.log(data)
            data.forEach(function(competiton, index) {
                Competition.findOne({ competitionId: competiton.id }, function(compErr, comp) {
                    if (compErr) {
                        res.status(Codes.httpStatus.ISE).json({
                            status: Codes.status.FAILURE,
                            code: Codes.httpStatus.ISE,
                            data: '',
                            error: Codes.errorMsg.UNEXP_ERROR
                        });
                        return;
                    }

                    if (comp != null) {
                        console.log('competiton with id ' + comp.competitionId + ' and name ' + comp.name + ' already exists')
                        return false;
                    }

                    if (comp == null) {
                        console.log('adding new competition')
                        var newCompetiton = new Competition();
                        newCompetiton.competitionId = competiton.id;
                        newCompetiton.name = competiton.name;
                        newCompetiton.active = true;
                        newCompetiton.currentSeason = competiton.current_season_id;
                        newCompetiton.save(function(compSaveErr, savedComp) {
                            if (compSaveErr) {
                                console.log('compSaveErr')
                                res.status(Codes.httpStatus.BR).json({
                                    status: Codes.status.FAILURE,
                                    code: Codes.httpStatus.BR,
                                    data: '',
                                    error: Validation.validatingErrors(compSaveErr)
                                });
                                return;
                            }
                            Season.findOne({ seasonId: savedComp.currentSeason }, function(seasErr, seas) {
                                if (seasErr) {
                                    res.status(Codes.httpStatus.ISE).json({
                                        status: Codes.status.FAILURE,
                                        code: Codes.httpStatus.ISE,
                                        data: '',
                                        error: Codes.errorMsg.UNEXP_ERROR
                                    });
                                    return;
                                }

                                if (seas != null) {
                                    console.log('season with id ' + seas.seasonId + ' and name ' + seas.name + ' already exists')
                                    return false;
                                }

                                if (seas == null) {
                                    console.log('adding new season')
                                    var newSeason = new Season();
                                    newSeason.seasonId = competiton.season.data.id;
                                    newSeason.competitionId = competiton.id;
                                    newSeason.name = competiton.season.data.name;
                                    newSeason.active = true;
                                    newSeason.competition = savedComp;

                                    newSeason.save(function(seasSaveErr, savedSeas) {
                                        if (seasSaveErr) {
                                            console.log('seasSaveErr')
                                            res.status(Codes.httpStatus.BR).json({
                                                status: Codes.status.FAILURE,
                                                code: Codes.httpStatus.BR,
                                                data: '',
                                                error: Validation.validatingErrors(compSaveErr)
                                            });
                                            return;
                                        }
                                        console.log(savedSeas + ' saved Season');
                                    });
                                    return;
                                }
                            });
                            console.log(savedComp + ' saved Competition');
                        });
                    }
                });
				
				if(index == data.length -1 ){
					res.status(Codes.httpStatus.OK).json({
						status: Codes.status.SUCCESS,
						code: Codes.httpStatus.OK,
						data: data,
						error: 'populated seaons for all competetitions'
					});
					return;
				}

            });
        } else {
            console.log(response.statusCode + '' + response.statusMessage);
        }
    });
}


exports.populateSeasonsWithFixtures = function(req, res) {


	Season.find({}).populate('competition').exec(function(seasErr, seas) {

	    if (seasErr) {
	        res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
	    }
	  
	    if (seas.length == 0) {
	        console.log('no seasons available. populate the competitions and seasons');
	        return false;
	    }

	    if (seas.length > 0) {
	        seas.forEach(function(season, sIndex) {
	        	console.log('season id ' + season.seasonId)
	            params = 'seasons/' + season.seasonId;
	            //fixtures - future
	            //matches - all
	            // must change below also in getting data: data = data.matches.data;
	            include = 'fixtures.events,fixtures.lineup';

	            request.get(fireUrl(params, include), function(err, response, data) {

	            	console.log('Firing ' + fireUrl(params, include));


	                if (err) {
	                	res.status(Codes.httpStatus.ISE).json({
	                        status: Codes.status.FAILURE,
	                        code: Codes.httpStatus.ISE,
	                        data: '',
	                        error: Codes.errorMsg.UNEXP_ERROR
	                    });
	                    return;
	                }

	                if (response.statusCode == Codes.httpStatus.NF) {
	                    res.status(Codes.httpStatus.BR).json({
	                        status: Codes.status.FAILURE,
	                        code: Codes.httpStatus.BR,
	                        data: '',
	                        error: Codes.errorMsg.INVALID_REQ
	                    });
	                    return;

	                }
	                if (response.statusCode == Codes.httpStatus.UNAUTH) {
	                    res.status(Codes.httpStatus.UNAUTH).json({
	                        status: Codes.status.FAILURE,
	                        code: Codes.httpStatus.UNAUTH,
	                        data: '',
	                        error: Codes.errorMsg.UNAUTH_KEY
	                    });
	                    return;
	                }

	                if (response.statusCode == Codes.httpStatus.OK) {

	                    data = JSON.parse(data);

	                    if (data.hasOwnProperty("error")) {
	                        if (data.error.code == Codes.httpStatus.ISE) {
	                            res.status(Codes.httpStatus.BR).json({
	                                status: Codes.status.FAILURE,
	                                code: Codes.httpStatus.BR,
	                                data: '',
	                                error: Codes.errorMsg.INVALID_REQ
	                            });
	                            return;
	                        }
	                    }
	                    // if(include = 'matches'){
	                    // 	 data = data.matches.data;
	                    // } else if(include = 'fixtures'){
	                    // 	  data = data.fixtures.data;
	                    // }

	                    data = data.matches.data;
	                    console.log(data.length + ' matches for the competition ' + season.competition.name + ' of season ' + season.name  + ' with index ' + sIndex);  
	                    if(data.length > 0){
	                    	// console.log(data.length + ' matches for the competition ' + season.competition.name + ' of season ' + season.name  + ' with index ' + sIndex);
    		                data.forEach(function(fixture, index) {
    		                console.log('match index ' + index);		           
	                        
	                        Match.findOne({ matchId: fixture.id }, function(matchErr, match) {
	                            if (matchErr) {
	                                res.status(Codes.httpStatus.ISE).json({
	                                    status: Codes.status.FAILURE,
	                                    code: Codes.httpStatus.ISE,
	                                    data: '',
	                                    error: Codes.errorMsg.UNEXP_ERROR
	                                });
	                                return;
	                            }

	                            if (match != null) {
	                                console.log('match with id ' + match.matchId + ' already exists')
	                                return false;
	                            }

	                            if (match == null) {
	                               // console.log('adding new match')
	                                var newMatch = new Match();
	                                newMatch.matchId = fixture.id;
	                                newMatch.team1Id = fixture.localteam_id;
	                                newMatch.team2Id = fixture.visitorteam_id;
	                                newMatch.status = fixture.time.status;
	                                newMatch.team1Score = fixture.scores.localteam_score;
	                                newMatch.team2Score = fixture.scores.visitorteam_score;
	                                newMatch.team1Penalties = fixture.scores.localteam_pen_score;
	                                newMatch.team2Penalties = fixture.scores.visitorteam_pen_score;
	                                // if (fixture.date_time_tba == 1 || fixture.date_time_tba == true) {
	                                //     newMatch.dateTimeTBA = true;
	                                // } else if (fixture.date_time_tba == 0 || fixture.date_time_tba == false) {
	                                //     newMatch.dateTimeTBA = false;
	                                // }
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

	                                if(fixture.lineup.data.length > 0){

		                                fixture.lineup.data.forEach(function(lineup, index) {

		                                    playerLP = {};
		                                    playerLP.playerId = lineup.player_id;
		                                    playerLP.teamId = lineup.team_id;
		                                    if(lineup.team_id === fixture.localteam_id){
		                                        playerLP.team = "team1";
		                                    } else if(lineup.team_id === fixture.visitorteam_id){
		                                        playerLP.team = "team2";
		                                    }
		                                    playerLP.position = lineup.position;
		                                    playerLP.shirtNumber = lineup.number;
		                                    playerLP.assists = lineup.stats.other.assists;
		                                    playerLP.foulsCommited = lineup.stats.fouls.commited;
		                                    playerLP.foulsDrawn = lineup.stats.fouls.drawn;
		                                    playerLP.goals = lineup.stats.goals.scored;
		                                    playerLP.offsides = lineup.stats.other.offsides;
		                                    playerLP.missedPenalties = lineup.stats.other.pen_missed;
		                                    playerLP.scoredPenalties = lineup.stats.other.pen_scored;
		                                    playerLP.posx = lineup.posx;
		                                    playerLP.posy = lineup.posy;
		                                    playerLP.redcards = lineup.stats.cards.redcards;
		                                    playerLP.saves = lineup.stats.other.saves;
		                                    playerLP.shotsOnGoal = lineup.stats.shots.shots_on_goal;
		                                    playerLP.shotsTotal = lineup.stats.shots.shots_total;
		                                    playerLP.yellowcards = lineup.stats.cards.yellowcards;
		                                    // playerLP.type = lineup.type;
		                                   
		                                    newMatch.lineup.push(playerLP);
	                                    });      
		                            }

	                                if(fixture.events.data.length > 0){

	                                	fixture.events.data.forEach(function(event, index) {

                                            var newEvent = new Event();
                                            newEvent.eventId = event.id;
                                            newEvent.matchId = event.fixture_id;
                                            newEvent.teamId = event.team_id;
                                            newEvent.minute = event.minute;
                                            newEvent.extraMinute = event.extra_minute;
                                            newEvent.type = event.type;
                                            if (event.hasOwnProperty("player_id")) {
                                                newEvent.playerId = event.player_id;
                                            }
                                            if (event.hasOwnProperty("related_player_id")) {
                                                newEvent.assistPlayerId = event.related_player_id;
                                            }
                                            // if (event.hasOwnProperty("related_event_id")) {
                                            //     newEvent.relatedEventId = event.related_event_id;
                                            // }
                                            // if (event.hasOwnProperty("player_in_id")) {
                                            //     newEvent.playerInId = event.player_in_id;
                                            // }
                                            // if (event.hasOwnProperty("player_out_id")) {
                                            //     newEvent.playerOutId = event.player_out_id;
                                            // }

                                            newEvent.save(function(savedEventErr, savedEvent) {
                                                if (savedEventErr) {
                                                  	res.status(Codes.httpStatus.BR).json({
				                                        status: Codes.status.FAILURE,
				                                        code: Codes.httpStatus.BR,
				                                        data: '',
				                                        error: Validation.validatingErrors(savedEventErr)
				                                    });
				                                    return;
                                                   
                                                }
                                                if (savedEvent) {
                                                    newMatch.events.push(savedEvent);

                                                    if (newMatch.events.length == fixture.events.data.length) {

                                                        newMatch.save(function(matchSaveErr, savedMatch) {          
						                                if (matchSaveErr) {
						                                    res.status(Codes.httpStatus.BR).json({
						                                        status: Codes.status.FAILURE,
						                                        code: Codes.httpStatus.BR,
						                                        data: '',
						                                        error: Validation.validatingErrors(matchSaveErr)
						                                    });
						                                    return;
						                                }
						                               // console.log(savedMatch + ' saved')
						                            });
                                                    }
                                                    return;
                                                }
                                            });
                                        });


	                                } else {
	                                	newMatch.save(function(matchSaveErr, savedMatch) {          
	                                    if (matchSaveErr) {
	                                        res.status(Codes.httpStatus.BR).json({
	                                            status: Codes.status.FAILURE,
	                                            code: Codes.httpStatus.BR,
	                                            data: '',
	                                            error: Validation.validatingErrors(matchSaveErr)
	                                        });
	                                        return;
	                                    }
	                                   // console.log(savedMatch + ' saved')
	                                });
	                                }
	                            }
	                        });
		                    });
						} else {
							console.log('no matches available for this season');
						}
	                } else {
	                    console.log(response.statusCode + '' + response.statusMessage);
	                }
	            });
				if(sIndex == seas.length - 1){
	        		console.log('final call');
	                res.status(Codes.httpStatus.OK).json({
	                    status: Codes.status.SUCCESS,
	                    code: Codes.httpStatus.OK,
	                    data: 'populated all fixtures for all seasons',
	                    error: ''
	                });
	                return;
		        }
	        });
	    }
	});
}


