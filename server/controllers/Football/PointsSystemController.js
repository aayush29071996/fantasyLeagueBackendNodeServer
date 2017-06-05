/*
 * Created by harirudhra on Sun 12 March 2017
 */

 var User = require('../../models/User');
 var Match = require('../../models/Football/Match');
 var MatchCard = require('../../models/Football/MatchCard');
 var Player = require('../../models/Football/Master/Player');	
 var moment = require('moment');
 var _ = require('underscore');
 var sortBy = require('array-sort-by');

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
			
		MatchCard.find({user:userObjectId}).select("-__v -_id -players -createdOn").populate('match','startingDateTime _id', null, { sort: { startingDateTime: -1 } }).exec(function(error,cards){
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
				theHistory.push({playedOn:cards[i].match.startingDateTime, points:cards[i].matchPoints});
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
				res.status(Codes.httpStatus.OK).json({
		            status: Codes.status.SUCCESS,
		            code: Codes.httpStatus.OK,
		            data: {
		            	matchCards:previousMatches,
		            	performance:{
		            		matchesPlayed: previousMatches.length,
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
				
				
			});
		
		
		});
			
	});
};