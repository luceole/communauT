'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admingroup', {
        url: '/admingroup',
        templateUrl: 'app/admingroup/admingroup.html',
        controller: 'AdmingroupCtrl',
 	authenticate: true,
        adminreserved: true
      });
  });

