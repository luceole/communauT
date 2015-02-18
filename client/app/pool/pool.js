'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pool', {
        url: '/pool',
        templateUrl: 'app/pool/pool.html',
        controller: 'PoolCtrl'
      });
  });
