/*
 * Created by harirudhra on Sun 12 March 2017
 */

 var User = require('../../models/User');
 var Match = require('../../models/Football/Match');
 var MatchCard = require('../../models/Football/MatchCard');
 var Player = require('../../models/Football/Master/Player');	

 var moment = require('moment');
 var _ = require('underscore');

 var Codes = require('../../Codes');
 var Validation = require('../Validation');


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


exports.computeMatchPoints = function(req, res){
 	
 	Match.findOne({matchId:req.params.matchId}).populate('events').exec(function(matchErr, match){
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

		var goal = [], goalByAssist = [], goalByPenalty = [], goalByPenaltyMissed = [], goalSave = [], goalByPenaltySave = [], goalOwn = [];
		var cardRed = [], cardYellow = [], cardYellowRed = [];
		var substitution = [];

		var cleanSheet = [];

		var unrecorded = [];

		console.log('Match Id : ' + match.matchId);
		console.log('Events Length : ' + match.events.length);

		_.each(match.lineup, function(playerLP, index, cleanSheetEvent){
				playerLP.points = 0;
		});

		if(match.status === "FT"){
			computePointsCleanSheet(match);
		}

		match.events.forEach(function(event, id){
			switch(event.type) {
				
				case "goal":
					if("assistPlayerId" in event){
						goalByAssist.push(event);
					} else {
						goal.push(event);
					}
					break;

				case "penalty":
					goalByPenalty.push(event);
					break;
				
				case "missed_penalty":
					goalByPenaltyMissed.push(event);
					break;

				case "own-goal":
					goalOwn.push(event);
					break;

				case "yellowcard": 
					cardYellow.push(event);
					break;

				case "redcard":
					cardRed.push(event);
					break;

				case "yellowred":
					cardYellowRed.push(event);
					break;

				case "substitution":
					substitution.push(event);
					break;

				default:
					unrecorded.push(event);
					console.log('New Event Recorded ' + event.type);
					break;
			}

		});

			

			console.log('-------------------------')
			console.log('Goals : ' + goal.length);
			console.log('Goals With Assist : ' + goalByAssist.length);
			console.log('Goals By Penalty : ' + goalByPenalty.length);
			console.log('Goals By Penalty Missed : ' + goalByPenaltyMissed.length);
			console.log('Goals Save : ' + goalSave.length);
			console.log('Goals By Penalty Save : ' + goalByPenaltySave.length);
			console.log('Goals (Own) : ' + goalOwn.length);
			console.log('Yellow Cards : ' + cardYellow.length);
			console.log('Red Cards : ' + cardRed.length);
			console.log('YellowRed Cards : ' + cardYellowRed.length);
			console.log('Substitution : ' + substitution.length);
			console.log('Clean Sheets : ' + cleanSheet.length);
			console.log('Unrecorded Events : ' + unrecorded.length);
			console.log('-------------------------')

			var recordedEvents = {};
			recordedEvents["goal"] = goal;
			recordedEvents["goalByAssist"] = goalByAssist;
			recordedEvents["goalByPenalty"] = goalByPenalty;
			recordedEvents["goalByPenaltyMissed"] = goalByPenaltyMissed;
			recordedEvents["goalSave"] = goalSave;
			recordedEvents["goalByPenaltySave"] = goalByPenaltySave;
			recordedEvents["goalOwn"] = goalOwn;
			recordedEvents["cardYellow"] = cardYellow;
			recordedEvents["cardRed"] = cardRed;
			recordedEvents["cardYellowRed"] = cardYellowRed;
			recordedEvents["substitution"] = substitution;
			recordedEvents["cleanSheet"] = cleanSheet;

			// console.log('Recorded Events Array Length : ' + JSON.stringify(recordedEventsArray, null, 2));
			console.log('Recorded Events Object Length : ' + _.size(recordedEvents));

			_.each(recordedEvents,function(recordedEvent, key, recordedEvents){
				if(recordedEvent.length > 0){
					console.log('Calculating Points for Event: ' + key);
					_.each(recordedEvent, function(_event, index, recordedEvent){
						if(key === "substitution"){
							_.findWhere(match.lineup,{"playerId":_event.playerInId}).points = _.findWhere(match.lineup,{"playerId":_event.playerInId}).points +  computePoints(_.findWhere(match.lineup,{"playerId":_event.playerInId}),key);
						} else if(key === "goalByAssist"){
							_.findWhere(match.lineup,{"playerId":_event.playerId}).points = _.findWhere(match.lineup,{"playerId":_event.playerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.playerId}),"goal");
							_.findWhere(match.lineup,{"playerId":_event.assistPlayerId}).points = _.findWhere(match.lineup,{"playerId":_event.assistPlayerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.assistPlayerId}),"goalByAssist");
						} else /*(key === "goal" || key === "goalByAssist" || key === "goalByPenalty" || key === "goalByPenaltyMissed")*/{
							//console.log(_event);
							_.findWhere(match.lineup,{"playerId":_event.playerId}).points = _.findWhere(match.lineup,{"playerId":_event.playerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.playerId}),key);
						}
					});
				}
			});
			//console.log(match.lineup)
			match.save(function(matchSaveErr, savedMatch){
	        	if (matchSaveErr) {
	                res.status(Codes.httpStatus.BR).json({
	                    status: Codes.status.FAILURE,
	                    code: Codes.httpStatus.BR,
	                    data: '',
	                    error: Validation.validatingErrors(matchSaveErr)
	                });
	                return;
	            } 
		         if(savedMatch){
		        	res.status(Codes.httpStatus.OK).json({
			            status: Codes.status.SUCCESS,
			            code: Codes.httpStatus.OK,
			            data: savedMatch,
			            error: ''
		    		});
					return;
		        	}
            	});

 	});

}

var computePoints = function(playerLP, event){

		var pos = playerLP.position;
		//defense
		if(pos === "CD" || pos ===  "CD-L" || pos === "CD-R" || pos === "LB" || pos === "RB"){
			console.log(pos + ' - defense');
			return computePointsDefense(event);
		} else
		//midfielder	
		if(pos === "Midfielder" || pos === "CM-L" || pos === "CM-R" || pos === "CM" ||  pos === "LM" || pos === "RM" || pos === "AM"){
			return computePointsMidfield(event);
			console.log(pos + ' - midfielder');
		} else
		//forward
		if(pos === "Forward" || pos === "LF" || pos === "RF" || pos === "CF" || pos === "CF-L" || pos ==="CF-R"){
			console.log(pos + ' - forward');
			return computePointsForward(event);
		} else
		//goalkeeper	
		if(pos === "Goalkeeper"){
			console.log(pos + ' - goalkeeper');
			return computePointsGoalkeeper(event);
		} else
		//sub	
		if(pos === "SUB"){
			console.log(pos + ' - substitution');
			return 0;
		} //otherwise
		else {
			console.log(pos + ' - new position');
			return 0;
		}
		
	//console.log(playerLP)
	
}

var computePointsDefense = function(event){
	if(event === "goal"){
		return 6;
	} else if(event === "goalByAssist"){
		return 3;
	} else if(event === "goalByPenalty"){
		return 2;
	} else if(event === "goalByPenaltyMissed"){
		return -2;
	} else if(event === "goalOwn"){
		return -2;
	} else if(event === "cardYellow"){
		return -1;
	} else if(event === "cardYellowRed"){
		return -2;
	} else if(event === "cardRed"){
		return -3;
	} else if(event === "cleanSheet"){
		return 3;
	} else {
		return 0;
	}
}

var computePointsMidfield = function(event){
	if(event === "goal"){
		return 5;
	} else if(event === "goalByAssist"){
		return 4;
	} else if(event === "goalByPenalty"){
		return 2;
	} else if(event === "goalByPenaltyMissed"){
		return -2;
	} else if(event === "goalOwn"){
		return -2;
	} else if(event === "cardYellow"){
		return -1;
	} else if(event === "cardYellowRed"){
		return -2;
	} else if(event === "cardRed"){
		return -3;
	} else if(event === "cleanSheet"){
		return 1;
	} else {
		return 0;
	}
}

var computePointsForward = function(event){
	if(event === "goal"){
		return 4;
	} else if(event === "goalByAssist"){
		return 3;
	} else if(event === "goalByPenalty"){
		return 2;
	} else if(event === "goalByPenaltyMissed"){
		return -2;
	} else if(event === "goalOwn"){
		return -2;
	} else if(event === "cardYellow"){
		return -1;
	} else if(event === "cardYellowRed"){
		return -2;
	} else if(event === "cardRed"){
		return -3;
	} else if(event === "cleanSheet"){
		return 0;
	} else {
		return 0;
	}
}

var computePointsGoalkeeper = function(event){
	if(event === "goal"){
		return 6;
	} else if(event === "goalByAssist"){
		return 3;
	} else if(event === "goalByPenalty"){
		return 2;
	} else if(event === "goalByPenaltyMissed"){
		return -2;
	} else if(event === "goalOwn"){
		return -2;
	} else if(event === "cardYellow"){
		return -1;
	} else if(event === "cardYellowRed"){
		return -2;
	} else if(event === "cardRed"){
		return -3;
	} else if(event === "cleanSheet"){
		return 4;
	} else {
		return 0;
	}
}


var computePointsCleanSheet = function(match){
	if(match.team1Score == 0){
		_.each(match.lineup, function(playerLP, index, cleanSheetEvent){
			if(playerLP.team === "team2"){
				var event = {};
				event.playerId = playerLP.playerId;	
				event.teamId = playerLP.teamId; 
				event.type = "cleansheet";
				cleanSheet.push(event);
			}
		});
	} 

	if(match.team2Score == 0){
		_.each(match.lineup, function(playerLP, index, cleanSheetEvent){
			if(playerLP.team === "team1"){
				var event = {};
				event.playerId = playerLP.playerId;	
				event.teamId = playerLP.teamId; 
				event.type = "cleansheet";
				cleanSheet.push(event);
			}
		});
	}
}



