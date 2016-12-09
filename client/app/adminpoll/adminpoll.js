'use strict';

angular.module('communauT')
  .config(function ($stateProvider) {
    $stateProvider
      .state('adminpoll', {
        url: '/adminpoll',
        templateUrl: 'app/adminpoll/adminpoll.html',
        controller: 'AdminPollCtrl',
        authenticate: true,
        adminreserved: false
      });
  });
