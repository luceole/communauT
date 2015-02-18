'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newpass', {
        url: '/newpass',
        templateUrl: 'app/newpass/newpass.html',
        controller: 'NewpassCtrl'
      });
  });