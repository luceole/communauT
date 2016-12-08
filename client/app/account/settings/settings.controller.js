'use strict';

angular.module('communauT')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};
    $scope.tabs = [
    { titre: "tab1"},
    { titre: "tab2"}
     ];
 

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.errors.other = '';
          $scope.message = 'Nouveau Mot de Passe Enregistré';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Erreur de Mot de Passe ';
          $scope.message = '';
        });
      }
		};
  });
