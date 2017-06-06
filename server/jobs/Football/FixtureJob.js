/*
 * Created by harirudhra on Sat 11 March 2017
 */

var moment = require('moment');
var request = require('request');
var CronJob = require('cron').CronJob;
var Subtract = require('array-subtract');
var _ = require('underscore');

var Match = require('../../models/Football/Match');
var Event = require('../../models/Football/Event');

var Codes = require('../../Codes');
var Validation = require('../../controllers/Validation');

// var API_TOKEN_OLD = "H7H9qU3lmK1UNpqQoNxBI2PkZJec2IMAcNhByMSQ1GWhAt5tUDVtobVc1ThK";
var API_TOKEN = "EyTtWbGs9ZnUYam1xB63iXoJ4EZ4TuTKGmQaebB1tpsrxq5VcdQ3gPVgjMyz";
var baseUrl = "https://api.soccerama.pro/v1.2/";

var fireUrl = function(params, include) {
    return baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include;
};

var responseToConsole = function(_status, _code, _data, _error) {

    var responseJSON = {
        status: _status,
        code: _code,
        data: _data,
        error: _error
    }
    return responseJSON;
}

var eventsFilter = new Subtract((EventA, EventB) => {
    return EventA.id.toString() === EventB.eventId
});


//update fixtures every 15 minutes
exports.updateFixturesJob = function() {
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
    console.log('updateFixturesJob inside')
    var fixtureAvailCheckJob = new CronJob({

        cronTime: '*/120 * * * * *',
        onTick: function() {
            console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
            console.log('Update Fixture Job Called')

            //must be livescore/now 
            params = 'livescore'
            include = ''

            request.get(fireUrl(params, include), function(err, response, data) {

                if (err) {
                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
                    return;
                }

                if (response.statusCode == Codes.httpStatus.NF) {
                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Codes.errorMsg.INVALID_REQ));
                    return;

                }
                if (response.statusCode == Codes.httpStatus.UNAUTH) {
                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.UNAUTH, '', Codes.errorMsg.UNAUTH_KEY));
                    return;
                }

                if (response.statusCode == Codes.httpStatus.OK) {
                    data = JSON.parse(data);

                    if (data.hasOwnProperty("error")) {
                        if (data.error.code == Codes.httpStatus.ISE) {
                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, data.error, Codes.errorMsg.INVALID_REQ));
                            return;
                        }
                    }
                    data = data.data;
                    if (data.length == 0) {
                        console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, data, 'JOB : Checking for Fixture Updates : No Live Fixtures'));
                    } else {
                        // fixtureAvailCheckJob.stop();
                        console.log(data.length + ' matches to be updated');

                        //var data = ["691324","691323","699154","699153","699151","699155","699152","730211","730218","683313","730217","683309","730215","730220","730219","730212","683310","730216"];

                        data.forEach(function(fixture, index) {
                            console.log('update started for match id ' + fixture.id);
                             
                            params = 'livescore/match/' + fixture.id;
                            include = 'lineup,events'

                            request.get(fireUrl(params, include), function(err, response, data) {
                                if (err) {
                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
                                    return;
                                }

                                if (response.statusCode == Codes.httpStatus.NF) {
                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Codes.errorMsg.INVALID_REQ));
                                    return;

                                }
                                if (response.statusCode == Codes.httpStatus.UNAUTH) {
                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.UNAUTH, '', Codes.errorMsg.UNAUTH_KEY));
                                    return;
                                }

                                if (response.statusCode == Codes.httpStatus.OK) {
                                    data = JSON.parse(data);

                                    if (data.hasOwnProperty("error")) {
                                        if (data.error.code == Codes.httpStatus.ISE) {
                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, data.error, Codes.errorMsg.INVALID_REQ));
                                            return;
                                        }
                                    }
                                    var updatedMatch = data;

                                    Match.findOne({ matchId: updatedMatch.id }).populate('events').exec(function(matchErr, match) {
                                        if (matchErr) {
                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
                                            return;
                                        }

                                        if (match == null) {
                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Codes.errorMsg.F_INV_MID));
                                            return;
                                        }

                                        if (match.matchId == updatedMatch.id) {

                                            match.status = updatedMatch.status;
                                            match.team1Score = updatedMatch.home_score;
                                            match.team2Score = updatedMatch.away_score;
                                            match.team1Penalties = updatedMatch.home_score_penalties;
                                            match.team2Penalties = updatedMatch.away_score_penalties;
                                            if (updatedMatch.date_time_tba == 1 || updatedMatch.date_time_tba == true) {
                                                match.dateTimeTBA = true;
                                            } else if (updatedMatch.date_time_tba == 0 || updatedMatch.date_time_tba == false) {
                                                match.dateTimeTBA = false;
                                            }
                                            match.startingDateTime = moment.utc(updatedMatch.starting_date + ' ' + updatedMatch.starting_time);
                                            match.minute = updatedMatch.minute;
                                            match.extraMinute = updatedMatch.extra_time;
                                            match.htScore = updatedMatch.ht_score;
                                            match.ftScore = updatedMatch.ft_score;
                                            match.etScore = updatedMatch.et_score;
                                            match.injuryTime = updatedMatch.injury_time;


                                            if (updatedMatch.events.data.length > 0) {
                                                
                                                console.log('Match ' + match.matchId);
                                                console.log(updatedMatch.events.data.length + ' events in new data');
                                                console.log(match.events.length + ' events in existing data');

                                                if (match.events.length == 0) {

                                                    console.log('Match ' + match.matchId + ' has zero events - first event to be recorded');

                                                    updatedMatch.events.data.forEach(function(event, index) {

                                                        var newEvent = new Event();
                                                        newEvent.eventId = event.id;
                                                        newEvent.matchId = event.match_id;
                                                        newEvent.teamId = event.team_id;
                                                        newEvent.minute = event.minute;
                                                        newEvent.extraMinute = event.extra_min;
                                                        newEvent.type = event.type;
                                                        if (event.hasOwnProperty("player_id")) {
                                                            newEvent.playerId = event.player_id;
                                                        }
                                                        if (event.hasOwnProperty("assist_id")) {
                                                            newEvent.assistPlayerId = event.assist_id;
                                                        }
                                                        if (event.hasOwnProperty("related_event_id")) {
                                                            newEvent.relatedEventId = event.related_event_id;
                                                        }
                                                        if (event.hasOwnProperty("player_in_id")) {
                                                            newEvent.playerInId = event.player_in_id;
                                                        }
                                                        if (event.hasOwnProperty("player_out_id")) {
                                                            newEvent.playerOutId = event.player_out_id;
                                                        }

                                                        newEvent.save(function(savedEventErr, savedEvent) {
                                                            if (savedEventErr) {
                                                                console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(savedEventErr)));
                                                                return;
                                                            }
                                                            if (savedEvent) {
                                                                console.log('new event added')
                                                                console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Event ' + savedEvent.eventId + ' added', ''));

                                                                match.events.push(savedEvent);

                                                                if (match.events.length == updatedMatch.events.data.length) {

                                                                    match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                                        if (matchUpdateErr) {
                                                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                                            return;
                                                                        }
                                                                        if (savedUpdatedMatch) {
                                                                            console.log('new match update')
                                                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + savedUpdatedMatch.matchId + ' updated', ''));
                                                                            return;
                                                                        }
                                                                    });
                                                                }
                                                                return;
                                                            }
                                                        });
                                                    });

                                                } else {

                                                    var newEvents = eventsFilter.sub(updatedMatch.events.data, match.events);

                                                    if (newEvents.length > 0) {

                                                        console.log(newEvents.length + ' event(s) to be updated for match ' + match.matchId)

                                                        newEvents.forEach(function(event, index) {


                                                            var newEvent = new Event();
                                                            newEvent.eventId = event.id;
                                                            newEvent.matchId = event.match_id;
                                                            newEvent.teamId = event.team_id;
                                                            newEvent.minute = event.minute;
                                                            newEvent.extraMinute = event.extra_min;
                                                            newEvent.type = event.type;
                                                            if (event.hasOwnProperty("player_id")) {
                                                                newEvent.playerId = event.player_id;
                                                            }
                                                            if (event.hasOwnProperty("assist_id")) {
                                                                newEvent.assistPlayerId = event.assist_id;
                                                            }
                                                            if (event.hasOwnProperty("related_event_id")) {
                                                                newEvent.relatedEventId = event.related_event_id;
                                                            }
                                                            if (event.hasOwnProperty("player_in_id")) {
                                                                newEvent.playerInId = event.player_in_id;
                                                            }
                                                            if (event.hasOwnProperty("player_out_id")) {
                                                                newEvent.playerOutId = event.player_out_id;
                                                            }

                                                            newEvent.save(function(savedEventErr, savedEvent) {
                                                                if (savedEventErr) {
                                                                    console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(savedEventErr)));
                                                                    return;
                                                                }
                                                                if (savedEvent) {
                                                                    console.log('existing event added')
                                                                    console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Event ' + savedEvent.eventId + ' added', ''));

                                                                    match.events.push(savedEvent);
                                                                    if (match.events.length == updatedMatch.events.data.length) {

                                                                        match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                                            if (matchUpdateErr) {
                                                                                console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                                                return;
                                                                            }
                                                                            if (savedUpdatedMatch) {
                                                                                console.log('existing match update')
                                                                                console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + savedUpdatedMatch.matchId + ' updated', ''));
                                                                                return;
                                                                            }
                                                                        });
                                                                    }
                                                                    return;
                                                                }
                                                            });

                                                        });
                                                    }
                                                }
                                            }



                                            if (updatedMatch.lineup.data.length > 0) {


                                                match.lineup = [];
                                                match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                    if (matchUpdateErr) {
                                                        console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                        return;
                                                    }
                                                    if (savedUpdatedMatch) {

                                                        updatedMatch.lineup.data.forEach(function(lineup, index) {

                                                            playerLP = {};
                                                            playerLP.playerId = lineup.player_id;
                                                            playerLP.teamId = lineup.team_id;
                                                            if(playerLP.teamId === match.team1Id){
                                                                playerLP.team = "team1";
                                                            } else if(playerLP.teamId === match.team2Id){
                                                                playerLP.team = "team2";
                                                            }
                                                            
                                                            playerLP.position = lineup.position;
                                                            playerLP.shirtNumber = lineup.shirt_number;
                                                            playerLP.assists = lineup.assists;
                                                            playerLP.foulsCommited = lineup.fouls_commited;
                                                            playerLP.foulsDrawn = lineup.fouls_drawn;
                                                            playerLP.goals = lineup.goals;
                                                            playerLP.offsides = lineup.offsides;
                                                            playerLP.missedPenalties = lineup.missed_penalties;
                                                            playerLP.scoredPenalties = lineup.scored_penalties;
                                                            playerLP.posx = lineup.posx;
                                                            playerLP.posy = lineup.posy;
                                                            playerLP.redcards = lineup.redcards;
                                                            playerLP.saves = lineup.saves;
                                                            playerLP.shotsOnGoal = lineup.shots_on_goal;
                                                            playerLP.shotsTotal = lineup.shots_total;
                                                            playerLP.yellowcards = lineup.yellowcards;
                                                            playerLP.type = lineup.type;
                                                            
                                                            match.lineup.push(playerLP);

                                                                if(match.lineup.length == updatedMatch.lineup.data.length){
                                                                     match.save(function(matchUpdateErr, savedUpdatedMatch) {
                                                                        if (matchUpdateErr) {
                                                                            console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchUpdateErr)));
                                                                            return;
                                                                        }
                                                                        if (savedUpdatedMatch) {
                                                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'lineup Added', ''));
                                                                            return;
                                                                        }
                                                                    });
                                                                }
                                                            });      
                                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' Updated', ''));
                                                            return;
                                                    }
                                                });
                                                }
                                            }

                                            if (updatedMatch.weather == null) {
                                                match.weather == null;
                                            } else {
                                                match.weather = {};
                                                match.weather.code = updatedMatch.weather.code;
                                                match.weather.type = updatedMatch.weather.type;
                                                match.weather.icon = updatedMatch.weather.icon;
                                                match.weather.temperature = updatedMatch.weather.temperature.temp;
                                                match.weather.temperatureUnit = updatedMatch.weather.temperature.unit;
                                                match.weather.clouds = updatedMatch.weather.clouds;
                                                match.weather.humidity = updatedMatch.weather.humidity;
                                                match.weather.windSpeed = updatedMatch.weather.windSpeed;
                                                match.weather.windDegree = updatedMatch.weather.windDegree;
                                            }

                                            console.log(responseToConsole(Codes.status.SUCCESS, Codes.httpStatus.OK, 'Match ' + match.matchId + ' Updated', ''));
                                            return;

                                    });
                                }
                            });

                        });
                        // var fixtureUpdateJob = new CronJob({
                        //  cronTime: '*2/',
                        // });
                        // fixtureUpdateJob.start();

                    }
                    return;
                }
            });
        },
        onComplete: function() {
            console.log('Update Fixture Job Stopped');
        },
        start: true
    });
    fixtureAvailCheckJob.start();
}



//calculate points every 1 minute
exports.calculatePointsJob = function() {
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
    console.log('calculatePointsJob inside')
    var calculatePointsJob = new CronJob({

        cronTime: '*/60 * * * * *',
        onTick: function() {

                var twoHoursBefore= moment.utc().subtract('2','h').format("YYYY-MM-DD HH:mm:ss");
                var thirtyMinsAfter = moment.utc().add('30','m').format("YYYY-MM-DD HH:mm:ss");
                console.log('From ' + twoHoursBefore + ' To ' + thirtyMinsAfter);
                 console.log('calculatePointsJob called')
                Match.find({startingDateTime:{$gte:twoHoursBefore, $lt:thirtyMinsAfter}}).populate('events').exec( function(matchesErr, matches){
                    console.log('matches to be calculated ' + matches.length)
                    if(matchesErr){
                           console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
                    }

                    matches.forEach(function(match, index){
                        console.log('Calculating for match ' + match.matchId);

                        var goal = [], goalByAssist = [], goalByPenalty = [], goalByPenaltyMissed = [], goalSave = [], goalByPenaltySave = [], goalOwn = [];
                        var cardRed = [], cardYellow = [], cardYellowRed = [];
                        var substitution = [];

                        var cleanSheet = [];

                        var unrecorded = [];

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
                                        console.log(key + " for player " + _.findWhere(match.lineup,{"playerId":_event.playerInId}));
                                        _.findWhere(match.lineup,{"playerId":_event.playerInId}).points = _.findWhere(match.lineup,{"playerId":_event.playerInId}).points +  computePoints(_.findWhere(match.lineup,{"playerId":_event.playerInId}),key);
                                    } else if(key === "goalByAssist"){
                                        console.log(key + " - goal for player " + _.findWhere(match.lineup,{"playerId":_event.playerId}));
                                        console.log(key + " - assist for player " + _.findWhere(match.lineup,{"playerId":_event.assistPlayerId}));
                                        _.findWhere(match.lineup,{"playerId":_event.playerId}).points = _.findWhere(match.lineup,{"playerId":_event.playerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.playerId}),"goal");
                                        _.findWhere(match.lineup,{"playerId":_event.assistPlayerId}).points = _.findWhere(match.lineup,{"playerId":_event.assistPlayerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.assistPlayerId}),"goalByAssist");
                                    } else {
                                         console.log(key + " for player " + _.findWhere(match.lineup,{"playerId":_event.assistPlayerId}));
                                        _.findWhere(match.lineup,{"playerId":_event.playerId}).points = _.findWhere(match.lineup,{"playerId":_event.playerId}).points + computePoints(_.findWhere(match.lineup,{"playerId":_event.playerId}),key);
                                    }
                                });
                            }
                        });

                        //console.log(match.lineup)
                        match.save(function(matchSaveErr, savedMatch){
                            if (matchSaveErr) {
                                console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.BR, '', Validation.validatingErrors(matchSaveErr)));                                    
                                return;
                            } 

                                MatchCard.find({match:savedMatch.matchId}).populate('match players').exec(function(matchCardErr, matchCard){
                                    if(matchCardErr){
                                        console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.UNEXP_ERROR));
                                        return;
                                    }
                                    
                                    if(matchCard == null){
                                        console.log(responseToConsole(Codes.status.FAILURE, Codes.httpStatus.ISE, '', Codes.errorMsg.F_INV_MID));
                                        return;
                                    }

                                    var lineupInMatch = {};
                                    var matchPoints = 0;
                                    lineupInMatch = savedMatch.lineup;
                                    _.each(lineupInMatch, function(lineup, index, lineups){
                                        _.findWhere(matchCard.players,{"playerId":_lineup.playerId}).points = lineup.points;
                                        matchPoints = matchPoints + _.findWhere(matchCard.players,{"playerId":_lineup.playerId}).points;
                                    });

                                    matchCard.matchPoints = matchPoints
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

                            });

                        });

                    
                    });              
                });
            
        },
        onComplete: function() {
            console.log('Calculate Points Job Stopped');
        },
        start: true
    });
    calculatePointsJob.start();
}






