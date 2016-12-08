'use strict';

angular.module('communauT')
  .config(function ($stateProvider) {
    $stateProvider
      .state('edit', {
        url: '/edit',
        templateUrl: 'app/account/edit/edit.html',
        controller: 'EditCtrl'
      });
  });