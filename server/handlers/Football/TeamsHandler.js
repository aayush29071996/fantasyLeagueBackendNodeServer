/*
* Created by harirudhra on Fri 17 Feb 2017
*/

var request = require('request');
var _ = require('underscore');

var Team = require('../../models/Football/Master/Team');
var Season = require('../../models/Football/Season');
var Competition = require('../../models/Football/Competition');

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


exports.populateTeamsForAllSeasons = function(req, res){

	Season.find({}).populate('competition').exec(function(seasErr, seasons){

		if(seasErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(seasons.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.S_NO
            });
            return;
		}
		//console.log(seasons)

		if(seasons.length > 0){
			seasons.forEach(function(season, sIrndex){

				include = ''
				params = 'teams/season/' + season.seasonId;
				
				request.get(fireUrl(params, include), function(err, response, data){

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

			           	data.forEach(function(team, tIndex){

			           		Team.findOne({ teamId: team.id }, function(teamErr, teamObj) {
			                    if (teamErr) {
			                        res.status(Codes.httpStatus.ISE).json({
			                            status: Codes.status.FAILURE,
			                            code: Codes.httpStatus.ISE,
			                            data: '',
			                            error: Codes.errorMsg.UNEXP_ERROR
			                        });
			                        return;
			                    }

			                    if (teamObj != null) {

			                    	if(teamObj.competitions.length > 0){
			                    		console.log('adding new competition to team refernce');
			                    		
		                      				console.log('existing:' + teamObj.competitions);
		                      				console.log('season:' + season.competition._id);
		                      				console.log('Index Of: ' + teamObj.competitions.indexOf(season.competition._id));

		                      				if(teamObj.competitions.indexOf(season.competition._id) == -1){
		                      					console.log('new competition');
		                      					teamObj.competitions.push(season.competition._id);
		                      					teamObj.save(function(teamSaveErr, savedTeam){
					                        	if (teamSaveErr) {
					                                console.log('teamSaveErr1')
						                                res.status(Codes.httpStatus.BR).json({
						                                    status: Codes.status.FAILURE,
						                                    code: Codes.httpStatus.BR,
						                                    data: '',
						                                    error: Validation.validatingErrors(teamSaveErr)
						                                });
					                                return;
					                            	}
					                        	});
		                      				}

			                    	}

			                        console.log('team with id ' + teamObj.teamId + ' and name ' + teamObj.name + ' already exists')
			                        return false;
			                    }

			                    if (teamObj == null) {

			                        console.log('adding new team ' + team.name + ' of competition ' + season.competition.name + ' :: with index ' + tIndex);
			                        var newTeam = new Team();
			                        newTeam.teamId = team.id;
			                        newTeam.name = team.name;
			                        newTeam.logo = team.logo_path;
			                        newTeam.players = [];
			                        newTeam.competitions = [];
			                        newTeam.competitions.push(season.competition);
			                        newTeam.save(function(teamSaveErr, savedTeam){
			                        	if (teamSaveErr) {
			                        		console.log(newTeam.teamId)
			                                console.log('teamSaveErr')
			                                res.status(Codes.httpStatus.BR).json({
			                                    status: Codes.status.FAILURE,
			                                    code: Codes.httpStatus.BR,
			                                    data: '',
			                                    error: Validation.validatingErrors(teamSaveErr)
			                                });
			                                return;
			                            }
			                        });
			                    }
			                });

			           	});
			        }
				});

				if(sIndex == seasons.length - 1){
                	res.status(Codes.httpStatus.OK).json({
		                status: Codes.status.SUCCESS,
		                code: Codes.httpStatus.OK,
		                data: 'populated all teams for all seasons',
		                error: ''
		            });
		            return;
                }
			});
		}

	});

}	


exports.populateTeamsForSeason = function(req, res){

	Season.findOne({seasonId:req.params.seasonId}).populate('competition').exec(function(seasErr, season){

		if(seasErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(season == null){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.S_NO
            });
            return;
		}
		//console.log(seasons)
		var teamLength = 100;

		include = ''
		params = 'teams/season/' + season.seasonId;
		
		request.get(fireUrl(params, include), function(err, response, data){

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
	            teamLength = data.length;

	           	data.forEach(function(team, tIndex){

	           		Team.findOne({ teamId: team.id }, function(teamErr, teamObj) {
	                    if (teamErr) {
	                        res.status(Codes.httpStatus.ISE).json({
	                            status: Codes.status.FAILURE,
	                            code: Codes.httpStatus.ISE,
	                            data: '',
	                            error: Codes.errorMsg.UNEXP_ERROR
	                        });
	                        return;
	                    }

	                    if (teamObj != null) {

	                    	if(teamObj.competitions.length > 0){
	                    		console.log('adding new competition to team refernce');
	                    		
                      				console.log('existing:' + teamObj.competitions);
                      				console.log('season:' + season.competition._id);
                      				console.log('Index Of: ' + teamObj.competitions.indexOf(season.competition._id));

                      				if(teamObj.competitions.indexOf(season.competition._id) == -1){
                      					console.log('new competition');
                      					teamObj.competitions.push(season.competition._id);
                      					teamObj.save(function(teamSaveErr, savedTeam){
			                        	if (teamSaveErr) {
			                                console.log('teamSaveErr1')
				                                res.status(Codes.httpStatus.BR).json({
				                                    status: Codes.status.FAILURE,
				                                    code: Codes.httpStatus.BR,
				                                    data: '',
				                                    error: Validation.validatingErrors(teamSaveErr)
				                                });
			                                return;
			                            	}
			                        	});
                      				}

	                    	}

	                        console.log('team with id ' + teamObj.teamId + ' and name ' + teamObj.name + ' already exists')
	                        return false;
	                    }

	                    if (teamObj == null) {

	                        console.log('adding new team ' + team.name + ' of competition ' + season.competition.name + ' :: with index ' + tIndex);
	                        var newTeam = new Team();
	                        newTeam.teamId = team.id;
	                        newTeam.name = team.name;
	                        newTeam.logo = team.logo_path;
	                        newTeam.players = [];
	                        newTeam.competitions = [];
	                        newTeam.competitions.push(season.competition);
	                        newTeam.save(function(teamSaveErr, savedTeam){
	                        	if (teamSaveErr) {
	                        		console.log(newTeam.teamId)
	                                console.log('teamSaveErr')
	                                res.status(Codes.httpStatus.BR).json({
	                                    status: Codes.status.FAILURE,
	                                    code: Codes.httpStatus.BR,
	                                    data: '',
	                                    error: Validation.validatingErrors(teamSaveErr)
	                                });
	                                return;
	                            }
	                        });
	                    }

	                    if(tIndex == teamLength - 1){
				        	res.status(Codes.httpStatus.OK).json({
				                status: Codes.status.SUCCESS,
				                code: Codes.httpStatus.OK,
				                data: 'populated all teams for season ' + season.competition.name + ' :: ' + season.name + ' of id ' + season.seasonId,
				                error: ''
				            });
				            return;
				        }
	                });

	           	});
	        }
		});
	});

}	



exports.mergeTeamDuplicates = function(req, res){
	var count = 0;
	Team.find({}, function(allTeamsErr, allTeams){
		console.log('Total No of Teams ' + allTeams.length);
		allTeams.forEach(function(team, index){
			Team.find({teamId:team.teamId}, function(teamsErr, teams){
				if(teams.length > 1){
					console.log(teams[0].name);
					console.log(teams[0].players.length);
					console.log(teams[1].players.length);
					var selectedTeam1 = 0;
					if(teams[0].players.length < teams[1].players.length){
						selectedTeam1 = 1;
					}
					var selectedTeam2 = (selectedTeam1 == 1) ? 0 : 1;

					Team.findOne({_id:teams[selectedTeam1]._id}).exec(function(firstTeamErr, firstTeam){
						
						Team.findOne({_id:teams[selectedTeam2]._id}).exec(function(secondTeamErr, secondTeam){
							count = count + 1;
							console.log(firstTeam.name + ' :: firstTeam intial competitions :: ' + firstTeam.competitions);
							secondTeam.competitions.forEach(function(competition, index){
								if(firstTeam.competitions.indexOf(competition) == -1){
									console.log('***********************************************');
									firstTeam.competitions.push(competition);
									if(index == secondTeam.competitions.length - 1){
										console.log(firstTeam.name + ' :: firstTeam final competitions :: ' + firstTeam.competitions);
										firstTeam.save(function(teamSaveErr, savedTeam){
				                        	if (teamSaveErr) {
				                                console.log('teamSaveErr')
				                                res.status(Codes.httpStatus.BR).json({
				                                    status: Codes.status.FAILURE,
				                                    code: Codes.httpStatus.BR,
				                                    data: '',
				                                    error: Validation.validatingErrors(teamSaveErr)
				                                });
				                                return;
				                            }
				                            if(savedTeam){
				                            	Team.findOneAndRemove({_id:secondTeam._id}, function(teamRemoveErr, removedTeam){
				                            		console.log(removedTeam);
				                            	});	
				                            }
				                        });	
									}
								}
								
							});
						});
					});
				}
			});

		});

	});
}




