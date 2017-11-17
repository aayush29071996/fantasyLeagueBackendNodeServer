dashBoard.controller('eventCtrl', function($scope, $q, Football, $filter, $compile, $stateParams) {

    $scope.initFunction = function() {
        $scope.matchId = $stateParams.id;
        console.log($scope.matchId);
        $scope.showFootEvent = true;
        $scope.eventTab = [{
            "tab": "New Tab",
            "value": 1
        }];
        $scope.tabs = $scope.eventTab[0].value;
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
            "highScore": false,
            "indent": 1
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
        $scope.getUpcomingMatch();
        $scope.startMatch(true);
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

    $scope.getUpcomingMatch = function() {
        $scope.UpcomingMatchPromise = Football.getUpcomingMatches().then(function(resp) {
            $scope.upcomingMatches = [];
            for (var i = 0; i < resp.data.data.length; i++) {
                if ($scope.matchId == resp.data.data[i].match.matchId) {
                    $scope.upcomingMatches.push(resp.data.data[i]);
                }
            }
            console.log($scope.upcomingMatches);
        });
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
                "dee" : false,
                "last_event": true,
                "submitted": false,
                "indent": $scope.eventSchedule[$scope.eventSchedule.length - 1].indent + 1
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
                    $scope.disableMatch = true;
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
                        $scope.eventSchedule[index].player_id = "";
                    } else if ($scope.playerList[goalSave].playerPositionId == "3") {
                        alert("Please select defender or goalkeeper");
                        $scope.eventSchedule[index].player_name = "";
                        $scope.eventSchedule[index].player_id = "";
                    } else {
                        alert("Please select defender or goalkeeper");
                        $scope.eventSchedule[index].player_name = "";
                        $scope.eventSchedule[index].player_id = "";
                    }
                }
            }
        } else if ($scope.eventSchedule[index].event_name == "Penalty Saves") {
            for (var pSaves = 0; pSaves < $scope.playerList.length; pSaves++) {
                if ($scope.playerList[pSaves].playerId == $scope.eventSchedule[index].player_id) {
                    if ($scope.playerList[pSaves].playerPositionId == "1") {
                        $scope.eventSchedule[index].points = "4";
                    } else if ($scope.playerList[pSaves].playerPositionId == "2") {
                        alert("Please select goalkeeper");
                        $scope.eventSchedule[index].player_id = "";
                        $scope.eventSchedule[index].player_name = "";
                    } else if ($scope.playerList[pSaves].playerPositionId == "2") {
                        alert("Please select goalkeeper");
                        $scope.eventSchedule[index].player_id = "";
                        $scope.eventSchedule[index].player_name = "";
                    } else {
                        alert("Please select goalkeeper");
                        $scope.eventSchedule[index].player_id = "";
                        $scope.eventSchedule[index].player_name = "";
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

//edited by yashvanth
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
                    $scope.eventSchedule[index].dee = true;
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
        // $scope.eventTab.push({
        //     "tab": "New Tab",
        //     value: $scope.eventTab[$scope.eventTab.length - 1].value + 1
        // });
        // $scope.tabs = $scope.eventTab[$scope.eventTab.length - 1].value;
        // $scope.dynamicInitFunction();
    };

    $scope.switchTab = function(tabName) {
        $scope.tabs = tabName;
        $scope.dynamicScope = $scope.tabs - 1;
        $scope.eventScope = "eventSchedule" + tabName;
    };

    $scope.navigateTab = function(tab) {
        return $scope.tabs == tab;
    };

    // Dynamic Functions

    $scope.dynamicInitFunction = function() {
        $scope.dynamicIndent = $scope.eventTab[$scope.eventTab.length - 1].value;
        $scope.eventScope = "eventSchedule" + $scope.dynamicIndent;
        $scope.dynamicScope = $scope.dynamicIndent - 1;
        $scope[$scope.eventScope] = [{
            "event_id": "",
            "event_name": "",
            "player_id": "",
            "player_name": "",
            "event_time": "",
            "points": "",
            "last_event": true,
            "submitted": false,
            "highScore": false,
            "indent": $scope.dynamicScope + 1
        }];

        //once Scope
        var getDynamicScope = $scope.dynamicScope;
        var htmlContent = $(`<div class="eventTab" ng-show="eventTab[${{getDynamicScope}}].value">
        nammmmmwemwmemwewmew,emw,me,wme,mw,emw,e {{eventTab[eventTab.length-1].value}}
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 event-bg">
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                            <div class="match-contain">
                                <h4>Enter Match Id</h4>
                                <form method="post" name="matchForm" class="text-center" novalidate>
                                    <div>
                                        <input type="text" placeholder="Match ID" name="matchId{{dynamicScope}}" id="matchId{{dynamicScope}}" required>
                                        <span class="error" ng-show="(matchForm{{dynamicScope}}.matchId{{dynamicScope}}.$invalid && !matchForm{{dynamicScope}}.matchId{{dynamicScope}}.$pristine) || (matchForm{{dynamicScope}}.matchId{{dynamicScope}}.$error.required)">Match ID is required</span>
                                    </div>
                                    <button type="submit">Start</button>
                                </form>
                            </div>
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                            <div class="match-detail">
                                <div class="match-squence">
                                    <div class="left-container">
                                        <img src="https://cdn.sportmonks.com/images/soccer/teams/19/19.png" alt="">
                                        <p>Arsenal</p>
                                    </div>
                                    <span>VS</span>
                                    <div class="right-container">
                                        <p>Leicester City</p>
                                        <img src="https://cdn.sportmonks.com/images/soccer/teams/6/6.png" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 col-md-12 event-bg">
                        <div class="event-calculate">
                            <ul class="event-header">
                                <li>Serial No</li>
                                <li>Event ID</li>
                                <li>Event Name</li>
                                <li>Player ID</li>
                                <li>Player Name</li>
                                <li>Event Time</li>
                                <li>Points Secured</li>
                                <li></li>
                            </ul>
                            <div class="event-pointsection">
                                <div class="events-section" ng-class="{matchFixed : eventSchedule.length>6}">
                                    <ul>
                                        <li ng-repeat="event in eventSchedule">
                                            <div>{{$index+1}}</div>
                                            <div>
                                                <input type="text" ng-model="event.event_id" disabled>
                                                <span ng-show="error.event_id" class="error">*</span>
                                            </div>
                                            <div>
                                                <span ng-show="error.event_name" class="error">*</span>
                                                <select ng-model="event.event_name" ng-change="getPoint($index)">
                                        <option ng-repeat="events in events" value="{{events.value}}">
                                            {{events.name}}
                                        </option>
                                    </select>
                                            </div>
                                            <div>
                                                <input type="text" ng-model="event.player_id" disabled>
                                                <span ng-show="error.player_id" class="error">*</span>
                                            </div>
                                            <div>
                                                <select ng-model="event.player_name" ng-change="getPlayer($index)">
                                        <option ng-repeat="player in playerList" value="{{player.playerName}}">
                                            {{player.playerName}}
                                        </option>
                                    </select>
                                                <span ng-show="error.player_name" class="error">*</span>
                                            </div>
                                            <div><input type="time" ng-model="event.event_time">
                                                <span ng-show="error.event_time" class="error">*</span>
                                            </div>
                                            <div><input type="text" ng-model="event.points">
                                                <span ng-show="error.points" class="error">*</span></div>
                                            <div>
                                                <button type="button" ng-click="createEvent($index)" ng-disabled="submitted">Submit</button>
                                                <a href="javascript:void(0)" ng-click="addEvent()" ng-show="event.last_event">+</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="match-end">
                                    <button type="button">Match Completed</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`);
        angular.element('.event-tanSection').append($compile(htmlContent)($scope));
        $(".eventTab").addClass(dynamicScope);
    };

    $scope[$scope.dynamicStartMatch] = function() {
        console.log($scope[dynamicmatchId]);
    };
    $scope.initFunction();
});