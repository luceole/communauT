'use strict';
angular.module('communauT')
  .controller('EditCtrl', function ($scope,Auth) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.user = $scope.getCurrentUser();
    $scope.errors = {};
    $scope.editMessage = '';
    $scope.editer = function(form) {
      $scope.submitted = true;
      $scope.editMessage = '';
      if(form.$valid) {
        Auth.updateMe($scope.user._id,{
          name: $scope.user.name,
          surname: $scope.user.surname,
          structure: $scope.user.structure,
          email: $scope.user.email
        })
        .then( function() {
          // Account created, redirect to home
          // $location.path('/');
          $scope.editMessage = 'Mise à jour prise en compte';
          console.log("Maj is OK");
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
             angular.forEach(err.errors, function(error, field) {
             form[field].$setValidity('mongoose', false);
             $scope.errors[field] = error.message;
          });
        });
      }
    };
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


