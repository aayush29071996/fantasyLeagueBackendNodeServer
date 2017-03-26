
'use strict';


var dashServices = angular.module('dashServices', ['ngResource','dashControllers']);

dashServices.factory('Auth', function($http){
    var user={};
    var baseURI = "https://inyards.herokuapp.com";
    
    user.authenticate = function(data){
        return $http.post(baseURI + '/admin', data);  
    };
    
    return user;
});

dashServices.factory('Football', function($http){
    var user={};
    var baseURI = "https://inyards.herokuapp.com";
    
    // Get All Teams
    user.getAllTeams=function() {
        return $http.get(baseURI+'/teams');
    };
    
    user.newTeamAvailability=function(teamId){
        return $http.post(baseURI+'/team/id',{"teamId":teamId});
    };
    
    user.newTeam=function(team){
        return $http.post(baseURI+'/team/',team);
    };
    
    user.deleteTeam=function(teamId){
        return $http.delete(baseURI+'/team/'+teamId);
    };
    
    user.updateTeam=function(team){
        return $http.put(baseURI+'/team/',team);
    };
    
    user.getTeamDetails=function(teamId) {
        return $http.get(baseURI+'/team/'+teamId);
    };
    
    user.getPlayerDetails=function(playerId) {
        return $http.get(baseURI+'/player/'+playerId);
    };
    
    user.getAllPlayers=function() {
        return $http.get(baseURI+'/players');
    };
    
    return user;
    });
