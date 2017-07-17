/*
 * Created by harirudhra on Sat 11 Feb 2017
 */

var Season = require('../../models/Football/Season');
var Match = require('../../models/Football/Match');
var Team = require('../../models/Football/Master/Team');

var Codes = require('../../Codes');

exports.getRoster = function(req, res){

	Match.findOne({matchId:req.params.matchId}).select('team1Id team2Id').exec(function(matchErr, match){
		console.log(req.params)
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


		Team.find({teamId:match.team1Id}).select('-_id -__v -competitions -name').populate('players','-active -teams -position -_id -__v').exec(function(team1Err, team1){
			if(team1Err){
				res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
	       	 return;
			}

				Team.find({teamId:match.team2Id}).select('-_id -__v -competitions -name').populate('players','-active -teams -position -_id -__v').exec(function(team2Err, team2){
				if(team2Err){
					res.status(Codes.httpStatus.ISE).json({
		            status: Codes.status.FAILURE,
		            code: Codes.httpStatus.ISE,
		            data: '',
		            error: Codes.errorMsg.UNEXP_ERROR
		        });
		       	 return;
				}

					var fixture = {};
					fixture.team1 = team1[0];
					fixture.team2 = team2[0];
					var players=[];
				for(var i=0;i<fixture.team1.players.length;i++){
					var theColor=getRosterColorCode(fixture.team1.players[i].positionId);
					players.push({
						colorCode: theColor,
						iconId:"selected_"+fixture.team1.players[i].playerId,
						id:fixture.team1.players[i].playerId,
						logo:fixture.team1.logo,
						name:fixture.team1.players[i].name,
						position:fixture.team1.players[i].positionId,
						teamId:fixture.team1.teamId
						});

				}
				for(var i=0;i<fixture.team2.players.length;i++){
					var theColor=getRosterColorCode(fixture.team2.players[i].positionId);
					players.push({
						colorCode: theColor,
						iconId:"selected_"+fixture.team2.players[i].playerId,
						id:fixture.team2.players[i].playerId,
						logo:fixture.team2.logo,
						name:fixture.team2.players[i].name,
						position:fixture.team2.players[i].positionId,
						teamId:fixture.team2.teamId
						});

				}
				var totalRoster=splitRoster(players);
				var fwd=totalRoster[0];
				var mid=totalRoster[1];
				var def=totalRoster[2];
				var gk=totalRoster[3];

					res.status(Codes.httpStatus.OK).json({
						status: Codes.status.SUCCESS,
						code: Codes.httpStatus.OK,
						data: {
							all: shuffleJSON(players),
							fwd: shuffleJSON(fwd),
							mid: shuffleJSON(mid),
							def: shuffleJSON(def),
							gk: shuffleJSON(gk)
						},
						error: ''
					});
					return;

					});
				});

		});
}

function splitRoster(players){
var fwd=[];
var mid=[];
var def=[];
var gk=[];
	for(var i=0;i<players.length;i++){
		var pos=players[i].position;
		if(pos==1)
			gk.push(players[i]);
		else if(pos==2)
			def.push(players[i]);
		else if(pos==3)
			mid.push(players[i]);
		else if(pos==4)
			fwd.push(players[i]);
	}

	return [fwd,mid,def,gk];
};

function getRosterColorCode(pos){
	var cc;
	switch(pos){
		case '1':
			cc="#e67e22";
			break;
		case '2':
			cc="#f1c40f";
			break;
		case '3':
			cc="#2ecc71";
			break;
		case '4':
			cc="#3498db";
			break;
		default:
			cc="#9b59b6";
			break;

		}
	return cc;
};

function shuffleJSON(arr){
	var currentIndex = arr.length,temporaryValue,randomIndex;
	while(0!==currentIndex){
		randomIndex=Math.floor(Math.random()*currentIndex);
		currentIndex-=1;
		temporaryValue=arr[currentIndex];
		arr[currentIndex]=arr[randomIndex];
		arr[randomIndex]=temporaryValue;
	}
	return arr;
}
