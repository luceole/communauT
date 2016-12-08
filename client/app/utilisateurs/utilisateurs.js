'use strict';

angular.module('communauT')
  .config(function($stateProvider) {
    $stateProvider
      .state('utilisateurs', {
        url: '/utilisateurs',
        templateUrl: 'app/utilisateurs/utilisateurs.html',
        controller: 'UtilisateursCtrl',
        authenticate: true,
        adminreserved: true
      });
  });