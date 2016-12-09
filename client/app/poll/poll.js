'use strict';

angular.module('communauT')
  .config(function ($stateProvider) {
    $stateProvider
      .state('poll', {
        url: '/poll',
        templateUrl: 'app/poll/poll.html',
        controller: 'PollCtrl'
      });
  });
