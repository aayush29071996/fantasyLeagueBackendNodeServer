/**
 * @Filename : contactController.js
 * @Description : 
 * @Author : Patharraj
 * @Date : Oct 28, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0         28-10-17    Patharraj     File Created         
 */

/**
 * @ngdoc controller
 * @name contactController
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('settingCtrl', settingCtrl);
    settingCtrl.$inject = ["$scope", "$rootScope", "$commons", "$logger", "fandomService", "exceptionService"];


    function settingCtrl($scope, $rootScope, $commons, $logger, fandomService, exceptionService) {

        $scope.initFunction = function() {
            $scope.userData = JSON.parse(window.sessionStorage.userDetail);
            $scope.settingDrop = false;
            $scope.genderError = false;
            $scope.profileEdit = false;
            $scope.changePass = {
                "oldPass": "",
                "newPass": ""
            };
            $rootScope.loader = true;
            $scope.profileInfo = {
                "name": "",
                "email": "",
                "notification": false,
                "mobile": "",
                "gender": "",
                "address": "",
                "city": "",
                "state": "",
                "pincode": "",
                "country": "",
                "avatar": $scope.userData.avatar
            };

            // $scope.inlineStyle = {
            //     background: "url($scope.profileInfo.avatar+)"
            // };
            $scope.customError = false;
            $scope.getProfileInformation();
        };


        $scope.getProfileInformation = function() {
            var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.profile + "/" + $scope.userData._id;
            fandomService.get(url).then(function(res) {
                $rootScope.loader = false;
                if (res && res.data.status == "success") {
                    $scope.profile = res.data.data;
                    $scope.profileInfo.name = $scope.profile.name;
                    $scope.profileInfo.email = $scope.profile.email;
                    $scope.profileInfo.mobile = $scope.profile.mobileNumber;
                    $scope.profileInfo.gender = $scope.profile.gender;
                    $scope.profileInfo.address = $scope.profile.address.line1;
                    $scope.profileInfo.city = $scope.profile.address.city;
                    $scope.profileInfo.state = $scope.profile.address.state;
                    $scope.profileInfo.pincode = $scope.profile.address.pincode;
                    $scope.profileInfo.country = $scope.profile.address.country;
                    $scope.profileInfo.notification = $scope.profile.pushNotification;
                } else {
                    $commons.showError('#errorModal', res.data.error, true);
                }
            }, function(err) {
                $commons.showError('#errorModal', err, true);
            });
        };

        $scope.updateProfile = function(valid) {
            $scope.submitForm = true;
            var controlSubmit = false;
            if ($scope.profileInfo.gender != "") {
                $scope.genderError = false;
                controlSubmit = false;
            } else {
                $scope.genderError = true;
                controlSubmit = true;
            }

            if (valid && controlSubmit) {
                $rootScope.loader = true;
                var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.updateProfile;
                var model = {
                    "_id": $scope.userData._id,
                    "name": $scope.profileInfo.name,
                    "gender": $scope.profileInfo.gender,
                    "mobileNumber": $scope.profileInfo.mobile,
                    "address": {
                        "line1": $scope.profileInfo.address,
                        "city": $scope.profileInfo.city,
                        "state": $scope.profileInfo.state,
                        "pincode": $scope.profileInfo.pincode,
                        "country": $scope.profileInfo.country
                    },
                    "pushNotification": $scope.profileInfo.notification
                };
                fandomService.post(url, model).then(function(res) {
                    $rootScope.loader = false;
                    if (res && res.data.status == "success") {
                        $scope.profile = res.data.data;
                        $scope.submitForm = false;
                        $commons.showError('#successModal', "Profile Updated Successfully", true);
                        $scope.getProfileInformation();
                    } else {
                        $commons.showError('#errorModal', res.data.error, true);
                    }
                }, function(err) {
                    $commons.showError('#errorModal', err, true);
                });
            }
        };

        $scope.changePasswordOpen = function() {
            angular.element('.setting-modal').addClass('active');
            $scope.settingDrop = true;
        };
        $scope.changePasswordClose = function() {
            angular.element('.setting-modal').removeClass('active');
            $scope.settingDrop = false;
        };

        $scope.addProfile = function() {
            document.getElementById('avatar').click();
        };

        $scope.onLoad = function(e, reader, file, fileList, fileOjects, fileObj) {
            try {
                if (e == "unsupported") {
                    $commons.showError("Sorry, the uploaded file type is not supported. Please choose a JPEG (or) PNG type image.");

                } else {
                    if (fileObj && fileObj.filetype && fileObj.filetype.split("/")[0] == "image") {
                        $scope.picture = fileObj;
                        $scope.profileBase = fileObj.base64;
                        $scope.profileInfo.avatar = fileObj.base64;
                        // $scope.inlineStyle = {
                        //     background: url($scope.profileBase)
                        // };
                    }
                }
            } catch (err) {
                exceptionService.promiseRejectsAfterAWhile(err);
            }


        };

        $scope.changePassword = function(valid) {
            $scope.passwordChange = true;
            if (valid) {
                $rootScope.loader = true;
                var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.changePassword;
                var model = {
                    "username": $scope.userData.username,
                    "oldPassword": $scope.changePass.oldPass,
                    "newPassword": $scope.changePass.newPass
                };
                fandomService.post(url, model).then(function(res) {
                    $rootScope.loader = false;
                    if (res && res.data.status == "success") {
                        $scope.passwordChange = false;
                        console.log(res.data.data);
                        $commons.showError('#successModal', "Password Changed Successfully", true);
                    } else {
                        $commons.showError('#errorModal', res.data.error, true);
                    }
                }, function(err) {
                    $commons.showError('#errorModal', err, true);
                });
            }
        };

        $scope.enableProfile = function() {
            if ($scope.profileEdit) {
                $scope.profileEdit = false;
            } else {
                $scope.profileEdit = true;
            }
        };
        $scope.initFunction();

    }
}(window, angular);