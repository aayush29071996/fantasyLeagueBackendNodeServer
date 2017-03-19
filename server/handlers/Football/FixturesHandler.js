/*
 * Created by harirudhra on Sun 29 Jan 2017
 */

var request = require('request');
var moment = require('moment');

var Competition = require('../../models/Football/Competition');
var Season = require('../../models/Football/Season');
var Match = require('../../models/Football/Match');

var Codes = require('../../Codes');
var Validation = require('../../controllers/Validation');

// var API_TOKEN_OLD = "H7H9qU3lmK1UNpqQoNxBI2PkZJec2IMAcNhByMSQ1GWhAt5tUDVtobVc1ThK";
var API_TOKEN = "EyTtWbGs9ZnUYam1xB63iXoJ4EZ4TuTKGmQaebB1tpsrxq5VcdQ3gPVgjMyz";
var baseUrl = "https://api.soccerama.pro/v1.2/";

var fireUrl = function(params, include) {
    return baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include;
};

exports.populateCompetitionsAndSeasons = function(req, res) {

    params = 'competitions';
    include = 'currentSeason';

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
                        newCompetiton.active = competiton.active;
                        newCompetiton.currentSeason = competiton.currentSeason.id;
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
                                    newSeason.seasonId = competiton.currentSeason.id;
                                    newSeason.competitionId = competiton.id;
                                    newSeason.name = competiton.currentSeason.name;
                                    newSeason.active = competiton.currentSeason.active;
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


	Season.find({}, function(seasErr, seas) {

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
	        seas.forEach(function(season, index) {
	        	console.log('season id ' + season.seasonId)
	            params = 'seasons/' + season.seasonId;
	            include = 'fixtures';

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

	                    data = data.fixtures.data;
	                    if(data.length > 0){
	                    	console.log(data.length + ' matches' )
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
	                                newMatch.team1Id = fixture.home_team_id;
	                                newMatch.team2Id = fixture.away_team_id;
	                                newMatch.status = fixture.status;
	                                newMatch.team1Score = fixture.home_score;
	                                newMatch.team2Score = fixture.away_score;
	                                newMatch.team1Penalties = fixture.home_score_penalties;
	                                newMatch.team2Penalties = fixture.away_score_penalties;
	                                if (fixture.date_time_tba == 1 || fixture.date_time_tba == true) {
	                                    newMatch.dateTimeTBA = true;
	                                } else if (fixture.date_time_tba == 0 || fixture.date_time_tba == false) {
	                                    newMatch.dateTimeTBA = false;
	                                }
	                                newMatch.startingDateTime = moment.utc(fixture.starting_date + ' ' + fixture.starting_time);
	                                newMatch.minute = fixture.minute;
	                                newMatch.extraMinute = fixture.extra_time;
	                                newMatch.seasonId = fixture.season_id;
	                                newMatch.stageId = fixture.stage_id;
	                                newMatch.roundId = fixture.round_id;
	                                newMatch.venueId = fixture.venue_id;

	                                if (fixture.weather == null) {
	                                    newMatch.weather == null;
	                                } else {	                                
	                                	newMatch.weather = {};
	                                	newMatch.weather.code = fixture.weather.code;
	                                    newMatch.weather.type = fixture.weather.type;
	                                    newMatch.weather.icon = fixture.weather.icon;
	                                    newMatch.weather.temperature = fixture.weather.temperature.temp;
	                                    newMatch.weather.temperatureUnit = fixture.weather.temperature.unit;
	                                    newMatch.weather.clouds = fixture.weather.clouds;
	                                    newMatch.weather.humidity = fixture.weather.humidity;
	                                    newMatch.weather.windSpeed = fixture.weather.windSpeed;
	                                    newMatch.weather.windDegree = fixture.weather.windDegree;
	                                }

	                                newMatch.save(function(matchSaveErr, savedMatch) {          
	                                    if (matchSaveErr) {
	                                        res.status(Codes.httpStatus.BR).json({
	                                            status: Codes.status.FAILURE,
	                                            code: Codes.httpStatus.BR,
	                                            data: '',
	                                            error: Validation.validatingErrors(compSaveErr)
	                                        });
	                                        return;
	                                    }
	                                   // console.log(savedMatch + ' saved')
	                                });
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
				if(index == seas.length - 1){
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