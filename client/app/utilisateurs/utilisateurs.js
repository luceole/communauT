'use strict';

angular.module('testApp')
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