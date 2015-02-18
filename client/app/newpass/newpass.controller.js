'use strict';

angular.module('testApp')
 .controller('NewpassCtrl', function ($scope,User,Auth) {
    $scope.message = '';
    $scope.error = '';
    $scope.register = function() {
      Auth.byMail({ email: $scope.user.email } ) 
        .then( function() {
          $scope.message = "Demande d'un nouveau Mot de Passe enregistré";
          $scope.msgClasse="label label-success";
        })
        .catch( function() {
          $scope.message = "Adresse non trouvé dans l'annuaire";
          $scope.msgClasse="label label-danger";
        });
  };
  });


