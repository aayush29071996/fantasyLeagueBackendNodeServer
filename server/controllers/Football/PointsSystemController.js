/*
 * Created by harirudhra on Sun 12 March 2017
 */

 var User = require('../../models/User');
 var Match = require('../../models/Football/Match');
 var MatchCard = require('../../models/Football/MatchCard');
 var Player = require('../../models/Football/Master/Player');	

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

			Player.find({playerId:{$in:req.body.players}, function(playersListErr, playersList){
				console.log(playersList)
				var matchCard = new MatchCard;
				matchCard.user = user;
				matchCard.match = match;
				matchCard.players = [];
				playersList.forEach(function(player, index){
					newPlayer.playerId = player.playerId;
					newPlayer.name = player.name;
					newPlayer.positionId = player.positionId;
					newPlayer.position = player.position;
					newPlayer.active = player.active;
					matchCard.players.push(newPlayer)
				});
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
			}});
		});
	});
}