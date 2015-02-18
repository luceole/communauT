'use strict';

angular.module('testApp')
  .controller('MainCtrl', function ($scope, $http, $location, Auth) {
    $scope.errors = {};
    $scope.user = {};
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.isAdmin_grp = Auth.isAdmin_grp;
    $scope.isActif = Auth.isActif;

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          uid: $scope.user.uid,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = 'ERREUR : ' + err.message;
        });
      }
    };
  });
