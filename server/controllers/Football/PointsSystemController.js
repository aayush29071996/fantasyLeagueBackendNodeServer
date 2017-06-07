/*
 * Created by harirudhra on Sun 12 March 2017
 */

 var User = require('../../models/User');
 var Match = require('../../models/Football/Match');
 var MatchCard = require('../../models/Football/MatchCard');
 var PointSystem = require('../../models/Football/Master/PointSystem');
 var Player = require('../../models/Football/Master/Player');	
 var moment = require('moment');
 var _ = require('underscore');

 var Codes = require('../../Codes');
 var Validation = require('../Validation');



exports.createPointSystem = function(req, res) {

	var data = req.body;
	var newPointSystem = new PointSystem(); 
	newPointSystem.name = data.name;
	
	var defense = {};
	defense.goal = data.defense.goal;
	defense.goalByAssist = data.defense.goalByAssist;
	defense.goalByPenalty = data.defense.goalByPenalty;
	defense.goalByPenaltyMissed = data.defense.goalByPenaltyMissed;
	defense.goalOwn = data.defense.goalOwn;
	defense.cardYellow = data.defense.cardYellow;
	defense.cardYellowRed = data.defense.cardYellowRed;
	defense.cardRed = data.defense.cardRed;
	defense.cleanSheet = data.defense.cleanSheet;
	newPointSystem.defense = defense;

	var forward = {};
	forward.goal = data.forward.goal;
	forward.goalByAssist = data.forward.goalByAssist;
	forward.goalByPenalty = data.forward.goalByPenalty;
	forward.goalByPenaltyMissed = data.forward.goalByPenaltyMissed;
	forward.goalOwn = data.forward.goalOwn;
	forward.cardYellow = data.forward.cardYellow;
	forward.cardYellowRed = data.forward.cardYellowRed;
	forward.cardRed = data.forward.cardRed;
	forward.cleanSheet = data.forward.cleanSheet;
	newPointSystem.forward = forward;

	var midfield = {};
	midfield.goal = data.midfield.goal;
	midfield.goalByAssist = data.midfield.goalByAssist;
	midfield.goalByPenalty = data.midfield.goalByPenalty;
	midfield.goalByPenaltyMissed = data.midfield.goalByPenaltyMissed;
	midfield.goalOwn = data.midfield.goalOwn;
	midfield.cardYellow = data.midfield.cardYellow;
	midfield.cardYellowRed = data.midfield.cardYellowRed;
	midfield.cardRed = data.midfield.cardRed;
	midfield.cleanSheet = data.midfield.cleanSheet;
	newPointSystem.midfield = midfield;

	var goalkeeper = {};
	goalkeeper.goal = data.goalkeeper.goal;
	goalkeeper.goalByAssist = data.goalkeeper.goalByAssist;
	goalkeeper.goalByPenalty = data.goalkeeper.goalByPenalty;
	goalkeeper.goalByPenaltyMissed = data.goalkeeper.goalByPenaltyMissed;
	goalkeeper.goalOwn = data.goalkeeper.goalOwn;
	goalkeeper.cardYellow = data.goalkeeper.cardYellow;
	goalkeeper.cardYellowRed = data.goalkeeper.cardYellowRed;
	goalkeeper.cardRed = data.goalkeeper.cardRed;
	goalkeeper.cleanSheet = data.goalkeeper.cleanSheet;
	newPointSystem.goalkeeper = goalkeeper;

	newPointSystem.save(function(newPointSystemSaveErr, savedNewPointSystem){
		if (newPointSystemSaveErr) {
		    res.status(Codes.httpStatus.BR).json({
		        status: Codes.status.FAILURE,
		        code: Codes.httpStatus.BR,
		        data: '',
		        error: Validation.validatingErrors(newPointSystemSaveErr)
		    });
		    return;
		} 
		if(savedNewPointSystem){
			res.status(Codes.httpStatus.OK).json({
		        status: Codes.status.SUCCESS,
		        code: Codes.httpStatus.OK,
		        data: savedNewPointSystem._id,
		        error: ''
			});
			return;
			}
		});

}


exports.updatePointSystem = function(req, res){

	var data = req.body;

	PointSystem.findOne({_id:data._id}, function(pointSystemErr,pointSystem){

		if(pointSystemErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}

		if(pointSystem == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.PS_INV_ID
	        });
	        return;
		}


		pointSystem.name = data.name;
	
		pointSystem.defense.goal = data.defense.goal;
		pointSystem.defense.goalByAssist = data.defense.goalByAssist;
		pointSystem.defense.goalByPenalty = data.defense.goalByPenalty;
		pointSystem.defense.goalByPenaltyMissed = data.defense.goalByPenaltyMissed;
		pointSystem.defense.goalOwn = data.defense.goalOwn;
		pointSystem.defense.cardYellow = data.defense.cardYellow;
		pointSystem.defense.cardYellowRed = data.defense.cardYellowRed;
		pointSystem.defense.cardRed = data.defense.cardRed;
		pointSystem.defense.cleanSheet = data.defense.cleanSheet;
		
		pointSystem.forward.goal = data.forward.goal;
		pointSystem.forward.goalByAssist = data.forward.goalByAssist;
		pointSystem.forward.goalByPenalty = data.forward.goalByPenalty;
		pointSystem.forward.goalByPenaltyMissed = data.forward.goalByPenaltyMissed;
		pointSystem.forward.goalOwn = data.forward.goalOwn;
		pointSystem.forward.cardYellow = data.forward.cardYellow;
		pointSystem.forward.cardYellowRed = data.forward.cardYellowRed;
		pointSystem.forward.cardRed = data.forward.cardRed;
		pointSystem.forward.cleanSheet = data.forward.cleanSheet;

		pointSystem.midfield.goal = data.midfield.goal;
		pointSystem.midfield.goalByAssist = data.midfield.goalByAssist;
		pointSystem.midfield.goalByPenalty = data.midfield.goalByPenalty;
		pointSystem.midfield.goalByPenaltyMissed = data.midfield.goalByPenaltyMissed;
		pointSystem.midfield.goalOwn = data.midfield.goalOwn;
		pointSystem.midfield.cardYellow = data.midfield.cardYellow;
		pointSystem.midfield.cardYellowRed = data.midfield.cardYellowRed;
		pointSystem.midfield.cardRed = data.midfield.cardRed;
		pointSystem.midfield.cleanSheet = data.midfield.cleanSheet;
		
		pointSystem.goalkeeper.goal = data.goalkeeper.goal;
		pointSystem.goalkeeper.goalByAssist = data.goalkeeper.goalByAssist;
		pointSystem.goalkeeper.goalByPenalty = data.goalkeeper.goalByPenalty;
		pointSystem.goalkeeper.goalByPenaltyMissed = data.goalkeeper.goalByPenaltyMissed;
		pointSystem.goalkeeper.goalOwn = data.goalkeeper.goalOwn;
		pointSystem.goalkeeper.cardYellow = data.goalkeeper.cardYellow;
		pointSystem.goalkeeper.cardYellowRed = data.goalkeeper.cardYellowRed;
		pointSystem.goalkeeper.cardRed = data.goalkeeper.cardRed;
		pointSystem.goalkeeper.cleanSheet = data.goalkeeper.cleanSheet;

		pointSystem.save(function(pointSystemSaveErr, savedPointSystem){
			if (pointSystemSaveErr) {
			    res.status(Codes.httpStatus.BR).json({
			        status: Codes.status.FAILURE,
			        code: Codes.httpStatus.BR,
			        data: '',
			        error: Validation.validatingErrors(pointSystemSaveErr)
			    });
			    return;
			} 
			if(savedPointSystem){
				res.status(Codes.httpStatus.OK).json({
			        status: Codes.status.SUCCESS,
			        code: Codes.httpStatus.OK,
			        data: savedPointSystem._id,
			        error: ''
				});
				return;
				}
			});



	});

}

exports.activatePointSystem = function(req, res) {

	PointSystem.find({}, function(pointSystemsErr,pointSystems){

		if(pointSystemsErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}

		if(pointSystems.length == 0){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.PS_INV_ID
	        });
	        return;
		}

		pointSystems.forEach(function(pointSystem, index){

			if(pointSystem._id === req.body._id){
				pointSystem.currentlyActive = true;
			} else {
				pointSystem.currentlyActive = false;
			}

			pointSystem.save(function(pointSystemSaveErr, savedPointSystem){
			if (pointSystemSaveErr) {
			    res.status(Codes.httpStatus.BR).json({
			        status: Codes.status.FAILURE,
			        code: Codes.httpStatus.BR,
			        data: '',
			        error: Validation.validatingErrors(pointSystemSaveErr)
			    });
			    return;
			} 
			if(index == pointSystems.length - 1){
				res.status(Codes.httpStatus.OK).json({
			        status: Codes.status.SUCCESS,
			        code: Codes.httpStatus.OK,
			        data: '',
			        error: ''
				});
				return;
				}
			});

		});
	});

}



exports.createMatchCard = function(req, res) {

	User.findOne({username:req.body.username}, function(userErr, user){

		if(userErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}



		Match.findOne({matchId:req.body.matchId}, function(matchErr, match){
			if(matchErr){
				res.status(Codes.httpStatus.ISE).json({
		            status: Codes.status.FAILURE,
		            code: Codes.httpStatus.ISE,
		            data: '',
		            error: Codes.errorMsg.UNEXP_ERROR
		        });
	        	return;
			}


			if(match == null){
				res.status(Codes.httpStatus.OK).json({
		            status: Codes.status.SUCCESS,
		            code: Codes.httpStatus.OK,
		            data: '',
		            error: Codes.errorMsg.F_INV_MID
		        });
		        return;
			}		
			var players = []
			req.body.players.forEach(function(playerId, index){
				Player.findOne({playerId:playerId}, function(playerErr, player){
					if(matchErr){
						res.status(Codes.httpStatus.ISE).json({
				            status: Codes.status.FAILURE,
				            code: Codes.httpStatus.ISE,
				            data: '',
				            error: Codes.errorMsg.UNEXP_ERROR
				        });
		        		return;
						}	
					var newPlayer = new Player();
					newPlayer.playerId = player.playerId;
					newPlayer.name = player.name;
					newPlayer.positionId = player.positionId;
					newPlayer.position = player.position;
					newPlayer.active = player.active;
					players.push(newPlayer)
					if(players.length == req.body.players.length){

						var matchCard = new MatchCard;
						matchCard.user = user;
						matchCard.match = match;
						matchCard.players = players
						matchCard.createdOn = moment.utc();
						matchCard.save(function(matchCardSaveErr, savedMatchCard){
		            	if (matchCardSaveErr) {
		                    res.status(Codes.httpStatus.BR).json({
		                        status: Codes.status.FAILURE,
		                        code: Codes.httpStatus.BR,
		                        data: '',
		                        error: Validation.validatingErrors(matchCardSaveErr)
		                    });
		                    return;
		                } 
		                if(savedMatchCard){
		                	res.status(Codes.httpStatus.OK).json({
					            status: Codes.status.SUCCESS,
					            code: Codes.httpStatus.OK,
					            data: savedMatchCard._id,
					            error: ''
			        		});
			    			return;
		                	}
		            	});
					}

				});
			});
		});
	});
}

exports.getMatchLeaderboard = function(req, res){

	MatchCard.find({match:req.params.matchId}).sort("matchPoints",1).populate('user').exec(function(matchCardsErr, matchCards){

		if(matchCardsErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}

		if(matchCards == null){
			res.status(Codes.httpStatus.BR).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.BR,
	            data: '',
	            error: Codes.errorMsg.F_INV_MID
	        });
	        return;
		}

		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: matchCards,
            error: ''
		});
	});
}



