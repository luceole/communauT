'use strict';

angular.module('communauT')
  .controller('AdminPollCtrl', function ($scope, $http, $modal, $window, socket, Auth, User, Groupe, Poll) {
    $scope.groupes = Groupe.query();
    $scope.polls = Poll.query();

    socket.syncUpdates('poll', $scope.polls, function (event, item, object) {});
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });

    $scope.delete = function (poll) {
      if ($window.confirm("Suppression de " + poll.name)) {
        Poll.remove({
          id: poll._id
        });
      };
    };
    $scope.refresh = function () {};
    $scope.active = function (poll) {
      poll.isActif = !poll.isActif;
      Auth.updatePoll(poll._id, {
          isActif: poll.isActif
        }).then(function (r) {
          console.log("Maj is OK ");
        })
        .catch(function (err) {
          err = err.data;
          console.log(err)
          $window.alert("Erreur en modification : " + err);
        });
    }

    $scope.add = function (poll) {
      $modal.open({
        controller: 'ModalAddAdminPollCtrl',
        templateUrl: 'modalAddAdminPoll.html',
        size: 'lg',
        resolve: {
          selectedPoll: function () {
            return poll;
            //return null;
          }
        }
      });
    };

    /* $scope.edit = function (poll) {
       $modal.open({
         controller: 'ModalAddAdminPollCtrl',
         templateUrl: 'modaAddAdminPoll.html',
         size: 'lg',
         resolve: {
           selectedPoll: function () {
             return poll;
           }
         }
       });
     };*/


    $scope.view = function (poll) {
      var modalInstance = $modal.open({
        controller: 'ModalViewPollCtrl',
        templateUrl: 'modalViewPoll.html',
        size: 'lg',
        resolve: {
          selectedPoll: function () {
            return poll;
          }
        }
      });
    };


  });

// Create & Modify Poll
angular.module('communauT')
  .controller('ModalAddAdminPollCtrl', function ($scope, $modal, $modalInstance, $window, $timeout, $filter, Auth, User, Groupe, Poll, selectedPoll) {
    $scope.active = {};
    $scope.titre = "Création d'un sondage";
    var newPoll = false;
    if (Auth.isAdmin()) {
      $scope.isadminGroupes = Auth.getCurrentUser().adminOf;
      console.log("i am admin");
    } else {
      $scope.isadminGroupes = Auth.getCurrentUser().adminOf;
    }
    $scope.poll = new Poll(selectedPoll);

    if (!angular.isObject(selectedPoll)) { //CREATE
      console.log("CREATE")
      newPoll = true;
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
      newPoll = false;
      $scope.titre = "Modification du sondage"
      $scope.disable = {
        tab0: false,
        tab1: false,
        tab2: false
      }
      $scope.grp = {};
      $scope.propositions = angular.copy($scope.poll.propositions)
      $scope.grp.selected = $filter('filter')($scope.isadminGroupes, {
        _id: $scope.poll.groupe
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
      console.log($scope.poll)
      console.log($scope.grp.selected)
        /* $scope.submitted = true
         if (form.$valid) {*/
      if (newPoll) {
        Auth.createPoll({
            name: $scope.poll.name,
            info: $scope.poll.info,
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
        Auth.updatePoll($scope.poll._id, {
            name: $scope.poll.name,
            info: $scope.poll.info,
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
  .controller('ModalViewPollCtrl', function ($scope, $modal, $modalInstance, $window, $timeout, $filter, Auth, User, Groupe, Poll, selectedPoll) {
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
    $scope.poll = new Poll(selectedPoll);
    $scope.found = [];
    $scope.propositions = $scope.poll.propositions;
    $scope.subDate = $scope.subHeaders();
    $scope.resultats = $scope.poll.resultats;


    $scope.rep = function (r) {
      //  console.log(r)
      return r.reponses;
    }

    $scope.cancel = function () {
      $scope.resultats = $scope.poll.resultats;
      $modalInstance.dismiss('cancel');
    };
  });
