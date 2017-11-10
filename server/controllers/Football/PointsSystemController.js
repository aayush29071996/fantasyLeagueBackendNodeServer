/*
 * Created by harirudhra on Sun 12 March 2017
 */

 var User = require('../../models/User');
 var Match = require('../../models/Football/Match');
 var Event = require('../../models/Football/Event');
 var MatchCard = require('../../models/Football/MatchCard');
 var PointSystem = require('../../models/Football/Master/PointSystem');
 var Player = require('../../models/Football/Master/Player');
 var Team = require('../../models/Football/Master/Team');
 var moment = require('moment');
 var _ = require('underscore');
 var sortBy = require('array-sort-by');

 var Codes = require('../../Codes');
 var Validation = require('../Validation');
var EventHistory = require('../../models/Football/EventHistory');



var HistoryCount = require('../../modules/getHistoryCount');
var responseToConsole = function(_status, _code, _data, _error) {

	var responseJSON = {
		status: _status,
		code: _code,
		data: _data,
		error: _error
	}
	return responseJSON;
}



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

		console.log('User ID ' + user._id)


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

			console.log('Match ID ' + match._id)

			MatchCard.findOne({user:user._id, match:match._id}, function(matchCardErr, matchCard) {

				if(matchCardErr){
					res.status(Codes.httpStatus.ISE).json({
			            status: Codes.status.FAILURE,
			            code: Codes.httpStatus.ISE,
			            data: '',
			            error: Codes.errorMsg.UNEXP_ERROR
			        });
			        return;
				}

				console.log('MatchCard is ' + matchCard);

				if(matchCard != null){
					matchCard.players = [];
					var players = [];
					req.body.players.forEach(function(playerId, index){
						Player.findOne({playerId:playerId}, function(playerErr, player){
							if(playerErr){
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
								matchCard.players = players
								matchCard.matchId = req.body.matchId;
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
				} else {
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
							if(player == null){
								console.log("NULL for " + playerId);
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
								matchCard.matchId = req.body.matchId;
								matchCard.match = match;
								matchCard.createdOn = moment.utc();
								matchCard.players = players;
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
					}
			});

		});
			
	});
}

function getNewMatchCard(){
	console.log('is new MC');
	
}



exports.getMatchCards = function(req, res){

	MatchCard.find({user:req.params.userId}).populate('match').exec(function(matchCardsErr, matchCards){

		if(matchCardsErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}

		if(matchCards.length == 0 ){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.F_INV_MCID
	        });
	        return;
		}

		if(matchCards.length == 0){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: [],
	            error: Codes.errorMsg.F_NO_MC
	        });
	        return;
		}

		var matchCardSet = [];
		matchCards.forEach(function(matchCard, index){
			Team.find({$or:[{teamId:matchCard.match.team1Id},{teamId:matchCard.match.team2Id}]}).select('teamId name').exec(function(teamsErr, teams){

				if(teamsErr){
					res.status(Codes.httpStatus.ISE).json({
			            status: Codes.status.FAILURE,
			            code: Codes.httpStatus.ISE,
			            data: '',
			            error: Codes.errorMsg.UNEXP_ERROR
			        });
			        return;
				}

				if(teams == null){
					res.status(Codes.httpStatus.OK).json({
			            status: Codes.status.SUCCESS,
			            code: Codes.httpStatus.OK,
			            data: '',
			            error: Codes.errorMsg.T_INV_TID
			        });
			        return;
				}

				var team1 = _.where(teams, {teamId:matchCard.match.team1Id})[0];
				var team2 = _.where(teams, {teamId:matchCard.match.team2Id})[0];

				var matchCardObj = {};
				matchCardObj.matchCard = matchCard;
				matchCardObj.team1 = team1;
				matchCardObj.team2 = team2;

				matchCardSet.push(matchCardObj);
				if(matchCardSet.length == matchCards.length){
					res.status(Codes.httpStatus.OK).json({
			            status: Codes.status.SUCCESS,
			            code: Codes.httpStatus.OK,
			            data: matchCardSet,
			            error: ''
					});
					return;
				}

			});
		});

	});
}



exports.editMatchCard = function(req, res) {

	MatchCard.findOne({_id:req.body.matchCardId}, function(matchCardErr, matchCard) {

		if(matchCardErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}

		if(matchCard == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.F_INV_MCID
	        });
	        return;
		}

		var players = [];
		req.body.players.forEach(function(playerId, index){
			Player.findOne({playerId:playerId}, function(playerErr, player){
				if(playerErr){
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
}

exports.getRosterPlayers = function(req, res) {

		MatchCard.findOne({user:req.params.user, matchId:req.params.matchId}).populate('match').exec(function(matchCardErr, matchCard){
			if(matchCardErr){
				res.status(Codes.httpStatus.ISE).json({
		            status: Codes.status.FAILURE,
		            code: Codes.httpStatus.ISE,
		            data: '',
		            error: Codes.errorMsg.UNEXP_ERROR
		        });
	        	return;
			}


			if(matchCard == null){
				res.status(Codes.httpStatus.OK).json({
		            status: Codes.status.SUCCESS,
		            code: Codes.httpStatus.OK,
		            data: '',
		            error: Codes.errorMsg.F_INV_MID
		        });
		        return;
			}

      res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: matchCard,
	            error: ''
			});




	});
}


exports.getMatchLeaderboard = function(req, res){

	var matchObjectId;
	console.log(req.params.matchId);
	Match.find({matchId:req.params.matchId}).exec(function(matchErr, match){
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
			res.status(Codes.httpStatus.BR).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.BR,
	            data: '',
	            error: Codes.errorMsg.F_INV_MID
	        });
	        return;
		}
		console.log(match);
		matchObjectId=match[0]._id;
		console.log(matchObjectId);

	MatchCard.find({match:matchObjectId}).sort({"matchPoints":1}).populate('user').exec(function(matchCardsErr, matchCards){

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

	});

}

exports.getPlayerHistory = function(req, res){
	var userObjectId;
	var userPoint;

	User.find({username:req.params.username}).select("-__v -name -email -password -avatar -location -dob -token -status -createdOn").exec(function(err,user){
		if(err){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
			}
			if(user.length>0){
				userObjectId=user[0]._id;
				userPoint=user[0].userPoints;
			}
			else{
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
			}

		MatchCard.find({user:userObjectId}).select("-__v -_id -players -createdOn").populate('match','startingDateTime matchId team1Id team2Id').exec(function(error,cards){
			if(error){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
			}
			var previousMatches=[];
			var theHistory=[];
			if(cards.length>0){
			for(var i=0;i<cards.length;i++){

				previousMatches.push(cards[i].match._id);
				theHistory.push({playedOn:cards[i].match.startingDateTime, points:cards[i].matchPoints, match:cards[i].match});

			      }
			}
			sortBy(theHistory, (s) => -new Date(s.playedOn));
			User.find().select("-__v -_id -name -email -password -avatar -location -dob -token -status -createdOn").sort([['userPoints', 'descending']]).exec(function(allErr,all){
				if(allErr){
				res.status(Codes.httpStatus.ISE).json({
		            status: Codes.status.FAILURE,
		            code: Codes.httpStatus.ISE,
		            data: '',
		            error: Codes.errorMsg.UNEXP_ERROR
		        });
		        return;
				}
				HistoryCount.getHistoryCount(function(countErr,totalMatches){
					if(countErr){
						res.status(Codes.httpStatus.ISE).json({
			            status: Codes.status.FAILURE,
			            code: Codes.httpStatus.ISE,
			            data: '',
			            error: Codes.errorMsg.UNEXP_ERROR
			        });
			        return;
					}
					res.status(Codes.httpStatus.OK).json({
		            status: Codes.status.SUCCESS,
		            code: Codes.httpStatus.OK,
		            data: {
		            	matchCards:previousMatches,
		            	performance:{
		            		matchesPlayed: previousMatches.length,
		            		totalMatches: totalMatches,
		            		points:{
		            			userPoints: userPoint,
		            			topPoints: all[0].userPoints
	            			},
	            			globalRank: all.map(function(d){return d['username'].indexOf(req.params.username);}).indexOf(0)+1,
	            			recentPlay:theHistory.slice(0,5),
	            			leaderboard:theHistory.length>50?theHistory.slice(0,50):theHistory
		            	}
	            	},
		            error: ''
				});
				return;

				});

			});


		});

	});
};




exports.resetPointsFixture = function(req, res){

	Match.findOne({matchId:req.params.matchId}).exec(function(matchErr, match){
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
			res.status(Codes.httpStatus.BR).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.BR,
	            data: '',
	            error: Codes.errorMsg.F_INV_MID
	        });
	        return;
		}

		_.each(match.lineup, function(lineupItem, index, lineup){
			lineupItem.points = 0;
		});

		match.events.forEach(function(event_id, index){
			Event.update({_id:event_id}, {$set:{computed:false}}).exec(function(eventsUptErr, eventsUpt){
				if(eventsUptErr){
				 res.status(Codes.httpStatus.BR).json({
                        status: Codes.status.FAILURE,
                        code: Codes.httpStatus.BR,
                        data: '',
                        error: Validation.validatingErrors(eventsUptErr)
                    });
                    return;
				}
				if(match.events.length == index+1){
					match.save(function(matchSaveErr, savedMatch){
						console.log(matchSaveErr);
		            	if (matchSaveErr) {
		                    res.status(Codes.httpStatus.BR).json({
		                        status: Codes.status.FAILURE,
		                        code: Codes.httpStatus.BR,
		                        data: '',
		                        error: Validation.validatingErrors(matchSaveErr)
		                    });
		                    return;
		                }

		                MatchCard.find({match:savedMatch._id}, function(matchCardsErr, matchCards){
		                	if(matchCardsErr){
								res.status(Codes.httpStatus.ISE).json({
						            status: Codes.status.FAILURE,
						            code: Codes.httpStatus.ISE,
						            data: '',
						            error: Codes.errorMsg.UNEXP_ERROR
						        });
						        return;
							}

							if(matchCards.length == 0){
								res.status(Codes.httpStatus.OK).json({
						            status: Codes.status.SUCCESS,
						            code: Codes.httpStatus.OK,
						            data: 'Lineup, Events resetted and ' + Codes.errorMsg.F_NO_MC_M,
						            error: ''
						        });
						        return;
							}

							_.each(matchCards, function(matchCard, index, matchCards){
								matchCard.matchPoints = 0;
								_each(matchCard.players, function(player, pIndex, players){
									player.points = 0;
									if(players.length == pIndex + 1){
										matchCard.save(function(matchCardSaveErr, matchCard){
										 	res.status(Codes.httpStatus.BR).json({
						                        status: Codes.status.FAILURE,
						                        code: Codes.httpStatus.BR,
						                        data: '',
						                        error: Validation.validatingErrors(matchCardSaveErr)
						                    });
						                    return;
						                    res.status(Codes.httpStatus.OK).json({
									            status: Codes.status.SUCCESS,
									            code: Codes.httpStatus.OK,
									            data: 'Lineup, Events and MatchCards resetted',
									            error: ''
											});

										});
									}
								});
							});


		                });
					});
				}
			});
		});
	});


};


//MANUAL SYSTEM FOR POINT CALCULATION

exports.manualSystem1 = function(req, res){

	Match.findOne({matchId:req.body.matchId}).exec(function(matchErr, match){

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
			res.status(Codes.httpStatus.BR).json({
				status: Codes.status.FAILURE,
				code: Codes.httpStatus.BR,
				data: '',
				error: Codes.errorMsg.F_INV_MID
			});
			return;
		}


		//UPDATE THE EVENT SCHEMA
		var newEvent = new Event;
		newEvent.eventId = req.body.eventId;
		newEvent.matchId = req.body.matchId;
		newEvent.teamId = null;
		newEvent.type = req.body.eventName;
		newEvent.minute = req.body.minute;
		newEvent.extraMinute = null;
		newEvent.reason = null;
		newEvent.injuried = null;
		newEvent.playerId = req.body.playerId;
		newEvent.playerName = req.body.playerName;
		newEvent.computed = true;
		//	newEvent.relatedPlayerId = req.body.relatedPlayerId;
     	//	newEvent.relatedPlayerName = event.related_player_name;

		newEvent.save(function (saveErr, saveEvent){
			if(saveErr){
				res.status(Codes.httpStatus.BR).json({
					status:Codes.status.FAILURE,
					code: Codes.httpStatus.BR,
					data: '',
					error: Validation.validatingErrors(saveErr)
				});
			}
			// SAVES event
		});


		const playerPoints= _.findWhere(match.lineup,{"playerId":req.body.playerId}).points;
		const eventPoints = req.body.eventPoints;
		const playerPosition = _.findWhere(match.lineup,{"playerId":req.body.playerId}).position;

		//UPDATE THE EVENT HISTORY SCHEMA
		var eventHistory = new EventHistory;

		eventHistory.eventId = req.body.eventId;
		eventHistory.matchId = req.body.matchId;
		eventHistory.playerId = req.body.playerId;
		eventHistory.position = playerPosition;
		eventHistory.eventPoints = eventPoints;
		eventHistory.playerPoints = playerPoints;

		eventHistory.save(function (saveErr, saveEventHistory){
			if(saveErr){
				res.status(Codes.httpStatus.BR).json({
					status:Codes.status.FAILURE,
					code: Codes.httpStatus.BR,
					data: '',
					error: Validation.validatingErrors(saveErr)

				});
			}
			// SAVES eventHistory
		});


        // MATCH POINTS AND LINE UP CHANGES
		var wholeMatchPreviousPoints = _.findWhere({match}).points;
	//	console.log(wholeMatchPreviousPoints);
		var playerPreviousPoints = _.findWhere(match.lineup,{"playerId":req.body.playerId}).points;
	//	console.log(playerPreviousPoints);
		var playerNewPoints = playerPreviousPoints + req.body.eventPoints;
	//	console.log(playerNewPoints);
		var wholeMatchPoints = wholeMatchPreviousPoints + req.body.eventPoints;
	//	console.log(wholeMatchPoints);
		_.findWhere(match.lineup,{"playerId":req.body.playerId}).points = playerNewPoints;
		match.points = wholeMatchPoints;
	//	console.log(match.points);

		//PUSH THE EVENT IN MATCHES SCHEMA FOR THAT MATCH


		match.events.push(newEvent);

		match.save(function(matchSaveErr, savedMatch){

			if (matchSaveErr) {
				console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchSaveErr)));
				return;
			}


			//MATCHCARD POINTS AND LINEUP CHANGES

			MatchCard.find({match:savedMatch._id}).populate('match players').exec(function(matchCardsErr, matchCards){
				if(matchCardsErr){
					console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, matchCardErr, Codes.errorMsg.UNEXP_ERROR));
					return;
				}
				console.log('Update matchCards');

				if(matchCards.length == 0){
					console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, '', Codes.errorMsg.F_NO_MC_M));
					return;
				}

				_.each(matchCards, function(matchCard, index, matchCards){
					var lineupInMatch = {};
					var matchPoints = 0;
					lineupInMatch = savedMatch.lineup;

					//LOOK FOR EACH PLAYER IN LINEUP AND COMPARE WITH MATCHCARD PLAYERS

					_.each(lineupInMatch, function(lineup, index, lineups){
						// console.log('MATCHCARD PLAYERS');
						// console.log(matchCard);
						var player = _.findWhere(matchCard.players,{"playerId":lineup.playerId});
						if(player !== undefined && player){
							_.findWhere(matchCard.players,{"playerId":lineup.playerId}).points = lineup.points;
							matchPoints = matchPoints + _.findWhere(matchCard.players,{"playerId":lineup.playerId}).points;
						}

					});

					matchCard.matchPoints = matchPoints;
					console.log(matchCard.user);


					//SAVE THE MATCHCARD

					matchCard.save(function(matchCardSaveErr, savedMatchCard){
						if (matchCardSaveErr) {
							console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchCardSaveErr)));
							return;
						}
						if(savedMatchCard){
							console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' Points Calculated', ''));
							return;
						}
					});




					//UPDATE THE MATCHCARD USER SIMULTANEOUSLY

					                                             //LOGIC TO BE IMPLEMENTED FOR UPDATING USER POINTS FOR THAT PARTICULAR PLAYER AND EVENT ONLY AND FIND IF THE PLAYER EXISTS IN USER PLAYERS LIST

					User.findById({_id:matchCard.user}, function(err, user){
						if(err){
							console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, 'Unexpected error', Validation.validatingErrors(errorMsg.UNEXP_ERROR)));
							return;
						}
						if(user == null){
							console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, 'User Not Found', Validation.validatingErrors(errorMsg.USER_NOT_FOUND)));
							return;
						}

						var prevPoints = user.userPoints;
						var diff = matchCard.matchPoints - prevPoints;
						user.userPoints = prevPoints + diff;

						user.save(function(err, savedUser){
							if (err) {
								console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(err)));
								return;
							}
							if(savedUser){
								console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'User ' + user.username + ' Points Calculated and Saved', ''));
							}

						});
					});




				});


				});




			});


		});

};



//POINTS CALCULATION TYPE FOR SWITCHING FROM MANUAL TO AUTOMATIC

exports.pointsCalculationType = function(req, res){

	Match.findOne({matchId:req.body.matchId}).exec(function(matchErr, match) {

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
			res.status(Codes.httpStatus.BR).json({
				status: Codes.status.FAILURE,
				code: Codes.httpStatus.BR,
				data: '',
				error: Codes.errorMsg.F_INV_MID
			});
			return;
		}

		if(match.pointsCalculationType == false){

			match.pointsCalculationType = true;
			match.save(function(matchSaveErr, savedMatch){
				if (matchSaveErr) {
					console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchSaveErr)));
					return;
				}
				if(savedMatch){
					console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' Saved Points Calculation Type', ''));

					res.status(Codes.httpStatus.OK).json({
						status: Codes.status.SUCCESS,
						code: Codes.httpStatus.OK,
						data: 'Set as TRUE',
						error: ''
					});
				}

			});


		}

		if(match.pointsCalculationType == true){

			match.pointsCalculationType = false;
			match.save(function(matchSaveErr, savedMatch){
				if (matchSaveErr) {
					console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchSaveErr)));
					return;
				}
				if(savedMatch){
					console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' Saved Points Calculation Type', ''));
					res.status(Codes.httpStatus.OK).json({
						status: Codes.status.SUCCESS,
						code: Codes.httpStatus.OK,
						data: 'Set as FALSE',
						error: ''
					});
				}
			});

		}


	});




};
