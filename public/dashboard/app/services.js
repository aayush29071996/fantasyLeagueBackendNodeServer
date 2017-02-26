
'use strict';


var dashServices = angular.module('dashServices', ['ngResource','dashControllers']);


dashServices.factory('Api', function($http,$window){
    var user={};
    
    user.whoAmI=function() {
        return $http.post("https://thecodeclub.herokuapp.com/api/whoami").then(function(data){
            return;
            });
    }
    
    user.logoutUser=function(){
     return $http.post("https://thecodeclub.herokuapp.com/api/logout").then(function(data) {
                $window.location.href="https://thecodeclub.herokuapp.com";
                return;
    });
    
    
    }
    
    return user;
    })