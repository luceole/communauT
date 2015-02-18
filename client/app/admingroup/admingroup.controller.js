'use strict';

angular.module('testApp')
  .controller('AdmingroupCtrl', function ($scope, $http, $modal, $window,Auth, User, Groupe) {
console.log('AdmingroupCtrl');
$scope.groupes = Groupe.query();
$scope.refresh = function() {
$scope.groupes = Groupe.query();
};
$scope.edit = function(gp) {
     $modal.open({
     controller: 'ModalEditAdminGroupCtrl',
     templateUrl: 'modalEditAdminGroup.html',
        resolve: {
          Sgroupe: function () {
          return gp;
          }
         }
        });
    };
$scope.add = function() {
     $modal.open({
     controller: 'ModalAddAdminGroupCtrl',
     templateUrl: 'modalAddAdminGroup.html',
        resolve: {
          Sgroupes: function() {
          //return $scope.refresh;
          return $scope.groupes;
         }
        }
        });
    };


$scope.delete = function(grp) {
     if ($window.confirm("Suppression de " +grp.name))
     {
      Groupe.remove({ id: grp._id });
/*
      angular.forEach($scope.groupes, function(u, i) {
        if (u ==== grp) {
          $scope.groupes.splice(i, 1);
        }
      });
*/
      $scope.groupes.splice($scope.groupes.indexOf(grp),1);
      }
    };

 });


angular.module('testApp')
.controller('ModalEditAdminGroupCtrl', function ($scope, $modalInstance, $window, Auth,User, Groupe, Sgroupe) {
  $scope.groupe = new Groupe(Sgroupe);
  $scope.person = {};
  //$scope.groupe=  Groupe.get({id: Sgroupe._id});  
  //$scope.users = User.query();
  Auth.getusers()
  .then( function(u) {
  $scope.users = u;
  $scope.person.selected =u.filter(function(obj) {return obj._id===Sgroupe.owner._id;})[0];
  });
  $scope.ok = function (form) {
  $scope.submitted=true;
  if(form.$valid) {
  //alert($scope.person.selected._id);
  Auth.updategroupe($scope.groupe._id,{
          info: $scope.groupe.info,
          type: $scope.groupe.type,
          owner:$scope.person.selected._id  
        })
  .then( function(r) {
          Sgroupe.info=$scope.groupe.info;
          Sgroupe.type=$scope.groupe.type;
          Sgroupe.owner=r.owner._id;  
         console.log("Maj is OK " + r.owner + " "+$scope.groupe.info);
         $modalInstance.close();
        })
 .catch( function(err) {
          err = err.data;
          $window.alert("Erreur de mise à jour: "+ err);
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
             angular.forEach(err.errors, function(error, field) {
             form[field].$setValidity('mongoose', false);
             $scope.errors[field] = error.message;
          });
        });
  }
  };

  $scope.cancel = function () {
    console.log("Abandon "+$scope.groupe.uid);
    $modalInstance.dismiss('cancel');
  };
});

angular.module('testApp')
.controller('ModalAddAdminGroupCtrl', function ($scope, $modalInstance, $window, Auth,User, Groupe, Sgroupes) {
  $scope.groupe = new Groupe();
  $scope.person = {};
  //$scope.groupe=  Groupe.get({id: Sgroupe._id});  
  //$scope.users = User.query();
  Auth.getusers()
  .then( function(u) {
  $scope.users = u;
  //$scope.person.selected =u.filter(function(obj) {return obj._id==Sgroupe.owner._id;})[0];
  });
  $scope.ok = function (form) {
  $scope.submitted=true;
  if(form.$valid) {
  //alert($scope.groupe.name);
  Auth.createGroupe({
          name: $scope.groupe.name,
          info: $scope.groupe.info,
          type: $scope.groupe.type,
          owner:$scope.person.selected._id  
        })
  .then( function(r) {
         console.log("Add is OK " + r.name + " "+r.info);
         Sgroupes.push(r); 
         //Sgroupes();
         $modalInstance.close();
        })
 .catch( function(err) {
          err = err.data;
          $window.alert("Erreur en création : "+ err);
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
             angular.forEach(err.errors, function(error, field) {
             form[field].$setValidity('mongoose', false);
             $scope.errors[field] = error.message;
          });
          });
 }
  };

  $scope.cancel = function () {
    console.log("Abandon "+$scope.groupe.uid);
    $modalInstance.dismiss('cancel');
  };
});

