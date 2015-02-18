'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('edit', {
        url: '/edit',
        templateUrl: 'app/account/edit/edit.html',
        controller: 'EditCtrl'
      });
  });