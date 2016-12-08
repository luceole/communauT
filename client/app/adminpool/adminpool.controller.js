'use strict';

angular.module('communauT')
  .controller('AdminPoolCtrl', function ($scope, $http, $modal, $window, socket, Auth, User, Groupe, Pool) {
    $scope.groupes = Groupe.query();
    $scope.pools = Pool.query();

    socket.syncUpdates('pool', $scope.pools, function (event, item, object) {});
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('pool');
    });

    $scope.delete = function (pool) {
      if ($window.confirm("Suppression de " + pool.name)) {
        Pool.remove({
          id: pool._id
        });
      };
    };
    $scope.refresh = function () {};
    $scope.active = function (pool) {
      pool.isActif = !pool.isActif;
      Auth.updatePool(pool._id, {
          isActif: pool.isActif
        }).then(function (r) {
          console.log("Maj is OK ");
        })
        .catch(function (err) {
          err = err.data;
          console.log(err)
          $window.alert("Erreur en modification : " + err);
        });
    }

    $scope.add = function (pool) {
      $modal.open({
        controller: 'ModalAddAdminPoolCtrl',
        templateUrl: 'modalAddAdminPool.html',
        size: 'lg',
        resolve: {
          selectedPool: function () {
            return pool;
            //return null;
          }
        }
      });
    };

    /* $scope.edit = function (pool) {
       $modal.open({
         controller: 'ModalAddAdminPoolCtrl',
         templateUrl: 'modaAddAdminPool.html',
         size: 'lg',
         resolve: {
           selectedPool: function () {
             return pool;
           }
         }
       });
     };*/


    $scope.view = function (pool) {
      var modalInstance = $modal.open({
        controller: 'ModalViewPoolCtrl',
        templateUrl: 'modalViewPool.html',
        size: 'lg',
        resolve: {
          selectedPool: function () {
            return pool;
          }
        }
      });
    };


  });

// Create & Modify Pool
angular.module('communauT')
  .controller('ModalAddAdminPoolCtrl', function ($scope, $modal, $modalInstance, $window, $timeout, $filter, Auth, User, Groupe, Pool, selectedPool) {
    $scope.active = {};
    $scope.titre = "Création d'un sondage";
    var newPool = false;
    if (Auth.isAdmin()) {
      $scope.isadminGroupes = Auth.getCurrentUser().adminOf;
      console.log("i am admin");
    } else {
      $scope.isadminGroupes = Auth.getCurrentUser().adminOf;
    }
    $scope.pool = new Pool(selectedPool);

    if (!angular.isObject(selectedPool)) { //CREATE
      console.log("CREATE")
      newPool = true;
      $scope.disable = {
        tab0: false,
        tab1: true,
        tab2: true
      }
      $scope.propositions = [];
      $scope.grp = {};
    } else // MODIFY

    {
      console.log("MODIFY");
      newPool = false;
      $scope.titre = "Modification du sondage"
      $scope.disable = {
        tab0: false,
        tab1: false,
        tab2: false
      }
      $scope.grp = {};
      $scope.propositions = angular.copy($scope.pool.propositions)
      $scope.grp.selected = $filter('filter')($scope.isadminGroupes, {
        _id: $scope.pool.groupe
      }, true)[0];
      console.log($scope.grp.selected)
    }

    $scope.delChx = function (chx) {
      $scope.propositions.splice($scope.propositions.indexOf(chx), 1);
    };

    $scope.dup = function (x) {
      angular.forEach($scope.propositions, function (p) {
        p.sttime[x] = $scope.propositions[0].sttime[x]
      });
    };

    $scope.alertOnDayClick = function test(date, jsEvent, view) {
      var prop = {
        date: date,
        stdate: date.format('DD/MM/YYYY'),
        sttime: []
      }
      var found = $filter('filter')($scope.propositions, {
        stdate: prop.stdate
      }, true);
      if (!found.length) {
        $scope.propositions.push(prop);
      }
    };

    $scope.uiConfig = {
      calendar: {
        lang: 'fr',
        height: 260,
        editable: false,
        timezone: 'local',
        defaultView: 'month',
        header: {
          center: 'title',
          left: ' month, basicWeek',
          right: ' prev today next'
        },
        dayClick: $scope.alertOnDayClick
      }
    }

    $scope.uiConfig.calendar.dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    $scope.uiConfig.calendar.monthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
    $scope.uiConfig.calendar.monthNamesShort = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"];
    $scope.uiConfig.calendar.dayNamesShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];


    $scope.initCalendar = function () {
      if ($scope.disable.tab1 != true) {
        // Calendar in Tabset need this !
        $timeout(function () {
          $('#calendar').fullCalendar('render');
        }, 0);

      } else {
        /*  $scope.active = {};
          $scope.active.tab0 = true;*/
        //alert("Merci de remplir le premier onglet")
      }
    }

    $scope.initTime = function () {
      console.log($scope.propositions.length);
      if ($scope.propositions.length > 0) {

      } else {
        /*  $scope.active = {};
          $scope.active.tab1 = true;*/
        //alert("Merci de remplir les dates")
      }
    }

    $scope.ok1 = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        $scope.disable.tab1 = false;
        $scope.active = {};
        $scope.active.tab1 = true;
        $timeout(function () {
          $('#calendar').fullCalendar('render');
        }, 0);
      }
    }
    $scope.ok2 = function () {
      $scope.disable.tab2 = false;
      $scope.active = {};
      $scope.active.tab2 = true;
    }
    $scope.ok = function () {
      console.log("OK")
      console.log($scope.pool)
      console.log($scope.grp.selected)
        /* $scope.submitted = true
         if (form.$valid) {*/
      if (newPool) {
        Auth.createPool({
            name: $scope.pool.name,
            info: $scope.pool.info,
            groupe: $scope.grp.selected._id,
            groupeInfo: $scope.grp.selected.info,
            groupeName: $scope.grp.selected.name,
            isActif: false,
            propositions: $scope.propositions
          })
          .then(function (r) {
            console.log("Add is OK ");
            $modalInstance.close();
          })
          .catch(function (err) {
            err = err.data;
            console.log(err)
            $window.alert("Erreur en création : " + err);
            $scope.errors = {};
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
        //}
      } else {
        Auth.updatePool($scope.pool._id, {
            name: $scope.pool.name,
            info: $scope.pool.info,
            groupe: $scope.grp.selected._id,
            groupeInfo: $scope.grp.selected.info,
            groupeName: $scope.grp.selected.name,
            propositions: $scope.propositions
          })
          .then(function (r) {
            console.log("Maj is OK ");
            $modalInstance.close();
          })
          .catch(function (err) {
            err = err.data;
            console.log(err)
            $window.alert("Erreur en modification : " + err);
            $scope.errors = {};
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    }

    $scope.cancel = function () {
      console.log("Abandon ");
      $modalInstance.dismiss('cancel');
    };
  });

angular.module('communauT')
  .controller('ModalViewPoolCtrl', function ($scope, $modal, $modalInstance, $window, $timeout, $filter, Auth, User, Groupe, Pool, selectedPool) {
    $scope.repuser = [];
    $scope.totx = [];
    $scope.doTxt = function (r, i) {
      if (r) $scope.totx[i] = $scope.totx[i] + 1;
    }
    $scope.subHeaders = function () {
      var subs = [];
      $scope.totx = []
      $scope.propositions.forEach(function (col) {
        col.sttime.forEach(function (sub) {
          subs.push(sub);
          $scope.totx.push(0)
        });
      });
      return subs;
    };
    $scope.user = Auth.getCurrentUser();
    $scope.pool = new Pool(selectedPool);
    $scope.found = [];
    $scope.propositions = $scope.pool.propositions;
    $scope.subDate = $scope.subHeaders();
    $scope.resultats = $scope.pool.resultats;


    $scope.rep = function (r) {
      //  console.log(r)
      return r.reponses;
    }

    $scope.cancel = function () {
      $scope.resultats = $scope.pool.resultats;
      $modalInstance.dismiss('cancel');
    };
  });
