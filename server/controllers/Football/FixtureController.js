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

	Match.find({seasonId:req.params.id}).sort({"startingDateTime":1}).exec(function(matchesErr, matches){

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

exports.getFixture = function(req, res){

	Match.findOne({matchId:req.params.id},function(matchErr, match){

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
