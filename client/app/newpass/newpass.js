'use strict';

angular.module('communauT')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newpass', {
        url: '/newpass',
        templateUrl: 'app/newpass/newpass.html',
        controller: 'NewpassCtrl'
      });
  });