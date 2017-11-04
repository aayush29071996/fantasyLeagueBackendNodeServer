/**
 * @Filename : upcomingController.js
 * @Description : 
 * @Author : Patharraj
 * @Date : Oct 15, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0         15-10-17    Patharraj     File Created         
 */

/**
 * @ngdoc controller
 * @name upcomingController
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('upcomingCtrl', upcomingCtrl);
    upcomingCtrl.$inject = ["$scope", "$rootScope", "$commons", "$logger", "fandomService", "exceptionService", "$window", "$filter", "$q", "Socialshare"];

    function upcomingCtrl($scope, $rootScope, $commons, $logger, fandomService, exceptionService, $window, $filter, $q, Socialshare) {

        $scope.initFunction = function() {
            $scope.matchDetails = JSON.parse(window.sessionStorage.match);
            $scope.userDetailInfo = JSON.parse(window.sessionStorage.userDetail);
            $scope.countdown = $scope.matchDetails.starts;
            $scope.home = {
                "id": $scope.matchDetails.teams.team1.teamId,
                "name": $scope.matchDetails.teams.team1.name
            };
            $scope.away = {
                "id": $scope.matchDetails.teams.team2.teamId,
                "name": $scope.matchDetails.teams.team2.name
            };
            $scope.playerTab = 'all';
            $scope.playType = {
                "def": true,
                "mid": true,
                "fk": true,
                "gk": true
            };
            $scope.goalKeep = 1, $scope.defPlayer = 1, $scope.midPlayer = 1, $scope.fwdPlayer = 1;
            $scope.userInfo = JSON.parse(window.sessionStorage.userDetail);
            $scope.playerList = [];
            $scope.reviewList = [];
            $scope.teamJerSey = [{
                "teamId": "52",
                "jersey": "assets/images/jersey/AFC_Bournemouth.png",
                "position": "all"
            }, {
                "teamId": "19",
                "jersey": "assets/images/jersey/Arsenal.png",
                "position": "all"
            }, {
                "teamId": "78",
                "jersey": "assets/images/jersey/Brighton&_Hove_Albion.png",
                "position": "all"
            }, {
                "teamId": "27",
                "jersey": "assets/images/jersey/Burnley.png",
                "position": "all"
            }, {
                "teamId": "18",
                "jersey": "assets/images/jersey/Chelsea.png",
                "position": "all"
            }, {
                "teamId": "51",
                "jersey": "assets/images/jersey/Crystal_Palace.png",
                "position": "all"
            }, {
                "teamId": "13",
                "jersey": "assets/images/jersey/Everton.png",
                "position": "all"
            }, {
                "teamId": "251",
                "jersey": "assets/images/jersey/Huddersfield_Town.png",
                "position": "all"
            }, {
                "teamId": "42",
                "jersey": "assets/images/jersey/Leicester_City.png",
                "position": "all"
            }, {
                "teamId": "8",
                "jersey": "assets/images/jersey/Liverpool.png",
                "position": "all"
            }, {
                "teamId": "9",
                "jersey": "assets/images/jersey/Manchester_City.png",
                "position": "all"
            }, {
                "teamId": "14",
                "jersey": "assets/images/jersey/Manchester_United.png",
                "position": "all"
            }, {
                "teamId": "20",
                "jersey": "assets/images/jersey/Newcastle_United.png",
                "position": "all"
            }, {
                "teamId": "65",
                "jersey": "assets/images/jersey/Southampton.png",
                "position": "all"
            }, {
                "teamId": "26",
                "jersey": "assets/images/jersey/Stoke_City.png",
                "position": "all"
            }, {
                "teamId": "30",
                "jersey": "assets/images/jersey/Swansea_City.png",
                "position": "all"
            }, {
                "teamId": "6",
                "jersey": "assets/images/jersey/Tottenham_Hotspur.png",
                "position": "all"
            }, {
                "teamId": "25",
                "jersey": "assets/images/jersey/Watford.png",
                "position": "all"
            }, {
                "teamId": "10",
                "jersey": "assets/images/jersey/West_Bromwich_Albion.png",
                "position": "all"
            }, {
                "teamId": "1",
                "jersey": "assets/images/jersey/West_Ham_United.png",
                "position": "all"
            }];

            $scope.goalKeeJersey = [{
                "teamId": "52",
                "jersey": "assets/images/jersey/keeper/afc.png",
                "position": "GK"
            }, {
                "teamId": "19",
                "jersey": "assets/images/jersey/keeper/Arsenal.png",
                "position": "GK"
            }, {
                "teamId": "78",
                "jersey": "assets/images/jersey/keeper/Brighton_Hove_Albion.png",
                "position": "GK"
            }, {
                "teamId": "27",
                "jersey": "assets/images/jersey/keeper/Burnley.png",
                "position": "GK"
            }, {
                "teamId": "18",
                "jersey": "assets/images/jersey/keeper/Chelsea.png",
                "position": "GK"
            }, {
                "teamId": "51",
                "jersey": "assets/images/jersey/keeper/Crystal_Palace.png",
                "position": "GK"
            }, {
                "teamId": "13",
                "jersey": "assets/images/jersey/keeper/Everton.png",
                "position": "GK"
            }, {
                "teamId": "251",
                "jersey": "assets/images/jersey/keeper/Huddersfield_Town.png",
                "position": "GK"
            }, {
                "teamId": "42",
                "jersey": "assets/images/jersey/keeper/Leicester.png",
                "position": "GK"
            }, {
                "teamId": "8",
                "jersey": "assets/images/jersey/keeper/Liverpool.png",
                "position": "GK"
            }, {
                "teamId": "9",
                "jersey": "assets/images/jersey/keeper/Manchester_City.png",
                "position": "GK"
            }, {
                "teamId": "14",
                "jersey": "assets/images/jersey/keeper/Manchester_United.png",
                "position": "GK"
            }, {
                "teamId": "20",
                "jersey": "assets/images/jersey/keeper/Newcastle.png",
                "position": "GK"
            }, {
                "teamId": "65",
                "jersey": "assets/images/jersey/keeper/Southampton.png",
                "position": "GK"
            }, {
                "teamId": "26",
                "jersey": "assets/images/jersey/keeper/Stoke_City.png",
                "position": "GK"
            }, {
                "teamId": "30",
                "jersey": "assets/images/jersey/keeper/Swansea_City.png",
                "position": "GK"
            }, {
                "teamId": "6",
                "jersey": "assets/images/jersey/keeper/Tottenham_Hotspur.png",
                "position": "GK"
            }, {
                "teamId": "25",
                "jersey": "assets/images/jersey/keeper/Watford.png",
                "position": "GK"
            }, {
                "teamId": "10",
                "jersey": "assets/images/jersey/keeper/West_Bromwich.png",
                "position": "GK"
            }, {
                "teamId": "1",
                "jersey": "assets/images/jersey/keeper/West_Ham_United.png",
                "position": "GK"
            }];
            $scope.review = false;
            if ($scope.matchDetails.picked) {
                $scope.getLeaderBoard();
            } else {
                $scope.getPlayers();
            }


        };

        $scope.getPlayers = function() {
            try {
                var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.getPlayers + "/" + $scope.matchDetails.matchId;
                fandomService.get(url).then(function(res) {
                    if (res && res.data.status == "success") {
                        $scope.allPlayers = res.data.data.all;
                        for (var i = 0; i < $scope.allPlayers.length; i++) {
                            for (var j = 0; j < $scope.matchDetails.match.lineup.length; j++) {
                                $scope.allPlayers[i]["status"] = false;
                                if ($scope.allPlayers[i].id == $scope.matchDetails.match.lineup[j].playerId) {
                                    $scope.allPlayers[i]["points"] = {
                                        "totalPoints": $scope.matchDetails.match.lineup[j].points,
                                        "minutesPlayed": $scope.matchDetails.match.lineup[j].minutesPlayed
                                    };

                                    if ($scope.allPlayers[i].position == 1) {
                                        $scope.allPlayers[i]["positionPlay"] = "GK";
                                    } else if ($scope.allPlayers[i].position == 2) {
                                        $scope.allPlayers[i]["positionPlay"] = "DEF";
                                    } else if ($scope.allPlayers[i].position == 3) {
                                        $scope.allPlayers[i]["positionPlay"] = "MID";
                                    } else {
                                        $scope.allPlayers[i]["positionPlay"] = "FW";
                                    }
                                }

                            }
                        }
                        $rootScope.loader = false;
                        $scope.matchStatus = false;
                        if ($scope.allPlayers.length >= 9) {
                            angular.element('.allplay').addClass('cus-scroll');
                        } else {
                            angular.element('.allplay').removeClass('cus-scroll');
                        }
                        $scope.forwardPlayers = res.data.data.fwd;
                        $scope.defendPlayers = res.data.data.def;
                        $scope.goalKeeperPlayers = res.data.data.gk;
                        $scope.midPlayers = res.data.data.mid;
                    } else {
                        $scope.historyMatch = res.data.error;
                    }
                }, function(err) {
                    $commons.showError('#errorModal', "Something Went Wrong", true);
                });
            } catch (err) {
                exceptionService.promiseRejectsAfterAWhile(err);
            }
        };

        $scope.getLeaderBoard = function() {
            $rootScope.loader = true;
            var leaderboardUrl = $rootScope.appConfig.baseUrl + $rootScope.appConfig.rosterPlayer + "/" + $scope.userDetailInfo._id + "/" + $scope.matchDetails.matchId,
                getPlayerUrl = $rootScope.appConfig.baseUrl + $rootScope.appConfig.getPlayers + "/" + $scope.matchDetails.matchId;
            var leaderboardPromise = "",
                getPlayerPromise = "";
            $q.all([
                leaderboardPromise = fandomService.get(leaderboardUrl),
                getPlayerPromise = fandomService.get(getPlayerUrl)
            ]).then(function() {
                leaderboardPromise.then(function(res) {
                    if (res && res.data.status == "success") {
                        $scope.allLineup = res.data.data.match.lineup;
                        $scope.matchInfo = res.data.data.players;
                        $scope.playerList = [];
                        $scope.reviewList = [];
                        for (var k = 0; k < $scope.matchInfo.length; k++) {
                            for (var lineup = 0; lineup < $scope.allLineup.length; lineup++) {
                                if ($scope.allLineup[lineup].playerId == $scope.matchInfo[k].playerId) {
                                    $scope.playerList.push({
                                        "colorCode": "",
                                        "iconId": "",
                                        "playerId": $scope.matchInfo[k].playerId,
                                        "id": $scope.matchInfo[k].playerId,
                                        "name": $scope.matchInfo[k].name,
                                        "positionId": $scope.matchInfo[k].positionId,
                                        "position": $scope.matchInfo[k].position,
                                        "teamId": $scope.allLineup[lineup].teamId,
                                        "status": true
                                    });
                                    $scope.reviewList.push({
                                        "colorCode": "",
                                        "iconId": "",
                                        "playerId": $scope.matchInfo[k].playerId,
                                        "name": $scope.matchInfo[k].name,
                                        "positionId": $scope.matchInfo[k].positionId,
                                        "position": $scope.matchInfo[k].position,
                                        "teamId": $scope.allLineup[lineup].teamId,
                                        "status": true
                                    });
                                    if ($scope.playerList[k].positionId == 1) {
                                        $scope.reviewList[k]["positionPlay"] = "GK";
                                        $scope.playerList[k]["positionPlay"] = "GK";
                                    } else if ($scope.playerList[k].positionId == 2) {
                                        $scope.reviewList[k]["positionPlay"] = "DEF";
                                        $scope.playerList[k]["positionPlay"] = "DEF";
                                    } else if ($scope.playerList[k].positionId == 3) {
                                        $scope.reviewList[k]["positionPlay"] = "MID";
                                        $scope.playerList[k]["positionPlay"] = "MID";
                                    } else {
                                        $scope.reviewList[k]["positionPlay"] = "FW";
                                        $scope.playerList[k]["positionPlay"] = "FW";
                                    }
                                }
                            }
                        }

                    }
                    $scope.matchStatus = true;
                    $scope.goalKeep = 1, $scope.defPlayer = 4, $scope.midPlayer = 3, $scope.fwdPlayer = 3;
                    for (var playerList = 0; playerList < $scope.reviewList.length; playerList++) {
                        if ($scope.reviewList[playerList].positionPlay === "GK") {
                            for (var j = 0; j < $scope.goalKeeJersey.length; j++) {
                                if ($scope.reviewList[playerList].teamId == $scope.goalKeeJersey[j].teamId) {
                                    $scope.reviewList[playerList]["image"] = $scope.goalKeeJersey[j].jersey;
                                }
                            }
                        } else {
                            for (var i = 0; i < $scope.teamJerSey.length; i++) {
                                if ($scope.reviewList[playerList].teamId == $scope.teamJerSey[i].teamId) {
                                    $scope.reviewList[playerList]["image"] = $scope.teamJerSey[i].jersey;
                                }
                            }
                        }
                    }

                });
                getPlayerPromise.then(function(res) {
                    if (res && res.data.status == "success") {
                        $scope.allPlayers = res.data.data.all;
                        $rootScope.loader = false;
                        for (var i = 0; i < $scope.allPlayers.length; i++) {
                            for (var j = 0; j < $scope.matchDetails.match.lineup.length; j++) {
                                if ($scope.allPlayers[i].id == $scope.matchDetails.match.lineup[j].playerId) {
                                    $scope.allPlayers[i]["points"] = {
                                        "totalPoints": $scope.matchDetails.match.lineup[j].points,
                                        "minutesPlayed": $scope.matchDetails.match.lineup[j].minutesPlayed
                                    };
                                    if ($scope.allPlayers.length >= 9) {
                                        angular.element('.allplay').addClass('cus-scroll');
                                    } else {
                                        angular.element('.allplay').removeClass('cus-scroll');
                                    }
                                    if ($scope.allPlayers[i].position == 1) {
                                        $scope.allPlayers[i]["positionPlay"] = "GK";
                                    } else if ($scope.allPlayers[i].position == 2) {
                                        $scope.allPlayers[i]["positionPlay"] = "DEF";
                                    } else if ($scope.allPlayers[i].position == 3) {
                                        $scope.allPlayers[i]["positionPlay"] = "MID";
                                    } else {
                                        $scope.allPlayers[i]["positionPlay"] = "FW";
                                    }
                                }
                            }
                        }
                        filterArray($scope.allPlayers, $scope.playerList);
                    }
                });

            });
        };
        $scope.navigateTab = function(tabName) {
            try {
                $scope.playerTab = tabName;
            } catch (err) {
                exceptionService.promiseRejectsAfterAWhile(err);
            }
        };

        $scope.navigateActiveTab = function(tab) {
            return $scope.playerTab === tab;
        };

        $scope.slider = function(slideName) {
            if (slideName === "prev") {
                if ($scope.playerTab === "all") {
                    $scope.navigateTab('gk');
                } else if ($scope.playerTab === "def") {
                    $scope.navigateTab('all');
                } else if ($scope.playerTab === "mid") {
                    $scope.navigateTab('def');
                } else if ($scope.playerTab === "fk") {
                    $scope.navigateTab('mid');
                } else if ($scope.playerTab === "gk") {
                    $scope.navigateTab('fk');
                }

            } else {
                if ($scope.playerTab === "all") {
                    $scope.navigateTab('def');
                } else if ($scope.playerTab === "def") {
                    $scope.navigateTab('mid');
                } else if ($scope.playerTab === "mid") {
                    $scope.navigateTab('fk');
                } else if ($scope.playerTab === "fk") {
                    $scope.navigateTab('gk');
                } else if ($scope.playerTab === "gk") {
                    $scope.navigateTab('all');
                }
            }
        };
        $scope.addPlayer = function(player, index, playerPosition) {
            var defTeam = [],
                midTeam = [],
                fkTeam = [];
            if (!player.status) {
                if ($scope.playerList.length < 11) {
                    if (player.position === "1") {
                        if ($scope.goalKeep == 1) {
                            $scope.playerList.push(player);
                            $scope.reviewPush(player);
                            $scope.findStatus(player.id);
                            $scope.goalKeep++;
                        } else {
                            $commons.showWarning("#warningModal", "Already Selected One Goal Keeper", true);
                        }
                    } else if (player.position === "2") {
                        if ($scope.defPlayer <= 4) {
                            if ($scope.defPlayer == 4) {
                                for (var i = 0; i < $scope.playerList.length; i++) {
                                    if ($scope.playerList[i].position == "2") {
                                        if (player.teamId == $scope.playerList[i].teamId) {
                                            defTeam.push($scope.playerList[i].teamId);
                                        }
                                    }
                                }
                                if (defTeam.length == 3) {
                                    $scope.defPlayer--;
                                    $commons.showWarning("#warningModal", "Cannot Select 4 Defenders Same Team", true);
                                } else {
                                    $scope.playerList.push(player);
                                    $scope.reviewPush(player);
                                    $scope.findStatus(player.id);
                                }
                            } else {

                                $scope.playerList.push(player);
                                $scope.reviewPush(player);
                                $scope.findStatus(player.id);
                            }
                            $scope.defPlayer++;
                        } else {
                            $commons.showWarning("#warningModal", "Already Selected 4 Defenders", true);
                        }
                    } else if (player.position === "3") {
                        if ($scope.midPlayer <= 3) {
                            if ($scope.midPlayer == 3) {
                                for (var mid = 0; mid < $scope.playerList.length; mid++) {
                                    if ($scope.playerList[mid].position == "3") {
                                        if (player.teamId == $scope.playerList[mid].teamId) {
                                            midTeam.push($scope.playerList[mid].teamId);
                                        }
                                    }
                                }
                                if (midTeam.length == 2) {
                                    $scope.midPlayer--;
                                    $commons.showWarning("#warningModal", "Cannot Select 3 MidFielders Same Team", true);
                                } else {
                                    $scope.playerList.push(player);
                                    $scope.reviewPush(player);
                                    $scope.findStatus(player.id);
                                }
                            } else {
                                $scope.playerList.push(player);
                                $scope.reviewPush(player);
                                $scope.findStatus(player.id);
                            }
                            $scope.midPlayer++;
                        } else {
                            $commons.showWarning("#warningModal", "Already Selected 3 Midfielders", true);
                        }
                    } else {
                        if ($scope.fwdPlayer <= 3) {
                            if ($scope.fwdPlayer == 3) {
                                for (var fw = 0; fw < $scope.playerList.length; fw++) {
                                    if ($scope.playerList[fw].position == "4") {
                                        if (player.teamId == $scope.playerList[fw].teamId) {
                                            fkTeam.push($scope.playerList[fw].teamId);
                                        }
                                    }
                                }
                                if (fkTeam.length == 2) {
                                    $scope.fwdPlayer--;
                                    $commons.showWarning("#warningModal", "Cannot Select 3 Forward Players Same Team", true);
                                } else {
                                    $scope.playerList.push(player);
                                    $scope.reviewPush(player);
                                    $scope.findStatus(player.id);
                                }
                            } else {

                                $scope.playerList.push(player);
                                $scope.reviewPush(player);
                                $scope.findStatus(player.id);
                            }
                            $scope.fwdPlayer++;
                        } else {
                            $commons.showWarning("#warningModal", "Already Selected 3 Midfielders", true);
                        }

                    }
                } else {
                    $commons.showWarning("#warningModal", "Already Selected 11 Players", true);
                }
            } else {
                for (var j = 0; j < $scope.allPlayers.length; j++) {
                    if (player.id == $scope.allPlayers[j].id) {
                        $scope.allPlayers[j].status = false;
                    }
                }
                if (player.position == 1) {
                    $scope.goalKeep--;
                } else if (player.position == 2) {
                    $scope.defPlayer--;
                } else if (player.position == 3) {
                    $scope.midPlayer--;
                } else {
                    $scope.fwdPlayer--;
                }
                for (var playerLength = 0; playerLength < $scope.playerList.length; playerLength++) {
                    if ($scope.playerList[playerLength].id == player.id) {
                        $scope.playerList.splice(playerLength, 1);
                        $scope.reviewList.splice(playerLength, 1);
                    }
                }
            }
        };

        $scope.addTeam = function() {
            if ($scope.playerList.length == 11) {
                $rootScope.loader = true;
                var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.createMatch;
                var players = [];
                for (var i = 0; i < $scope.playerList.length; i++) {
                    players.push($scope.playerList[i].id);
                }
                var model = {
                    "username": $scope.userInfo.username,
                    "matchId": $scope.matchDetails.matchId,
                    "players": players
                };
                fandomService.post(url, model).then(function(res) {
                    if (res && res.data.status == "success") {
                        $rootScope.loader = false;
                        if (res.data.error == "") {
                            $scope.getUpcomingMatch();
                            if (!$scope.matchStatus) {
                                $commons.showSuccess('#successModal', "Successfully Create New team !", true);
                                $scope.matchStatus = true;
                            } else {
                                $commons.showSuccess('#successModal', "Successfully Update team !", true);
                            }
                            $scope.matchStatus = true;
                        } else {
                            $commons.showError('#errorModal', res.data.error, true);
                        }

                    } else {

                    }
                }, function(err) {
                    $commons.showError('#errorModal', err, true);
                });
            } else {
                $commons.showWarning("#warningModal", "Please 11 Players in Team", true);
            }
        };

        $scope.findStatus = function(player) {
            for (var statusArray = 0; statusArray < $scope.allPlayers.length; statusArray++) {
                if (player == $scope.allPlayers[statusArray].id) {
                    $scope.allPlayers[statusArray].status = true;
                }
            }
        };

        $scope.reviewPush = function(player) {
            if (player.positionPlay === "GK") {
                for (var j = 0; j < $scope.goalKeeJersey.length; j++) {
                    if (player.teamId == $scope.goalKeeJersey[j].teamId) {
                        $scope.reviewList.push(player);
                        $scope.reviewList[$scope.reviewList.length - 1]["image"] = $scope.goalKeeJersey[j].jersey;
                    }
                }
            } else {
                for (var i = 0; i < $scope.teamJerSey.length; i++) {
                    if (player.teamId == $scope.teamJerSey[i].teamId) {
                        $scope.reviewList.push(player);
                        $scope.reviewList[$scope.reviewList.length - 1]["image"] = $scope.teamJerSey[i].jersey;
                    }
                }
            }
            return $scope.reviewList;
        };

        $scope.reviewTeam = function() {
            $scope.review = true;
            $scope.defReview = $filter('filter')($scope.reviewList, "DEF");
            $scope.midReview = $filter('filter')($scope.reviewList, "MID");
            $scope.fwReview = $filter('filter')($scope.reviewList, "FW");
            $scope.gkReview = $filter('filter')($scope.reviewList, "GK");
            console.log($scope.defReview);
        };

        $scope.reviewClose = function() {
            $scope.review = false;
        };



        function filterArray(array, filter) {
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < filter.length; j++) {
                    if (array[i].id === filter[j].playerId && array[i].id === filter[j].playerId) {
                        $scope.allPlayers[i]["status"] = true;
                    }
                }
            }
            return $scope.allPlayers;
        }

        $scope.socialShare = function(social) {
            var element = angular.element("#snapshot");
            element.css({ "display": "block" });
            var getCanvas;

            html2canvas(element, {
                onrendered: function(canvas) {
                    $("#img-out").append(canvas);
                    getCanvas = canvas;
                    var imgageData = getCanvas.toDataURL("image/png");
                    $("#img-out").html("");
                    if (social === "facebook") {
                        var metaField = '<meta og:image content="' + imgageData + '"/>';
                        $("#fbShare").attr('socialshare-text', "My Fantumn XI line up for the match. Match details" + $scope.matchDetails.home + " VS " + $scope.matchDetails.away);
                        $("#fbShare").attr("socialshare-media", metaField);
                        $("#fbShare").attr('socialshare-url', "http://www.fantumn.com");
                        document.getElementById('fbShare').click();
                    } else if (social === "twitter") {
                        $("#twitterShare").attr("socialshare-text", "My Fantumn XI line up for the match. Match details" + $scope.matchDetails.home + " VS " + $scope.matchDetails.away);
                        $("#twitterShare").attr("socialshare-url", imgageData);
                        document.getElementById("twitterShare").click();
                    } else if (social == "download") {
                        $scope.downloaUri = imgageData;
                        $("#downloadPitch").attr("href", imgageData);
                        document.getElementById("downloadPitch").click();
                        $("#downloadPitch").attr("href", "");
                    } else {
                        // Socialshare.share({
                        //     'provider': 'facebook',
                        //     'attrs': {
                        //         'socialshareUrl': 'http://720kb.net'
                        //     }
                        // });
                    }
                    element.css({ "display": "none" });
                }
            });

        };

        $scope.$watch("matchChange", function() {
            if (window.sessionStorage.match !== $scope.matchDetails) {
                $scope.matchDetails = JSON.parse(window.sessionStorage.match);
                $scope.countdown = $scope.matchDetails.starts;
                $scope.home = {
                    "id": $scope.matchDetails.teams.team1.teamId,
                    "name": $scope.matchDetails.teams.team1.name
                };
                $scope.away = {
                    "id": $scope.matchDetails.teams.team2.teamId,
                    "name": $scope.matchDetails.teams.team2.name
                };
                $scope.playerTab = 'all';
                $scope.goalKeep = 1, $scope.defPlayer = 1, $scope.midPlayer = 1, $scope.fwdPlayer = 1;
                $scope.playerList = [], $scope.reviewList = [];
                $scope.review = false;
                if ($scope.matchDetails.picked) {
                    $scope.getLeaderBoard();
                } else {
                    $scope.getPlayers();
                }
            }
        });

        $scope.initFunction();



    }
}(window, angular);