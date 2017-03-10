/*
 * Created by harirudhra on Sat 11 Feb 2017
 */

var moment = require('moment');

var Competition = require('../../models/Football/Competition');
var Season = require('../../models/Football/Season');
var Match = require('../../models/Football/Match');

var Codes = require('../../Codes');
var Validation = require('../Validation');

exports.getFixturesHistory = function(req, res) {

	var twoHoursBefore= moment.utc().subtract('2','h').format("YYYY-MM-DD HH:mm:ss");
	var sevenDaysBefore = moment.utc().subtract('7','d').format("YYYY-MM-DD HH:mm:ss");
	
	console.log(twoHoursBefore)
	console.log(sevenDaysBefore);


	Match.find({startingDateTime:{$gte:sevenDaysBefore, $lt:twoHoursBefore}}).sort({"startingDateTime":1}).exec( function(matchesErr, matches){
		if(matchesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(matches.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.F_NO_HIS
            });
            return;
		}

		if(matches.length > 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: matches,
                error: ''
            });
            return;
		}
	});
}

exports.getFixturesLive = function(req, res) {

	var twoHoursBefore= moment.utc().subtract('2','h').format("YYYY-MM-DD HH:mm:ss");
	var now = moment.utc().format("YYYY-MM-DD HH:mm:ss");

	console.log(twoHoursBefore)
	console.log(now)


	Match.find({startingDateTime:{$gte:twoHoursBefore, $lt:now}}).sort({"startingDateTime":1}).exec( function(matchesErr, matches){
		if(matchesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(matches.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.F_NO_LIVE
            });
            return;
		} 

		if(matches.length > 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: matches,
                error: ''
            });
            return;
		}
	});
}


exports.getFixturesUpcoming = function(req, res) {

	var now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
	var sevenDaysAfter = moment.utc().add('7','d').format("YYYY-MM-DD HH:mm:ss");
	
	console.log(now)
	console.log(sevenDaysAfter)

	Match.find({startingDateTime:{$gte:now, $lt:sevenDaysAfter}}).sort({"startingDateTime":1}).exec( function(matchesErr, matches){
		if(matchesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(matches.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.F_NO_UP
            });
            return;
		} 

		if(matches.length > 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: matches,
                error: ''
            });
            return;
		}
	});
}


exports.getCompetitionsAndSeasons = function(req, res){

	Season.find({}).populate("competition").exec(function(seasErr, seas){

		if(seasErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
		}

		if(seas.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.F_NO_SE
            });
            return;
		}

		if(seas.length > 0){
			
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: seas,
                error: ''
            });
            return;
		}

	});

}


exports.getFixturesBySeason = function(req, res){

	Match.find({seasonId:req.params.seasonId}).sort({"startingDateTime":1}).exec(function(matchesErr, matches){

		if(matchesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
		}

		if(matches.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.F_NO_MA
            });
            return;
		}

		if(matches.length > 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: matches,
                error: ''
            });
            return;
			
		}

	});
}

//get fixture details
exports.getFixture = function(req, res){

	Match.findOne({matchId:req.params.matchId},function(matchErr, match){

		if(matchErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
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

		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: match,
            error: ''
        });
        return;

	});
}


exports.getAllFixtures = function(req, res) {
	
	Match.find({}).select('matchId team1Id team2Id status startingDateTime').exec(function(fixturesErr, fixtures){
		if(fixturesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(fixtures.length == 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.F_NO_MA
            });
            return;
		}

		if(fixtures.length > 0){
			res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: fixtures,
                error: ''
            });
            return;
		}
	});
}

//check availability for new fixture id
exports.getFixtureIdAvailability = function(req, res){
	Match.findOne({matchId:req.body.matchId}, function(fixtureErr, fixture){
		if(fixtureErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(fixture == null){
	        res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: req.body.matchId,
	            error: ''
	    	});
			return; 
		}
		res.status(Codes.httpStatus.BR).json({
            status: Codes.status.FAILURE,
            code: Codes.httpStatus.BR,
            data: '',
            error: Codes.errorMsg.F_ID_INUSE
        });
        return;
	});
}


//create new fixture
exports.createFixture = function(req, res){
	Match.findOne({matchId:req.body.matchId}, function(fixtureErr, fixture){
		if(fixtureErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(fixture == null){
			
			var newFixture = new Match();
			newFixture.matchId = req.body.matchId;
			newFixture.team1Id = req.body.team1Id;
			newFixture.team2Id = req.body.team2Id;
			newFixture.status = req.body.status;
			newFixture.startingDateTime = req.body.startingDateTime;
			newFixture.seasonId = req.body.seasonId;
			newFixture.stageId = req.body.stageId;
			newFixture.roundId = req.body.roundId;
			newFixture.venueId = req.body.venueId;
			newTeam.save(function(fixtureSaveErr, savedFixture){
            	if (fixtureSaveErr) {
                    res.status(Codes.httpStatus.BR).json({
                        status: Codes.status.FAILURE,
                        code: Codes.httpStatus.BR,
                        data: '',
                        error: Validation.validatingErrors(fixtureSaveErr)
                    });
                    return;
                } 
                if(savedFixture){
                	res.status(Codes.httpStatus.OK).json({
		            status: Codes.status.SUCCESS,
		            code: Codes.httpStatus.OK,
		            data: savedFixture,
		            error: ''
	        	});
	    		return;
                }
            });
		}
		if(fixture){
			res.status(Codes.httpStatus.BR).json({
					status: Codes.status.FAILURE,
					code: Codes.httpStatus.BR,
					data: '',
					error: Codes.errorMsg.F_ID_INUSE
				});
			return;
		}
	});
}


//update fixture details
exports.updateFixture = function(req, res){
	Match.findOneAndUpdate({matchId:req.body.matchId}, {$set:{team1Id: req.body.team1Id,team2Id:req.body.team2Id, status:req.body.status, active:req.body.active, team1Score:req.body.team1Score, team2Score:req.body.team2Score, team1Penalties:req.body.team1Penalties, team2Penalties:req.body.team2Penalties, dateTimeTBA:req.body.dateTimeTBA, startingDateTime:req.body.startingDateTime, minute:req.body.minute, extraMinute:req.body.extraMinute, seasonId:req.body.seasonId, stageId:req.body.stageId, roundId:req.body.roundId, venueId:req.body.venueId}},{"new":true}).exec(function(fixtureErr, fixture){
		if(fixtureErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(fixture == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.F_NO_MA
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: fixture,
            error: ''
        });
        return;
	});
}

//delete existing fixture
exports.deleteFixture = function(req, res){
	Match.findOneAndRemove({matchId:req.body.matchId}, function(fixtureErr, fixture){
		if(fixtureErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	        return;
		}
		if(fixture == null){
			res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Codes.errorMsg.F_NO_MA
            });
            return;
		}
		res.status(Codes.httpStatus.OK).json({
            status: Codes.status.SUCCESS,
            code: Codes.httpStatus.OK,
            data: fixture,
            error: ''
        });
	});
}


