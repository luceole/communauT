'use strict';

angular.module('testApp')
  .controller('AdminCtrl', function($scope, $http, Auth,Demande) {
  $scope.totalUsers = 0;
  $scope.usersPerPage = 12;
 $scope.current=1;
 $scope.pagination = {
        current: 1 
    };


 $scope.pageChanged = function(newPage) {
     Auth.DemandesPage(newPage)
    .then(function(result) {
      console.log(result);
      $scope.demandes  = result;
      $scope.totalUsers = result.total;
    });
    };


   Auth.DemandesPage($scope.pagination.current)
    .then(function(result) {
      console.log(result);
      $scope.demandes  = result;
      $scope.totalUsers = result.total;
    });

    $scope.traite = function(ds) {
      angular.forEach(ds.docs, function(u,k) {
        if (u.isactif) {
          u.isdemande = false;
          Auth.updateUser(u._id, u, function() {
       Demande.get()
      .$promise.then(function(result) {
      $scope.demandes  = result;
    });
});
        }
    });
    };

    $scope.checkAll = function() {
      angular.forEach($scope.demandes.docs, function(u) {
        u.isactif = true;
      });
    };

    $scope.uncheckAll = function() {
      angular.forEach($scope.demandes.docs, function(u) {
        u.isactif = false;
      });
    };
  });
