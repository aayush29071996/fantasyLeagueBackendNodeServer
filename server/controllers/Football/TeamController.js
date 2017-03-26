/*
 * Created by harirudhra on Sat 26 Feb 2017
 */

var Team = require('../../models/Football/Master/Team')

var Codes = require('../../Codes');
var Validation = require('../Validation');

//get list of all teams as an array obj
exports.getAllTeams = function(req, res) {
	
	Team.find({}).select('teamId name active competitions').populate('competitions').exec(function(teamsErr, teams){
		if(teamsErr){
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
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: teams,
                error: ''
            });
            return;
		}
	});
}

//get team details
exports.getTeam = function(req, res){
	Team.find({teamId:req.params.teamId}).populate('players competitions','playerId name active').exec(function(teamErr, team){
		if(teamErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(team.length == 0){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.T_NO
            });
            return;
		}
		
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: team,
            error: 's'
        });
        return;
	});
}

//toggle team status
exports.toggleTeamStatus = function(req, res){
	Team.findOneAndUpdate({teamId:req.body.teamId}, {$set:{active: req.body.active}},{"new":true}).exec(function(teamErr, team){
		if(teamErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(team == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.T_NO
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: team.active,
            error: ''
        });
        return;
	});
}

//check availability for new team id
exports.getTeamIdAvailability = function(req, res){
	Team.findOne({teamId:req.body.teamId}, function(teamErr, team){
		if(teamErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(team == null){
	        res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: req.body.teamId,
	            error: ''
	    	});
			return; 
		}
		res.status(Codes.httpStatus.BR).json({
            status: Codes.status.FAILURE,
            code: Codes.httpStatus.BR,
            data: '',
            error: Codes.errorMsg.T_ID_INUSE
        });
        return;
	});
}


//create new team
exports.createTeam = function(req, res){
	Team.findOne({teamId:req.body.teamId}, function(teamErr, team){
		if(teamErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(team == null){
			
			var newTeam = new Team();
			newTeam.teamId = req.body.teamId;
			newTeam.name = req.body.name;
			newTeam.logo = req.body.logo;
			newTeam.players = [];
			newTeam.save(function(teamSaveErr, savedTeam){
            	if (teamSaveErr) {
                    res.status(Codes.httpStatus.BR).json({
                        status: Codes.status.FAILURE,
                        code: Codes.httpStatus.BR,
                        data: '',
                        error: Validation.validatingErrors(teamSaveErr)
                    });
                    return;
                } 
                if(savedTeam){
                	res.status(Codes.httpStatus.OK).json({
		            status: Codes.status.SUCCESS,
		            code: Codes.httpStatus.OK,
		            data: savedTeam,
		            error: ''
	        	});
	    		return;
                }
            });
		}
		if(team){
			res.status(Codes.httpStatus.BR).json({
					status: Codes.status.FAILURE,
					code: Codes.httpStatus.BR,
					data: '',
					error: Codes.errorMsg.T_ID_INUSE
				});
			return;
		}
	});
}


//update team details
exports.updateTeam = function(req, res){
	Team.findOneAndUpdate({teamId:req.body.teamId}, {$set:{active: req.body.active, name:req.body.name}},{"new":true}).populate('players','playerId name active').exec(function(teamErr, team){
		if(teamErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(team == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.T_NO
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: team,
            error: ''
        });
        return;
	});
}

//delete existing team
exports.deleteTeam = function(req, res){
	Team.findOneAndRemove({teamId:req.params.teamId}, function(teamErr, team){
		if(teamErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(team == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.T_NO
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: team,
            error: ''
        });
	});
}

//remove player reference from team
exports.removePlayerFromTeam = function(req, res){
	Team.findOneAndUpdate({teamId:req.body.teamId},{$pull:{"players":req.body.players}}).exec(function(teamErr, team){
		console.log(teamErr)
		console.log(team)
		if(teamErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(team == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.T_NO
            });
            return;
		}
		Team.findOne({teamId:req.body.teamId}, function(teamErr, team){
			if(teamErr){
				res.status(Codes.httpStatus.ISE).json({
		            status: Codes.status.FAILURE,
		            code: Codes.httpStatus.ISE,
		            data: '',
		            error: Codes.errorMsg.UNEXP_ERROR
		        });
		        return;
			}
			if(team == null){
				res.status(Codes.httpStatus.BR).json({
	                status: Codes.status.FAILURE,
	                code: Codes.httpStatus.BR,
	                data: '',
	                error: Codes.errorMsg.T_NO
	            });
	    	}
	    	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: team,
	            error: ''
	   	    });
		});
	});
}
