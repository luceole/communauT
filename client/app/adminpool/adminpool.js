'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('adminpool', {
        url: '/adminpool',
        templateUrl: 'app/adminpool/adminpool.html',
        controller: 'AdminPoolCtrl',
        authenticate: true,
        adminreserved: false
      });
  });
