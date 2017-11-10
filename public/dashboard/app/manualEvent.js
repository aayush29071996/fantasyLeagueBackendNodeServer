dashBoard.controller('eventCtrl', function($scope, $q, Football, $filter) {

    $scope.initFunction = function() {
        $scope.showFootEvent = true;
        $scope.eventTab = [{
            "tab": "New Tab"
        }];
        $scope.squence = "100";

        $scope.eventSchedule = [{
            "event_id": "",
            "event_name": "",
            "player_id": "",
            "player_name": "",
            "event_time": "",
            "points": "",
            "last_event": true,
            "submitted": false,
            "highScore": false
        }];

        $scope.events = [{
                "value": "Goal Scored",
                "name": "Goal Scored"
            },
            {
                "value": "Assist",
                "name": "Assist"
            }, {
                "value": "Yellow Card",
                "name": "Yellow Card"
            }, {
                "value": "Red Card",
                "name": "Red Card"
            },
            {
                "value": "CleanSheet",
                "name": "CleanSheet"
            }, {
                "value": "Penalty Saves",
                "name": "Penalty Saves"
            }, {
                "value": "Penalty Goal",
                "name": "Penalty Goal"
            }, {
                "value": "Penalty miss",
                "name": "Penalty miss"
            },
            {
                "value": "Own Goal",
                "name": "Own Goal"
            }, {
                "value": "Saves",
                "name": "Saves"
            }, {
                "value": "play 60mins",
                "name": "Play 60mins"
            }, {
                "value": "Play more 60mins",
                "name": "Play more 60mins"
            }, {
                "value": "Highest goalscorer",
                "name": "Highest goalscorer"
            }, {
                "value": "3 goasls conceded GK or Def",
                "name": "3 goasls conceded GK or Def"
            }
        ];

        $scope.error = {
            "event_id": false,
            "event_name": false,
            "player_id": false,
            "player_name": false,
            "event_time": false,
            "points": false
        };
        $scope.matchSubmit = false;
    };

    var validation = function(index) {
        var returnValue = false;
        if ($scope.eventSchedule[index].event_id == "") {
            $scope.error.event_id = true;
            returnValue = false;
        } else {
            $scope.error.event_id = false;
            returnValue = true;
        }
        if ($scope.eventSchedule[index].event_name == "") {
            $scope.error.event_name = true;
            returnValue = false;
        } else {
            $scope.error.event_name = false;
            returnValue = true;
        }
        if ($scope.eventSchedule[index].player_id == "") {
            $scope.error.player_id = true;
            returnValue = false;
        } else {
            $scope.error.player_id = false;
            returnValue = true;
        }
        if ($scope.eventSchedule[index].player_name == "") {
            $scope.error.player_name = true;
            returnValue = false;
        } else {
            $scope.error.player_name = false;
            returnValue = true;
        }
        if ($scope.eventSchedule[index].event_time == "") {
            $scope.error.event_time = true;
            returnValue = false;
        } else {
            $scope.error.event_time = false;
            returnValue = true;
        }
        if ($scope.eventSchedule[index].points == "") {
            $scope.error.points = true;
            returnValue = false;
        } else {
            $scope.error.points = false;
            returnValue = returnValue;
        }
        return returnValue;
    };
    $scope.addEvent = function() {
        if ($scope.matchId != "") {
            $scope.eventSchedule[$scope.eventSchedule.length - 1].last_event = false;
            $scope.eventSchedule.push({
                "event_id": $scope.matchId + $scope.squence,
                "event_name": "",
                "player_id": "",
                "player_name": "",
                "event_time": "",
                "points": "",
                "last_event": true,
                "submitted": false
            });
            $scope.squence++;
        } else {
            alert("No Match Info Available");
        }
    };

    $scope.startMatch = function(valid) {
        $scope.matchSubmit = true;
        if (valid) {
            $scope.eventTab[$scope.eventTab.length - 1].tab = $scope.matchId;
            $scope.eventSchedule[$scope.eventTab.length - 1].event_id = $scope.matchId + $scope.squence;
            $scope.squence++;
            var playerPromise = "";
            $scope.matchSubmit = false;
            $q.all([
                playerPromise = Football.getMatchLP($scope.matchId)
            ]).then(function() {
                playerPromise.then(function(res) {
                    $scope.playerList = res.data.data;
                });
            });
        }
    };

    $scope.getPlayer = function(index) {
        for (var i = 0; i < $scope.playerList.length; i++) {
            if ($scope.eventSchedule[index].player_name == $scope.playerList[i].playerName) {
                $scope.eventSchedule[index].player_id = $scope.playerList[i].playerId;
            }
        }
        if ($scope.eventSchedule[index].event_name != "") {
            $scope.getPoint(index);
        }
    };

    $scope.getPoint = function(index) {
        if ($scope.eventSchedule[index].event_name == "Goal Scored") {
            for (var i = 0; i < $scope.playerList.length; i++) {
                if ($scope.playerList[i].playerId == $scope.eventSchedule[index].player_id) {
                    if ($scope.playerList[i].playerPositionId == "1") {
                        $scope.eventSchedule[index].points = "6";
                    } else if ($scope.playerList[i].playerPositionId == "2") {
                        $scope.eventSchedule[index].points = "6";
                    } else if ($scope.playerList[i].playerPositionId == "3") {
                        $scope.eventSchedule[index].points = "5";
                    } else {
                        $scope.eventSchedule[index].points = "4";
                    }
                }
            }
        } else if ($scope.eventSchedule[index].event_name == "Assist") {
            for (var assist = 0; assist < $scope.playerList.length; assist++) {
                if ($scope.playerList[assist].playerId == $scope.eventSchedule[index].player_id) {
                    if ($scope.playerList[assist].playerPositionId == "1") {
                        $scope.eventSchedule[index].points = "3";
                    } else if ($scope.playerList[assist].playerPositionId == "2") {
                        $scope.eventSchedule[index].points = "3";
                    } else if ($scope.playerList[assist].playerPositionId == "3") {
                        $scope.eventSchedule[index].points = "4";
                    } else {
                        $scope.eventSchedule[index].points = "3";
                    }
                }
            }
        } else if ($scope.eventSchedule[index].event_name == "Yellow Card") {
            $scope.eventSchedule[index].points = "-1";
        } else if ($scope.eventSchedule[index].event_name == "Red Card") {
            $scope.eventSchedule[index].points = "-3";
        } else if ($scope.eventSchedule[index].event_name == "CleanSheet") {
            for (var cleanSheet = 0; cleanSheet < $scope.playerList.length; cleanSheet++) {
                if ($scope.playerList[cleanSheet].playerId == $scope.eventSchedule[index].player_id) {
                    if ($scope.playerList[cleanSheet].playerPositionId == "1") {
                        $scope.eventSchedule[index].points = "4";
                    } else if ($scope.playerList[cleanSheet].playerPositionId == "2") {
                        $scope.eventSchedule[index].points = "3";
                    } else if ($scope.playerList[cleanSheet].playerPositionId == "3") {
                        $scope.eventSchedule[index].points = "1";
                    } else {
                        $scope.eventSchedule[index].points = "0";
                    }
                }
            }
        } else if ($scope.eventSchedule[index].event_name == "Saves") {
            for (var goalSave = 0; goalSave < $scope.playerList.length; goalSave++) {
                if ($scope.playerList[goalSave].playerId == $scope.eventSchedule[index].player_id) {
                    if ($scope.playerList[goalSave].playerPositionId == "1") {
                        alert("Please enter value in manual");
                        $scope.eventSchedule[index].points = "";
                    } else if ($scope.playerList[goalSave].playerPositionId == "2") {
                        alert("Please enter value in manual");
                        $scope.eventSchedule[index].points = "";
                    }
                }
            }
        } else if ($scope.eventSchedule[index].event_name == "Penalty Saves") {
            for (var pSaves = 0; pSaves < $scope.playerList.length; pSaves++) {
                if ($scope.playerList[pSaves].playerId == $scope.eventSchedule[index].player_id) {
                    if ($scope.playerList[pSaves].playerPositionId == "1") {
                        $scope.eventSchedule[index].points = "4";
                    }
                }
            }
        } else if ($scope.eventSchedule[index].event_name == "Penalty Goal") {
            $scope.eventSchedule[index].points = "2";
        } else if ($scope.eventSchedule[index].event_name == "Penalty miss") {
            $scope.eventSchedule[index].points = "-2";
        } else if ($scope.eventSchedule[index].event_name == "Own Goal") {
            $scope.eventSchedule[index].points = "-2";
        } else if ($scope.eventSchedule[index].event_name == "play 60mins") {
            $scope.eventSchedule[index].points = "1";
        } else if ($scope.eventSchedule[index].event_name == "Play more 60mins") {
            $scope.eventSchedule[index].points = "2";
        } else if ($scope.eventSchedule[index].event_name == "Highest goalscorer") {
            $scope.eventpoints = [];
            for (var goals = 0; goals < $scope.eventSchedule.length; goals++) {
                if ($scope.eventSchedule[goals].highScore) {
                    $scope.eventpoints.push($scope.eventSchedule[goals]);
                }
            }
            if ($scope.eventpoints.length == 1) {
                $scope.eventSchedule[index].event_name = "";
                $scope.eventSchedule[index].points = "";
                alert("Already player select high score");
            } else {
                $scope.eventSchedule[index].points = "3";
                $scope.eventSchedule[index].highScore = true;
            }
        } else {
            for (var cond = 0; cond < $scope.playerList.length; cond++) {
                if ($scope.playerList[cond].playerId == $scope.eventSchedule[index].player_id) {
                    if ($scope.playerList[cond].playerPositionId == "1") {
                        $scope.eventSchedule[index].points = "-1";
                    } else if ($scope.playerList[cond].playerPositionId == "2") {
                        $scope.eventSchedule[index].points = "-1";
                    } else {
                        $scope.eventSchedule[index].event_name = "";
                        $scope.eventSchedule[index].points = "";
                        alert("please select goal keeper or Defender");
                    }
                }
            }
        }
    };


    $scope.createEvent = function(index) {
        if (validation(index)) {

            var minute = timeToMinutes($scope.eventSchedule[index].event_time);
            var model = {
                "eventId": $scope.eventSchedule[index].event_id,
                "type": $scope.eventSchedule[index].event_name,
                "matchId": $scope.matchId,
                "minute": minute,
                "playerId": $scope.eventSchedule[index].player_id,
                "playerName": $scope.eventSchedule[index].player_name,
                "eventPoints": parseInt($scope.eventSchedule[index].points)
            };
            console.log(model);
            Football.creatEvent(model).then(function(res) {
                if (res.data.status == "success") {
                    alert("Event Added" + " " + $scope.matchId);
                    $scope.eventSchedule[index].submitted = true;
                } else {
                    alert(res.data.error);
                }
            }, function(err) {
                console.log(err);
                alert(JSON.stringify(err));
            });
        }
    };

    function timeToMinutes(time) {
        var hours = (new Date(time)).getHours() * 60;
        var minutes = (new Date(time)).getMinutes();
        time = hours + minutes;
        console.log(time);
        return time;
    }

    $scope.createTab = function() {
        $scope.eventTab.push({
            "tab": "New Tab"
        });
    };
    $scope.initFunction();
});