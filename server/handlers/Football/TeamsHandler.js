/*
* Created by harirudhra on Fri 17 Feb 2017
*/

var request = require('request');

var Team = require('../../models/Football/Master/Team');
var Season = require('../../models/Football/Season');


var Codes = require('../../Codes');
var Validation = require('../../controllers/Validation');

var API_TOKEN = "H7H9qU3lmK1UNpqQoNxBI2PkZJec2IMAcNhByMSQ1GWhAt5tUDVtobVc1ThK";
var baseUrl = "https://api.soccerama.pro/v1.2/";

var fireUrl = function(params, include) {
    return baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include;
};


exports.populateTeamsForAllSeasons = function(req, res){

	Season.find({}, function(seasErr, seasons){

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

		if(seasons.length > 0){
			seasons.forEach(function(season, index){

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

			           	data.forEach(function(team, index){

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
			                        console.log('team with id ' + teamObj.teamId + ' and name ' + teamObj.name + ' already exists')
			                        return false;
			                    }

			                    if (teamObj == null) {
			                        console.log('adding new team')
			                        var newTeam = new Team();
			                        newTeam.teamId = team.id;
			                        newTeam.name = team.name;
			                        newTeam.logo = team.logo;
			                        newTeam.players = [];
			                        newTeam.save(function(teamSaveErr, savedTeam){
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
			                    }
			                });

			           	});
			        }
				});

				if(index == seasons.length - 1){
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