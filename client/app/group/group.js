'use strict';

angular.module('communauT')
  .config(function($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        authenticate: true
      });
  });