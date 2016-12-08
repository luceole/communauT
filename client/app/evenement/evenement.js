'use strict';

angular.module('communauT')
  .config(function ($stateProvider) {
    $stateProvider
      .state('evenement', {
        url: '/evenement',
        templateUrl: 'app/evenement/evenement.html',
        controller: 'EvenementCtrl'
      });
  });