/*
 * Created by harirudhra on Sun 29 Jan 2017
 */

var request = require('request');
var moment = require('moment');
var _ = require('underscore');

var Competition = require('../../models/Football/Competition');
var Season = require('../../models/Football/Season');
var Match = require('../../models/Football/Match');
var Team = require('../../models/Football/Master/Team');
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


				//USED ONLY TO SEED EPL SEASON

				if (competiton.id == '8'|| competiton.id =='1007'){
					Competition.findOne({competitionId: competiton.id}, function (compErr, comp) {
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
							newCompetiton.save(function (compSaveErr, savedComp) {
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
								Season.findOne({seasonId: savedComp.currentSeason}, function (seasErr, seas) {
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

										newSeason.save(function (seasSaveErr, savedSeas) {
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

				if (index == data.length - 1) {
					res.status(Codes.httpStatus.OK).json({
						status: Codes.status.SUCCESS,
						code: Codes.httpStatus.OK,
						data: data,
						error: 'populated seaons for all competetitions'
					});
					return;
				}
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
	                	console.log(err);
	                	res.status(Codes.httpStatus.ISE).json({
	                        status: Codes.status.FAILURE,
	                        code: Codes.httpStatus.ISE,
	                        data: '',
	                        error: Codes.errorMsg.UNEXP_ERROR
	                    });
	                    return;
	                }

	                if (response.statusCode == Codes.httpStatus.NF) {
	                	console.log('ERROR NF API');
	                    res.status(Codes.httpStatus.BR).json({
	                        status: Codes.status.FAILURE,
	                        code: Codes.httpStatus.BR,
	                        data: '',
	                        error: Codes.errorMsg.INVALID_REQ
	                    });
	                    return;

	                }
	                if (response.statusCode == Codes.httpStatus.UNAUTH) {
	                	console.log('ERROR UNAUTH API');
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
	                        	console.log('ERROR INVALID_REQ API')
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
	                    console.log(Object.keys(data));
	                    data = data.data.fixtures.data;
	                    console.log(data.length + ' matches for the competition ' + season.competition.name + ' of season ' + season.name  + ' with index ' + sIndex);  
	                    if(data.length > 0){
	                    	// console.log(data.length + ' matches for the competition ' + season.competition.name + ' of season ' + season.name  + ' with index ' + sIndex);
    		                data.forEach(function(fixture, index) {
    		                console.log('match index ' + index + ' <--> ' + ' Id ' + fixture.id);		           
	                        
	                        Match.findOne({ matchId: fixture.id }, function(matchErr, match) {
	                            if (matchErr) {
	                            	console.log(matchErr);
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
	                            	// Team.find({}).populate('players')exec(function(teamsErr, teams){

	                            	// });


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

                                                    	if(fixture.lineup.data.length > 0){

						                                	console.log('LINEUP AVAILABLE');

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
									                                	console.log(matchSaveErr);
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
									                                	console.log(matchSaveErr);
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

												        	});

												        }
                                                    }
                                                    return;
                                                }
                                            });
                                        });


	                                } else {

	                                	if(fixture.lineup.data.length > 0){

		                                	console.log('LINEUP AVAILABLE');

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
					                                	console.log(matchSaveErr);
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
					                                	console.log(matchSaveErr);
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

								        	});

								        }
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

exports.populateSeasonWithFixtures = function(req, res) {

	Season.findOne({seasonId:req.params.seasonId}).populate('competition').exec(function(seasonErr, season) {

	    if (seasonErr) {
	        res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
	    }
	  
	    if (season == null) {
	        console.log('invalid season id');
	        return false;
	    }
    
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
                    console.log(Object.keys(data));
                    data = data.data.fixtures.data;
                    console.log(data.length + ' matches for the competition ' + season.competition.name + ' of season ' + season.name);  
                    if(data.length > 0){
                    	// console.log(data.length + ' matches for the competition ' + season.competition.name + ' of season ' + season.name);
		                data.forEach(function(fixture, index) {
		                console.log('match id ' + fixture.id + ' of index ' + index);		           
                        
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

                                                	if(fixture.lineup.data.length > 0){

				                                	console.log('LINEUP AVAILABLE');

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

										        	});

										        }
                                                }
                                                return;
                                            }
                                        });
                                    });


                                } else {

                                		if(fixture.lineup.data.length > 0){

		                                	console.log('LINEUP AVAILABLE');

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

								        	});

								        }
                                }
                            }
                        });
							
							if(index == data.length - 1){
			        		console.log('final call');
			                res.status(Codes.httpStatus.OK).json({
			                    status: Codes.status.SUCCESS,
			                    code: Codes.httpStatus.OK,
			                    data: 'populated all fixtures for season ' + season.name + ' of id ' + season.seasonId,
			                    error: ''
			                });
			                return;
				        }

	                    });

					} else {
						console.log('no matches available for this season');
					}
                } else {
                    console.log(response.statusCode + '' + response.statusMessage);
                }
            });
	});
}

exports.populateFixture = function(req, res) {

    Match.findOne({ matchId: req.params.fixtureId }, function(matchErr, match) {
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
			 res.status(Codes.httpStatus.BR).json({
	                status: Codes.status.FAILURE,
	                code: Codes.httpStatus.BR,
	                data: '',
	                error: 'match with id ' + match.matchId + ' already exists'
	            });
	    	return;
        }

        params = 'fixtures/' + req.params.fixtureId;
        include = 'events,lineup';

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
              

        // console.log(data);
        console.log('---- DATA RECEIVED ----');
        var fixture = data.data;

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


            	console.log('EVENTS AVAILABLE');

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


                                if(fixture.lineup.data.length > 0){

                                	console.log('LINEUP AVAILABLE');

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
			                                    res.status(Codes.httpStatus.BR).json({
			                                        status: Codes.status.FAILURE,
			                                        code: Codes.httpStatus.BR,
			                                        data: '',
			                                        error: Validation.validatingErrors(matchSaveErr)
			                                    });
			                                    return;
			                                }
		                               		res.status(Codes.httpStatus.OK).json({
								                status: Codes.status.SUCCESS,
								                code: Codes.httpStatus.OK,
								                data: 'match ' + fixture.id + ' seeded', 
								                error: ''	
								       		 });
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
			                                    res.status(Codes.httpStatus.BR).json({
			                                        status: Codes.status.FAILURE,
			                                        code: Codes.httpStatus.BR,
			                                        data: '',
			                                        error: Validation.validatingErrors(matchSaveErr)
			                                    });
			                                    return;
			                                }
				                          res.status(Codes.httpStatus.OK).json({
							                status: Codes.status.SUCCESS,
							                code: Codes.httpStatus.OK,
							                data: 'match ' + fixture.id + ' seeded', 
							                error: ''	
							       		 });
		                          	  });
						        	});


						        }

                            }
                            return;
                        }
                    });
                });


	        } else {

	        	console.log('EVENTS UN-AVAILABLE');

	        	if(fixture.lineup.data.length > 0){

	        		console.log('LINEUP AVAILABLE');

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
					                res.status(Codes.httpStatus.BR).json({
					                    status: Codes.status.FAILURE,
					                    code: Codes.httpStatus.BR,
					                    data: '',
					                    error: Validation.validatingErrors(matchSaveErr)
					                });
					                return;
					            }
					               res.status(Codes.httpStatus.OK).json({
					                status: Codes.status.SUCCESS,
					                code: Codes.httpStatus.OK,
					                data: 'match ' + fixture.id + ' seeded', 
					                error: ''	
					       		 });
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
			        		console.log('inside save')  
				            if (matchSaveErr) {
				                res.status(Codes.httpStatus.BR).json({
				                    status: Codes.status.FAILURE,
				                    code: Codes.httpStatus.BR,
				                    data: '',
				                    error: Validation.validatingErrors(matchSaveErr)
				                });
				                return;
				            }
				               res.status(Codes.httpStatus.OK).json({
				                status: Codes.status.SUCCESS,
				                code: Codes.httpStatus.OK,
				                data: 'match ' + fixture.id + ' seeded', 
				                error: ''	
				       		 });
				        });
			        	});


			        }

		        }
		    }
		}
	});
	});
}

