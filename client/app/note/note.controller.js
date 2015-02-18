'use strict';

angular.module('testApp')
  .controller('NoteCtrl', function ($http, $scope, $cookies, $window, $location, Auth) {
    $scope.message = 'Hello';
    $scope.OpenPad = function (padId) {
        //  g.ZHktrY4WZSgEYlFA$2015-12-14-2015-12-14
        var groupId = padId.split("$")[0];
        $http.post('/api/pads', {
          authorID: $scope.getCurrentUser().authorPadID,
          groupID: groupId
        }).
        success(function (data) {
          if (data) {
            $cookies.put('sessionID', data.sessionID);
            $window.open('http://localhost:9001/p/' + padId + '?userName = ' + $scope.getCurrentUser().name);
          } else alert("Pad  non trouvé ou vous n'êtes pas autorisé");
        }).error(function (err) {
          console.log("err :" + err)
          alert("Serveur Pad  non actif");
        });
      }
      // console.log(Evt)
    $scope.getCurrentUser = Auth.getCurrentUser;
    var eventPadId = $window.localStorage.getItem('eventPadId')
    console.log(eventPadId)
    $scope.OpenPad(eventPadId)
    $location.path('/');
  });
