'use strict';

angular.module('testApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, Demande) {
  // Use the User $resource to fetch all users
  $scope.demandes = Demande.query();
  $scope.traite = function(ds) {
   var tb=angular.copy(ds);
   angular.forEach(ds, function (u) {
   if (u.isactif) {u.isdemande=false;Auth.updateUser(u._id,u);}
      });
   var i;
   for(i=tb.length;i--;i<0) { 
   if (ds[i].isactif) {ds.splice(i,1);}
      }
  };
  $scope.checkAll = function() {
   angular.forEach($scope.demandes, function (u) {
   u.isactif=true;
      });
  };
  $scope.uncheckAll = function() {
   angular.forEach($scope.demandes, function (u) {
   u.isactif=false;
      });
  };
});
