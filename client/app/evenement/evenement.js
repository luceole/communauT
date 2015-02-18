'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('evenement', {
        url: '/evenement',
        templateUrl: 'app/evenement/evenement.html',
        controller: 'EvenementCtrl'
      });
  });