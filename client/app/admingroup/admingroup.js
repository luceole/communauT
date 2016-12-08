'use strict';

angular.module('communauT')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admingroup', {
        url: '/admingroup',
        templateUrl: 'app/admingroup/admingroup.html',
        controller: 'AdmingroupCtrl',
        authenticate: true,
        adminreserved: false
      });
  });
