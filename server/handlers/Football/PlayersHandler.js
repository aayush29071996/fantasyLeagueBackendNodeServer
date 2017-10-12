/*
 * Created by harirudhra on Fri 17 Feb 2017
 */

var request = require('request');
var Promise = require("bluebird");


var Team = require('../../models/Football/Master/Team');
var Player = require('../../models/Football/Master/Player');


var Codes = require('../../Codes');
var Validation = require('../../controllers/Validation');

// var API_TOKEN_OLD = "H7H9qU3lmK1UNpqQoNxBI2PkZJec2IMAcNhByMSQ1GWhAt5tUDVtobVc1ThK";
var API_TOKEN = "EyTtWbGs9ZnUYam1xB63iXoJ4EZ4TuTKGmQaebB1tpsrxq5VcdQ3gPVgjMyz";
// var baseUrl = "https://api.soccerama.pro/v1.2/";
var baseUrl = "https://soccer.sportmonks.com/api/v2.0/";

var fireUrl = function(params, include, teamIndex) {
    console.log('firing url : ' + baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include + " ---- " + teamIndex);
    return baseUrl + params + "?api_token=" + API_TOKEN + "&include=" + include;
};


exports.populatePlayersForAllTeams = function(req, res) {

    Team.find({}, function(teamErr, teams) {

        if (teamErr) {
            res.status(Codes.httpStatus.ISE).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.ISE,
                data: '',
                error: Codes.errorMsg.UNEXP_ERROR
            });
            return;
        }
        if (teams.length == 0) {
            res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.T_NO
            });
            return;
        }

        if (teams.length > 0) {
            teams.forEach(function(team, teamIndex) {

                include = 'squad.player'
                params = 'teams/' + team.teamId;

                // if(teamIndex >= 900 && teamIndex < 1000){

                request.get(fireUrl(params, include, teamIndex), function(err, response, data) {
                    // console.log('team no ' + teamIndex + " with id " + team.teamId);

                    if (err) {
                    	console.log(err);
                        res.status(Codes.httpStatus.ISE).json({
                            status: Codes.status.FAILURE,
                            code: Codes.httpStatus.ISE,
                            data: '',
                            error: Codes.errorMsg.UNEXP_ERROR + " " + err
                        });
                        return;
                    }

                    if (response.statusCode == Codes.httpStatus.NF) {
                        res.status(Codes.httpStatus.BR).json({
                            status: Codes.status.FAILURE,
                            code: Codes.httpStatus.BR,
                            data: '',
                            error: Codes.errorMsg.INVALID_REQ
                        });
                        return;

                    }

                    if (response.statusCode == Codes.httpStatus.UNAUTH) {
                        res.status(Codes.httpStatus.UNAUTH).json({
                            status: Codes.status.FAILURE,
                            code: Codes.httpStatus.UNAUTH,
                            data: '',
                            error: Codes.errorMsg.UNAUTH_KEY
                        });
                        return;
                    }

                    if (response.statusCode == Codes.httpStatus.OK) {
                        data = JSON.parse(data);

                        if (data.hasOwnProperty("error")) {
                            if (data.error.code == Codes.httpStatus.ISE) {
                                res.status(Codes.httpStatus.BR).json({
                                    status: Codes.status.FAILURE,
                                    code: Codes.httpStatus.BR,
                                    data: '',
                                    error: Codes.errorMsg.INVALID_REQ
                                });
                                return;
                            }
                        }

                        data = data.data.squad.data;

                        // console.log(Object.keys(data))


                        data.forEach(function(player, playerIndex) {


                            var playerx = player;
                            player = player.player.data;

                            console.log('team index -->' + teamIndex)


                            Player.findOne({ playerId: player.player_id }).exec(function(playerErr, playerObj) {
                                if (playerErr) {
                                    res.status(Codes.httpStatus.ISE).json({
                                        status: Codes.status.FAILURE,
                                        code: Codes.httpStatus.ISE,
                                        data: '',
                                        error: Codes.errorMsg.UNEXP_ERROR
                                    });
                                    return;
                                }

                                if (playerObj != null) {

                                    if (playerObj.teams.length > 0) {
                                        console.log('adding new team to player reference');

                                        console.log('existing:' + playerObj.teams);
                                        console.log('team:' + team._id);
                                        console.log('Index Of: ' + playerObj.teams.indexOf(team._id));

                                        if (playerObj.teams.indexOf(team._id) == -1) {
                                            console.log('new team');
                                            playerObj.teams.push(team._id);
                                            playerObj.save(function (playerSaveErr, savedPlayer) {
                                                if (playerSaveErr) {
                                                    console.log('playerSaveErr')
                                                    res.status(Codes.httpStatus.BR).json({
                                                        status: Codes.status.FAILURE,
                                                        code: Codes.httpStatus.BR,
                                                        data: '',
                                                        error: Validation.validatingErrors(playerSaveErr)
                                                    });
                                                    return;
                                                }
                                            });







                                        }
                                    }

                                    console.log('player with id ' + playerObj.playerId + ' and name ' + playerObj.name + ' already exists')


                                    return false;
                                }

                                if (playerObj == null) {
                                    console.log('adding new player with position ID ' + player.position_id  )
                                    var newPlayer = new Player();
                                    newPlayer.playerId = player.player_id;
                                    newPlayer.name = player.common_name;
                                    newPlayer.teams.push(team);
                                    // if (player.hasOwnProperty('position')) {
                                    newPlayer.positionId = player.position_id;
                                    var posName = "X";
                                    if(player.position_id === "1" || player.position_id == 1){
                                        posName = "G";
                                    } else if(player.position_id === "2" || player.position_id == 2){
                                        posName = "D";
                                    } else if(player.position_id === "3" || player.position_id == 3){
                                        posName = "M";
                                    } else if(player.position_id === "4" || player.position_id == 4){
                                        posName = "F";
                                    } 
                                    newPlayer.position = posName;
                                    // }
                                    newPlayer.save(function(playerSaveErr, savedPlayer) {
                                        if (playerSaveErr) {
                                            console.log('playerSaveErr')
                                            res.status(Codes.httpStatus.BR).json({
                                                status: Codes.status.FAILURE,
                                                code: Codes.httpStatus.BR,
                                                data: '',
                                                error: Validation.validatingErrors(playerSaveErr)
                                            });
                                            return;
                                        }

                                        Team.findOne({ teamId: team.teamId }, function(teamErr, team) {
                                            if (teamErr) {
                                                console.log('teamErr')
                                                res.status(Codes.httpStatus.BR).json({
                                                    status: Codes.status.FAILURE,
                                                    code: Codes.httpStatus.BR,
                                                    data: '',
                                                    error: Validation.validatingErrors(teamErr)
                                                });
                                                return;
                                            }

                                            team.players.push(savedPlayer);

                                                team.save(function (teamSaveErr, savedTeam) {
                                                    if (teamSaveErr) {
                                                        console.log('teamSaveErr')
                                                        res.status(Codes.httpStatus.BR).json({
                                                            status: Codes.status.FAILURE,
                                                            code: Codes.httpStatus.BR,
                                                            data: '',
                                                            error: Validation.validatingErrors(teamSaveErr)
                                                        });
                                                        return;
                                                    }
                                                    if (teamIndex == teams.length - 1) {
                                                        res.status(Codes.httpStatus.OK).json({
                                                            status: Codes.status.SUCCESS,
                                                            code: Codes.httpStatus.OK,
                                                            data: 'populated all players for all teams',
                                                            error: ''
                                                        });
                                                        return;
                                                    }

                                                });






                                        });
                                    });
                                }
                            });

                        });
                    }
                });
            // }//'if' ends with this brace
            });
        }

    });

}







// IMPLEMENTED BY AAYUSH PATEL USING PROMISES

exports.populatePlayersForAllTeamsPromise = function(req, res) {



    Team.find({}, function(teamErr, teams) {

        if (teamErr) {
            res.status(Codes.httpStatus.ISE).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.ISE,
                data: '',
                error: Codes.errorMsg.UNEXP_ERROR
            });
            return;
        }
        if (teams.length == 0) {
            res.status(Codes.httpStatus.OK).json({
                status: Codes.status.SUCCESS,
                code: Codes.httpStatus.OK,
                data: '',
                error: Codes.errorMsg.T_NO
            });
            return;
        }

        if (teams.length > 0) {
            teams.forEach(function(team, teamIndex) {

                include = 'squad.player'
                params = 'teams/' + team.teamId;

                // if(teamIndex >= 900 && teamIndex < 1000){

                request.get(fireUrl(params, include, teamIndex), function(err, response, data) {
                    // console.log('team no ' + teamIndex + " with id " + team.teamId);

                    if (err) {
                        console.log(err);
                        res.status(Codes.httpStatus.ISE).json({
                            status: Codes.status.FAILURE,
                            code: Codes.httpStatus.ISE,
                            data: '',
                            error: Codes.errorMsg.UNEXP_ERROR + " " + err
                        });
                        return;
                    }

                    if (response.statusCode == Codes.httpStatus.NF) {
                        res.status(Codes.httpStatus.BR).json({
                            status: Codes.status.FAILURE,
                            code: Codes.httpStatus.BR,
                            data: '',
                            error: Codes.errorMsg.INVALID_REQ
                        });
                        return;

                    }

                    if (response.statusCode == Codes.httpStatus.UNAUTH) {
                        res.status(Codes.httpStatus.UNAUTH).json({
                            status: Codes.status.FAILURE,
                            code: Codes.httpStatus.UNAUTH,
                            data: '',
                            error: Codes.errorMsg.UNAUTH_KEY
                        });
                        return;
                    }

                    if (response.statusCode == Codes.httpStatus.OK) {
                        data = JSON.parse(data);

                        if (data.hasOwnProperty("error")) {
                            if (data.error.code == Codes.httpStatus.ISE) {
                                res.status(Codes.httpStatus.BR).json({
                                    status: Codes.status.FAILURE,
                                    code: Codes.httpStatus.BR,
                                    data: '',
                                    error: Codes.errorMsg.INVALID_REQ
                                });
                                return;
                            }
                        }

                        data = data.data.squad.data;

                        // console.log(Object.keys(data))

                        var playerArray = data;


                  var fn =  function playerSeeding(player, playerIndex) {


                            var playerx = player;
                            player = player.player.data;

                            console.log('team index -->' + teamIndex)


                            Player.findOne({ playerId: player.player_id }).exec(function(playerErr, playerObj) {
                                if (playerErr) {
                                    res.status(Codes.httpStatus.ISE).json({
                                        status: Codes.status.FAILURE,
                                        code: Codes.httpStatus.ISE,
                                        data: '',
                                        error: Codes.errorMsg.UNEXP_ERROR
                                    });
                                    return;
                                }

                                if (playerObj != null) {

                                    if (playerObj.teams.length > 0) {
                                        console.log('adding new team to player reference');

                                        console.log('existing:' + playerObj.teams);
                                        console.log('team:' + team._id);
                                        console.log('Index Of: ' + playerObj.teams.indexOf(team._id));

                                        if (playerObj.teams.indexOf(team._id) == -1) {
                                            console.log('new team');
                                            playerObj.teams.push(team._id);
                                            playerObj.save(function (playerSaveErr, savedPlayer) {
                                                if (playerSaveErr) {
                                                    console.log('playerSaveErr')
                                                    res.status(Codes.httpStatus.BR).json({
                                                        status: Codes.status.FAILURE,
                                                        code: Codes.httpStatus.BR,
                                                        data: '',
                                                        error: Validation.validatingErrors(playerSaveErr)
                                                    });
                                                    return;
                                                }
                                            });







                                        }
                                    }

                                    console.log('player with id ' + playerObj.playerId + ' and name ' + playerObj.name + ' already exists')


                                    return false;
                                }

                                if (playerObj == null) {
                                    console.log('adding new player with position ID ' + player.position_id  )
                                    var newPlayer = new Player();
                                    newPlayer.playerId = player.player_id;
                                    newPlayer.name = player.common_name;
                                    newPlayer.teams.push(team);
                                    // if (player.hasOwnProperty('position')) {
                                    newPlayer.positionId = player.position_id;
                                    var posName = "X";
                                    if(player.position_id === "1" || player.position_id == 1){
                                        posName = "G";
                                    } else if(player.position_id === "2" || player.position_id == 2){
                                        posName = "D";
                                    } else if(player.position_id === "3" || player.position_id == 3){
                                        posName = "M";
                                    } else if(player.position_id === "4" || player.position_id == 4){
                                        posName = "F";
                                    }
                                    newPlayer.position = posName;
                                    // }
                                    newPlayer.save(function(playerSaveErr, savedPlayer) {
                                        if (playerSaveErr) {
                                            console.log('playerSaveErr')
                                            res.status(Codes.httpStatus.BR).json({
                                                status: Codes.status.FAILURE,
                                                code: Codes.httpStatus.BR,
                                                data: '',
                                                error: Validation.validatingErrors(playerSaveErr)
                                            });
                                            return;
                                        }

                                        Team.findOne({ teamId: team.teamId }, function(teamErr, team) {
                                            if (teamErr) {
                                                console.log('teamErr')
                                                res.status(Codes.httpStatus.BR).json({
                                                    status: Codes.status.FAILURE,
                                                    code: Codes.httpStatus.BR,
                                                    data: '',
                                                    error: Validation.validatingErrors(teamErr)
                                                });
                                                return;
                                            }

                                            team.players.push(savedPlayer);

                                            team.save(function (teamSaveErr, savedTeam) {
                                                if (teamSaveErr) {
                                                    console.log('teamSaveErr')
                                                    res.status(Codes.httpStatus.BR).json({
                                                        status: Codes.status.FAILURE,
                                                        code: Codes.httpStatus.BR,
                                                        data: '',
                                                        error: Validation.validatingErrors(teamSaveErr)
                                                    });
                                                    return;
                                                }
                                                if (teamIndex == teams.length - 1) {
                                                    res.status(Codes.httpStatus.OK).json({
                                                        status: Codes.status.SUCCESS,
                                                        code: Codes.httpStatus.OK,
                                                        data: 'populated all players for all teams',
                                                        error: ''
                                                    });
                                                    return;
                                                }

                                            });


                                        });
                                    });
                                }
                            });

                        }


                        var actions = playerArray.map(fn);
                        var results = Promise.all(actions);
                        console.log(results);



                    }
                });
                // }//'if' ends with this brace
            });
        }

    });

}