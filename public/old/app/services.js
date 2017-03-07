
'use strict';


var dashServices = angular.module('dashServices', ['ngResource','dashControllers']);


dashServices.factory('Admin', function($http){
    var user={};
    var baseURI = "https://inyards.herokuapp.com/";
    user.whoAmI=function() {
        return $http.post(baseURI);
    };
    
    return user;
    })