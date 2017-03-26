/*
 * Created by harirudhra on Sat 26 Feb 2017
 */

var Team = require('../../models/Football/Master/Team')
var Player = require('../../models/Football/Master/Player')

var Codes = require('../../Codes');
var Validation = require('../Validation');

//get list of all players as an array obj
exports.getAllPlayers = function(req, res) {
	
	Player.find({}).select('playerId name active').exec(function(playersErr, players){
		if(playersErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}

		console.log(players.length + ' players');

		if(players.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.P_NO
            });
            return;
		}

		if(players.length > 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: players,
                error: ''
            });
            return;
		}
	});
}

//get player details
exports.getPlayer = function(req, res){
	Player.find({playerId:req.params.playerId},function(playerErr, player){
		if(playerErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(player.length == 0){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.P_NO
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: player,
            error: ''
        });
        return;
	});
}

//toggle player status
exports.togglePlayerStatus = function(req, res){
	Player.findOneAndUpdate({playerId:req.body.playerId}, {$set:{active:req.body.active}},{"new":true}).exec(function(playerErr, player){
		if(playerErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(player == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.P_NO
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: player.active,
            error: ''
        });
        return;
	});
	
}

//check availability for new player id
exports.getPlayerIdAvailability = function(req, res){
	Player.findOne({playerId:req.body.playerId}, function(playerErr, player){
		if(playerErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(player == null){
	        res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: req.body.playerId,
	            error: ''
	    	});
			return; 
		}
		res.status(Codes.httpStatus.BR).json({
            status: Codes.status.FAILURE,
            code: Codes.httpStatus.BR,
            data: '',
            error: Codes.errorMsg.P_ID_INUSE
        });
        return;
	});
}


//create new player
exports.createPlayer = function(req, res){
	Player.findOne({playerId:req.body.playerId}, function(playerErr, player){
		if(playerErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(player == null){
			
			var newPlayer = new Player();
            newPlayer.playerId = req.body.playerId;
            newPlayer.name = req.body.name;                  
            newPlayer.positionId = req.body.positionId;
            newPlayer.position = req.body.position;
			newPlayer.save(function(playerSaveErr, savedPlayer){
            	if (playerSaveErr) {
                    res.status(Codes.httpStatus.BR).json({
                        status: Codes.status.FAILURE,
                        code: Codes.httpStatus.BR,
                        data: '',
                        error: Validation.validatingErrors(playerSaveErr)
                    });
                    return;
                } 
                if(savedPlayer){
                	res.status(Codes.httpStatus.OK).json({
		            status: Codes.status.SUCCESS,
		            code: Codes.httpStatus.OK,
		            data: savedPlayer,
		            error: ''
	        	});
	    		return;
                }
            });
		}
		if(player){
			res.status(Codes.httpStatus.BR).json({
					status: Codes.status.FAILURE,
					code: Codes.httpStatus.BR,
					data: '',
					error: Codes.errorMsg.P_ID_INUSE
				});
			return;
		}
	});
}


//update player details
exports.updatePlayer = function(req, res){
	Player.findOneAndUpdate({playerId:req.body.playerId}, {$set:{active:req.body.active, name:req.body.name, positionId:req.body.positionId, position: req.body.position}},{"new":true}).exec(function(playerErr, player){
		if(playerErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(player == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.P_NO
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: player,
            error: ''
        });
        return;
	});
}

//delete existing player
exports.deletePlayer = function(req, res){
	Player.findOneAndRemove({playerId:req.params.playerId}, function(playerErr, player){
		if(playerErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(player == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.P_NO
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: player,
            error: ''
        });
	});
}
