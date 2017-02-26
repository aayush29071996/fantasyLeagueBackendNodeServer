/*
* Created by harirudhra on Fri 17 Feb 2017
*/

var request = require('request');

var Team = require('../../models/Football/Master/Team');
var Player = require('../../models/Football/Master/Player');


var Codes = require('../../Codes');
var Validation = require('../../controllers/Validation');

var API_TOKEN = "H7H9qU3lmK1UNpqQoNxBI2PkZJec2IMAcNhByMSQ1GWhAt5tUDVtobVc1ThK";
var baseUrl = "https://api.soccerama.pro/v1.2/";

var fireUrl = function(params, include) {
    return baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include;
};


exports.populatePlayersForAllTeams = function(req, res){

	Team.find({}, function(teamErr, teams){

		if(teamErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(teams.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.T_NO
            });
            return;
		}

		if(teams.length > 0){
			teams.forEach(function(team, index){

				include = 'position'
				params = 'players/team/' + team.teamId;
				
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

			           	data.forEach(function(player, index){

			           		Player.findOne({ playerId: player.id }, function(playerErr, playerObj) {
			                    if (playerErr) {
			                        res.status(Codes.httpStatus.ISE).json({
			                            status: Codes.status.FAILURE,
			                            code: Codes.httpStatus.ISE,
			                            data: '',
			                            error: Codes.errorMsg.UNEXP_ERROR
			                        });
			                        return;
			                    }

			                    if (playerObj != null) {
			                        console.log('player with id ' + playerObj.playerId + ' and name ' + playerObj.name + ' already exists')
			                      

			                        return false;
			                    }

			                    if (playerObj == null) {
			                        console.log('adding new player')
			                        var newPlayer = new Player();
			                        newPlayer.playerId = player.id;
			                        newPlayer.name = player.name;

			                    	if(player.hasOwnProperty('position')){		                        
				                        newPlayer.positionId = player.position.id;
				                        newPlayer.position = player.position.name;
									}
			                        newPlayer.save(function(playerSaveErr, savedPlayer){
			                        	if (playerSaveErr) {
			                                console.log('playerSaveErr')
			                                res.status(Codes.httpStatus.BR).json({
			                                    status: Codes.status.FAILURE,
			                                    code: Codes.httpStatus.BR,
			                                    data: '',
			                                    error: Validation.validatingErrors(playerSaveErr)
			                                });
			                                return;
			                            }

			                          	Team.findOne({teamId:team.teamId}, function(teamErr, team){
			                          		if (teamErr) {
			                                console.log('teamErr')
			                                res.status(Codes.httpStatus.BR).json({
			                                    status: Codes.status.FAILURE,
			                                    code: Codes.httpStatus.BR,
			                                    data: '',
			                                    error: Validation.validatingErrors(teamErr)
			                                });
			                                return;
		                            	}

		                            	team.players.push(savedPlayer);
		                            	team.save(function(teamSaveErr, savedTeam){
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
		                            	});

			                          	});
			                        });
			                    }
			                });

			           	});
			        }
				});

				if(index == teams.length - 1){
                	res.status(Codes.httpStatus.OK).json({
		                status: Codes.status.SUCCESS,
		                code: Codes.httpStatus.OK,
		                data: 'populated all players for all teams',
		                error: ''
		            });
		            return;
                }
			});
		}

	});

}	