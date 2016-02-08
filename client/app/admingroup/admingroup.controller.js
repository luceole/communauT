'use strict';

angular.module('testApp')
  .controller('AdmingroupCtrl', function ($scope, $http, $modal, $window, socket, Auth, User, Groupe) {
    console.log('AdmingroupCtrl');
    $scope.groupes = Groupe.query();

    socket.syncUpdates('groupe', $scope.groupes, function (event, item, object) {
      $scope.groupes = Groupe.query();
      console.log(item);
    });
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('groupe');
    });
    $scope.refresh = function () {};
    $scope.edit = function (gp) {
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
    $scope.add = function () {
      $modal.open({
        controller: 'ModalAddAdminGroupCtrl',
        templateUrl: 'modalAddAdminGroup.html',
        resolve: {
          Sgroupes: function () {
            return $scope.groupes;
          }
        }
      });
    };

    $scope.delete = function (grp) {
      if ($window.confirm("Suppression de " + grp.name)) {
        Groupe.remove({
          id: grp._id
        });
        /*
              angular.forEach($scope.groupes, function(u, i) {
                if (u ==== grp) {
                  $scope.groupes.splice(i, 1);
                }
              });
        */
        $scope.groupes.splice($scope.groupes.indexOf(grp), 1);
      }
    };

  });

//EDIT GROUP

/***** ILFAUT aussi mettre à jour l'utilisateur=> adminOf *****/
angular.module('testApp')
  .controller('ModalEditAdminGroupCtrl', function ($scope, $modalInstance, $window, Auth, User, Groupe, Sgroupe) {
    $scope.groupe = new Groupe(Sgroupe);
    $scope.person = {};
    $scope.admin = {};
    $scope.forms = {};
    $scope.typeoptions = [
      {
        id: 0,
        name: "Ouvert"
     },
      {
        id: 5,
        name: "Modéré"
      },
      {
        id: 10,
        name: "Réservé"
      }
    ];

    $scope.person.selected = $scope.groupe.owner;
    //  $scope.admin.selected = $scope.groupe.adminby[0];

    Auth.listadmin()
      .then(function (u) {
        $scope.listadmin = u;
        //         $scope.person.selected = u.filter(function (obj) {
        //           return obj._id == Sgroupe.owner._id;
        //         })[0];
      });

    Auth.listadmgrp()
      .then(function (liste) {
        $scope.listadmgrp = liste;
      });




    $scope.ok = function (form) {
      $scope.submitted = true;
      console.log($scope.forms.tab1.$valid)
      if ($scope.forms.tab1.$valid) {
        var Nadm = [];
        angular.forEach($scope.groupe.adminby, function (user) {
          Nadm.push(user._id)
        });
        Auth.updategroupe($scope.groupe._id, {
            info: $scope.groupe.info,
            type: $scope.groupe.type,
            owner: $scope.person.selected._id,
            adminby: Nadm
          })
          .then(function (r) {
            Sgroupe.info = r.info;
            Sgroupe.type = r.type;
            Sgroupe.owner.uid = $scope.person.selected.uid;
            $modalInstance.close();
          })
          .catch(function (err) {
            err = err.data;
            $window.alert("Erreur de mise à jour: " + err);
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };

    $scope.cancel = function () {
      console.log("Abandon " + $scope.groupe.uid);
      $modalInstance.dismiss('cancel');
    };

    $scope.addAdm = function (user, grpadm) {
      grpadm.push(user)
    }

    $scope.delAdm = function (user, grpadm) {
      grpadm.splice(grpadm.indexOf(user), 1);
    }
  });


// Group Create
angular.module('testApp')
  .controller('ModalAddAdminGroupCtrl', function ($scope, $modalInstance, $window, Auth, User, Groupe, Sgroupes) {
    $scope.groupe = new Groupe();
    $scope.person = {};
    $scope.admin = {};
    $scope.typeoptions = [
      {
        id: 0,
        name: "Ouvert"
     },
      {
        id: 5,
        name: "Modéré"
      },
      {
        id: 10,
        name: "Réservé"
      }
    ];

    $scope.groupe.type = 0;
    Auth.listadmin()
      .then(function (u) {
        $scope.listadmin = u;
        //         $scope.person.selected = u.filter(function (obj) {
        //           return obj._id == Sgroupe.owner._id;
        //         })[0];
      });

    Auth.listadmgrp()
      .then(function (liste) {
        $scope.listadmgrp = liste;
      });

    $scope.ok = function (form) {
      $scope.submitted = true
      if (form.$valid) {
        if ($scope.admin.selected == undefined) $scope.admin.selected = $scope.person.selected;
        Auth.createGroupe({
            name: $scope.groupe.name,
            info: $scope.groupe.info,
            type: $scope.groupe.type,
            owner: $scope.person.selected._id,
            adminby: $scope.admin.selected._id
          })
          .then(function (r) {
            console.log("Add is OK " + r.name + " " + r.info);
            r.owner = {
              _id: $scope.person.selected._id,
              uid: $scope.person.selected.uid
            };
            Sgroupes.push(r);
            $modalInstance.close();
          })
          .catch(function (err) {
            err = err.data;
            $window.alert("Erreur en création : " + err);
            $scope.errors = {};
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };

    $scope.cancel = function () {
      console.log("Abandon " + $scope.groupe.uid);
      $modalInstance.dismiss('cancel');
    };
  });
