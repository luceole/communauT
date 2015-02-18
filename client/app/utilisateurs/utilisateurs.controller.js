'use strict';

angular.module('testApp')
  .controller('UtilisateursCtrl', function($scope, $http, $modal, $window, Auth, User) {

    console.log("Utilisateurstrl");
    $scope.users = User.query();
    $scope.active = function(user) {
      user.isactif = true;
      user.isdemande = false;
      Auth.updateUser(user._id, user, function(u, err) {
        if (err) {
          alert("Erreur MAJ " + err.name);
        }
      });
    };
    $scope.deactive = function(user) {
      if (user.role === "admin") {
        if (!$window.confirm("Déactivation ADMIN : Etes vous sur ?")) {
          return;
        }
      }
      user.isactif = false;
      user.isdemande = false;
      Auth.updateUser(user._id, user, function(u, err) {
        if (err) {
          $window.alert("Erreur MAJ " + err);
        }
      });
    };

    $scope.edit = function(usr) {
      $modal.open({
        controller: 'ModalEditCtrl',
        templateUrl: 'modalEdit.html',
        resolve: {
          Suser: function() {
            return usr;
          }
        }
      });
    };

    $scope.delete = function(user) {
      if ($window.confirm("Suppression" + user.name)) {
        User.remove({
          id: user._id
        });
        /*
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
        */
        $scope.users.splice($scope.users.indexOf(user), 1);
      }
    };
  });

angular.module('testApp')
  .controller('ModalEditCtrl', function($scope, $modalInstance, $window, Auth, User, Suser) {
    $scope.user = new User(Suser);
    //$scope.user=  User.get({id: Suser._id});
    $scope.ok = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
          console.log($scope.user)
        //Auth.updateMe($scope.user._id, {
        Auth.updateUser($scope.user._id, {
            name: $scope.user.name,
            surname: $scope.user.surname,
            structure: $scope.user.structure,
            email: $scope.user.email,
            isactif : $scope.user.isactif,
            role: $scope.user.role
          })
          .then(function() {
            Suser.name = $scope.user.name;
            Suser.surname = $scope.user.surname;
            Suser.email = $scope.user.email;
            Suser.structure = $scope.user.structure;
            Suser.role = $scope.user.role;  
            Suser.isactif=$scope.user.isactif;
            $modalInstance.close();
            console.log("Maj is OK " + $scope.user.uid);
          })
          .catch(function(err) {
            err = err.data;
            $window.alert("Maj Erreur " + err);
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
        //$modalInstance.close($scope.user);
      }
    };
    $scope.cancel = function() {
      console.log("Abandon " + $scope.user.uid);
      $modalInstance.dismiss('cancel');
    };
  });