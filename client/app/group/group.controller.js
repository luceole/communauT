'use strict';

angular.module('testApp')
  .controller('GroupCtrl', function ($scope, $http, $modal, Auth, User, Groupe, GroupeOf,GroupeOpen) {
   $scope.user = Auth.getCurrentUser();
   $scope.groups = GroupeOpen.query();
   $scope.isMemberOf= function(groupe,usr) {
    //var usr=$scope.user;
    var grpId=groupe._id
    //alert("isMember ");
    var r=usr.memberOf.filter(function(obj) { 
    //alert(obj.info+ " "+obj._id+" test "+ grpId);  // verifier pourquoi la fonction est appellé plein de fois 
return obj._id==grpId;});
    return r[0]? 1:null
  };

  $scope.addusergroup= function(groupe) {
    var grpId=groupe._id
    var groupeInfo=groupe.info
    var r=$scope.user.memberOf.filter(function(obj) {return obj._id==grpId;}); 
    if (r? r[0]:null) {
    alert("Deja Inscrit dans "+groupe.name);
    } 
    else {
    	Auth.addUserGroup(grpId, function(u,err) {
        if (err) {alert("Erreur MAJ "+err);}
         $scope.user=u;
         $scope.groups = GroupeOpen.query();
         
    });
    }
    };

  $scope.delusergroup= function(groupe) {
    var grpId=groupe._id
    var groupeInfo=groupe.info
    var r=$scope.user.memberOf.filter(function(obj) {return obj._id==grpId;});
    if (!r? r[0]:null) {
    alert("Pas Inscrit dans "+groupe.name);
    }
    else {
        Auth.delUserGroup(grpId, function(u,err) {
        if (err) {alert("Erreur MAJ "+err);}
         //$scope.user=u;  // Pas utilisable problème mongoose pull avec populate
        angular.forEach($scope.user.memberOf, function(o, i) {
        if (o._id  === grpId) {
          $scope.user.memberOf.splice(i, 1);
           }
        });
         $scope.groups = GroupeOpen.query();
      });
    }
    };


 });

