'use strict';
angular.module('communauT')
  .filter('ouinon', function () {
    return function (input) {
      return input ? 'Oui' : 'Non';
    }
  })
  .controller('PollCtrl', function ($scope, $http, $modal, socket, Auth, User, Poll, Groupe, GroupeOf, Mypolls) {

    $scope.user = Auth.getCurrentUser();
    var userGroupes = [];
    $scope.user.memberOf.forEach(function (p) {
      userGroupes.push(p.name);
    });
    userGroupes.push('') // pour toujours avoir un tableau à transmettre !
    $scope.polls = Mypolls.query({
      mygrp: userGroupes
    });

    socket.syncUpdates('poll', $scope.polls, function (event, item, object) {
      $scope.polls = Mypolls.query({
        mygrp: userGroupes
      });

    });
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });



    $scope.rep = function (poll) {
      var modalInstance = $modal.open({
        controller: 'ModalRepPollCtrl',
        templateUrl: 'modalRepPoll.html',
        size: 'lg',
        resolve: {
          selectedPoll: function () {
            return poll;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {}, function () {
        $scope.polls = Mypolls.query({
          mygrp: userGroupes
        });
      });
    };


  });

angular.module('communauT')
  .controller('ModalRepPollCtrl', function ($scope, $modal, $modalInstance, $window, $timeout, $filter, Auth, User, Groupe, Poll, selectedPoll) {
    $scope.repuser = [];
    $scope.totx = [];
    $scope.doTxt = function (r, i) {
      if (r) $scope.totx[i] = $scope.totx[i] + 1;
    }
    $scope.subHeaders = function () {
      var subs = [];
      $scope.propositions.forEach(function (col) {
        col.sttime.forEach(function (sub) {
          subs.push(sub);
          $scope.repuser.push(false)
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

    $scope.email = $scope.user.email;
    $scope.resultats = $scope.poll.resultats;
    $scope.found = $filter('filter')($scope.resultats, {
      user: {
        email: $scope.email
      }
    }, true);
    console.log($scope.found);
    if ($scope.found.length) {
      console.log("trouvé")
        // Remplacer directement
      var i = $scope.resultats.indexOf($scope.found[0]);
      // console.log($scope.resultats[i].reponses)
      $scope.repuser = $scope.resultats[i].reponses;
      $scope.resultats.splice($scope.resultats.indexOf($scope.found[0]), 1);
    }


    $scope.rep = function (r) {
      //  console.log(r)
      return r.reponses;
    }




    $scope.ok = function () {


      var newRep = {
        user: {
          email: $scope.email
        },
        reponses: $scope.repuser
      };

      console.log($scope.poll)
      Auth.votePoll($scope.poll._id, {
          resultats: $scope.poll.resultats,
          vote: newRep
        })
        .then(function (r) {
          console.log("Maj is OK ");
          $modalInstance.close();
        })
        .catch(function (err) {
          err = err.data;
          console.log(err)
          $window.alert("Erreur en modification : " + err);
        });
    }

    $scope.cancel = function () {
      $scope.resultats = $scope.poll.resultats;
      $modalInstance.dismiss('cancel');
    };
  });
