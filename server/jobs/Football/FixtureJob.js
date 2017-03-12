/*
 * Created by harirudhra on Sat 11 March 2017
 */

var moment = require('moment');
var request = require('request');
var CronJob = require('cron').CronJob;

var Match = require('../../models/Football/Match');
var Event = require('../../models/Football/Event');

var Codes = require('../../Codes');
var Validation = require('../../controllers/Validation');

var API_TOKEN = "H7H9qU3lmK1UNpqQoNxBI2PkZJec2IMAcNhByMSQ1GWhAt5tUDVtobVc1ThK";
var baseUrl = "https://api.soccerama.pro/v1.2/";

var fireUrl = function(params, include) {
    return baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include;
};

var responseToConsole = function(_status, _code, _data, _error){

	var responseJSON = {
		status : _status,
		code : _code,
		data : _data,
		error : _error
	}
	return responseJSON;
}

//update fixtures every 15 minutes
exports.updateFixturesJob = function(){
	console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
	console.log('updateFixturesJob inside')
	var fixtureAvailCheckJob = new CronJob({

		cronTime : '*/15 * * * * *', 
		onTick : function(){
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
		            if(data.length == 0){
		            	console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, data, 'JOB : Checking for Fixture Updates : No Live Fixtures'));
		            } else {
		            	// fixtureAvailCheckJob.stop();
		            	data.forEach(function(fixture, index){

		            		params = 'livescore/match/' + fixture.id
		            		include = 'lineup,events'
		            		
		            		request.get(fireUrl(params, include), function(err, response, data){
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

							          	Match.findOne({matchId:updatedMatch.id}).populate('events').exec(function(matchErr, match){
							          		if(matchErr){
										        console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
							                    return;
											}

											if(match == null){
									            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, '', Codes.errorMsg.F_INV_MID));
									            return;
											}

											if(match.matchId == updatedMatch.id){
												
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
	                                			if(updatedMatch.events.data.length > 0){

													match.events.forEach(function(existingEvent, eIndex){
											
														updatedMatch.events.data.forEach(function(event, index){
															if(existingEvent.eventId != event.id){

				                                					var newEvent = new Event();
					                                				newEvent.eventId = event.id;
					                                				newEvent.matchId = event.match_id;
					                                				newEvent.teamId = event.team_id;
					                                				newEvent.minute = event.minute;
					                                				newEvent.extraMinute = event.extra_min;
					                                				newEvent.type = event.type;
				                                					if(event.hasOwnProperty("player_id")){
				                                						newEvent.playerId = event.player_id;
				                                					}	                                					
				                                					if(event.hasOwnProperty("assist_id")){
				                                						newEvent.assistPlayerId = event.assist_id;
				                                					}
				                                					if(event.hasOwnProperty("related_event_id")){
				                                						newEvent.relatedEventId = event.related_event_id;
				                                					}
				                                					if(event.hasOwnProperty("player_in_id")){
				                                						newEvent.playerInId = event.player_in_id;
				                                					}
				                                					if(event.hasOwnProperty("player_out_id")){
				                                						newEvent.playerOutId = event.player_out_id;
				                                					}
			                                					} else {
			                                						console.log('Event ' + event.id + ' already recorded');
			                                					}			
			                                				});
														
														});	                                				
	                                				} else {
	                                				match.events = null;
	                                			}

	                                			if (updatedMatch.lineup.data.length > 0){

	                                				match.lineup.forEach(function(playerLP, pIndex){

	                                					updatedMatch.lineup.data.forEach(function(lineup, index){

	                                						if(playerLP.playerId == lineup.player_id){

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

	                                						} else {

	                                							

	                                						}

	                                					})
	                                				})
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
											}
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
			start:true
		});
	fixtureAvailCheckJob.start();

}