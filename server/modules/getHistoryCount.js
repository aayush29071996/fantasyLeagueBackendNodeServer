var moment = require('moment');

var Match = require('../models/Football/Match');

exports.getHistoryCount=function(callback){
	var twoHoursBefore= moment.utc().subtract('2','h').format("YYYY-MM-DD HH:mm:ss");


	Match.find({startingDateTime:{$lt:twoHoursBefore}}).select('matchId').exec( function(matchesErr, matches){
		if(matchesErr){
		    callback(true,null);
	        return;
		}
		
		callback(null,matches.length);
		return;
	});
	}