
'use strict';


var dashServices = angular.module('dashServices', ['ngResource','dashControllers']);


dashServices.factory('Admin', function($http,$window){
    var user={};
    var baseURI = "https://inyards.herokuapp.com/";
    user.whoAmI=function() {
        return $http.post("").then(function(data){
            return;
            });
    }
    
    return user;
    })