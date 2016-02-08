'use strict';

angular.module('testApp')
  .controller('MainCtrl', function ($scope, $http, $location, $compile, $timeout, $cookies, $window, $modal, socket, uiCalendarConfig, Auth, Calendar) {
    $scope.openPad = function (grp) {
      $http.post('/api/pads', {
        authorID: $scope.getCurrentUser().authorPadID,
        groupID: grp.groupPadID
      }).
      success(function (data) {
        if (data) {
          $cookies.put('sessionID', data.sessionID);
          $window.open('//localhost:9001/p/' + grp.groupPadID + "$" + grp.name + "?userName=" + $scope.getCurrentUser().name);
        } else alert("Pad  non trouvé ou vous n'êtes pas autorisé");
      }).
      error(function (err) {
        console.log("err :" + err)
        alert("Serveur Pad  non actif");
      });
    };

    $scope.openNote = function (grp) {
      $modal.open({
        templateUrl: 'modalNote.html',
        controller: 'ModalNoteCtrl',
        resolve: {
          grp: function () {
            return grp;
          }
        }
      });
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.alert = {
      type: 'success',
      msg: "cliquez sur un évément pour vous inscrire ou dé-inscrire."
    };

    $scope.errors = {};
    $scope.eventSources = [];
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.user = $scope.getCurrentUser();
    $scope.userGroupes = $scope.user.memberOf;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.isAdmin_grp = Auth.isAdmin_grp;
    $scope.isActif = Auth.isActif;
    $scope.Evt = {
      test: "test"
    }


    // Logging
    $scope.login = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        Auth.login({
            uid: $scope.user.uid,
            password: $scope.user.password
          })
          .then(function () {
            // Logged in, redirect to home
            $location.path('/');
          })
          .catch(function (err) {
            $scope.errors.other = 'ERREUR : ' + err.message;
          });
      }
    };

    // Calendar
    $scope.watchColor = function (event) {
      return event.color
    }

    $scope.CallInit = function () {
      $scope.user = $scope.getCurrentUser();
      $scope.userGroupes = $scope.user.memberOf;
      $scope.refreshEvents();
    }

    $scope.updateEvent = function (event) {
      console.log("updateEvent TOP");
    }

    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
      var StartStop = event.start.format('DD/MM/YYYY')
      if (!event.allDay && event.end) {
        StartStop = event.start.format('DD/MM/YYYY HH:mm') + "  - " + event.end.format('hh:mm')
      }
      console.log(event.source.group)
      $window.localStorage.setItem('eventPadId', event.eventPadID);

      var icalEvent = {
        start: new Date(event.start.format()),
        end: new Date(event.end.format())
      };
      icalEvent.title = event.groupe;
      icalEvent.description = event.info + " " + event.lieu;
      icalEvent.addresss = event.lieu;




      element.qtip({
          content: {
            button: true,
            title: event.title,
            text: "Groupe: " + event.groupe + "<br>info: " + event.info + "<br> Lieu: " + event.lieu + "<br>" + StartStop + "<br> <a href='/note'>PAD</a> <a href='" + Calendar.ical(icalEvent) + "'> ICAL </a> <a href='" + Calendar.google(icalEvent) + "'> GOOGLE </a> "
              /* text: "Groupe: " + event.groupe + "<br> Lieu: " + event.lieu + "<br>" + StartStop + "<br> <a href='/note'>PAD</a>"*/
          },
          hide: {
            delay: 3000
          },
          show: {
            solo: true
          }
        }

      );
    }

    $scope.alertOnEventClick = function (event) {
      var message = "";
      var myUid = $scope.user._id;
      if (event.participants.filter(function (item) {
          return ((item) && item._id == myUid)
        }).length) {
        message = "Dé-inscription de " + event.title + " effectuée";
      } else {
        message = "Inscription à " + event.title + " effectuée";
      }
      Auth.eventparticipate(event.source.group._id, {
          _id: event._id,
          UserId: myUid
        })
        .catch(function (err) {
          console.log("Erreur " + err);
        })
        .then(function (data) {
          $scope.alert = {
            type: 'success',
            msg: message
          };
          $timeout(function () {
            $scope.alert = {
              type: 'success',
              msg: "cliquez sur un évément pour vous inscrire ou dé-inscrire."
            };
          }, 2000);
          $scope.refreshEvents();
        });
    };

    $scope.uiConfig = {
      calendar: {
        lang: 'fr',
        height: 300,
        editable: false,
        timezone: 'local',
        defaultView: 'basicWeek',
        header: {
          center: 'title',
          left: ' month basicWeek',
          right: ' prev today next'
        },
        eventRender: $scope.eventRender,
        eventClick: $scope.alertOnEventClick,
        changeView: $scope.changeView
      }
    };

    $scope.uiConfig.calendar.dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    $scope.uiConfig.calendar.monthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
    $scope.uiConfig.calendar.monthNamesShort = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"];
    $scope.uiConfig.calendar.dayNamesShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];


    $scope.changeView = function (event, view, calendar) {
      $scope.refreshEvents();
      console.log("changeView")
      $scope.uiConfig.calendar.view = view;
    };


    $scope.selectedGroupeInfo = "";
    if ($scope.isLoggedIn) {
      $scope.userGroupes = $scope.user.memberOf;
    }

    $scope.refreshEvents = function () {
      var eventsGroupe = {};
      //var workEvents = [];
      var couleur = ['DotgerBlue', 'chocolate', 'ForestGreen', 'DarkRed', 'FireBrick', 'Tan', 'Peru', 'oliveDrab', 'Lavender', 'GoldenRod', 'CornFlowerBlue', 'LightSkyBlue', 'grey'];
      var myUid = $scope.getCurrentUser()._id;
      $scope.userGroupes = $scope.user.memberOf;
      angular.forEach($scope.userGroupes, function (grp, index) {
        Auth.eventsofgroup(grp._id)
          .then(function (data) {
            if (data.length > 0) {
              //eventsGroupe.events = data;
              angular.forEach(data, function (ev, ind) {
                if (ev.participants.filter(function (item) {
                    return ((item) && item._id == myUid)
                  }).length) {
                  ev.color = "green";
                } else {
                  ev.color = "red";
                }
              });
              eventsGroupe.events = angular.copy(data);
              eventsGroupe.index = index;
              eventsGroupe.groupe_id = grp._id;
              eventsGroupe.group = {
                _id: grp._id,
                info: grp.info
              }
              $scope.eventSources[index] = angular.copy(eventsGroupe);
              eventsGroupe = {};

            }
          });
      });
    }
    Auth.isLoggedInAsync($scope.CallInit);

  })
  .controller('ModalNoteCtrl', function ($scope, $modalInstance, Groupe, Auth, socket, grp) {
    $scope.options = {
      language: 'fr',
      // uiColor: "#66AB16",
      readOnly: true,
      width: '98%',
      height: 400
    };
    $scope.isAdmin = Auth.isAdmin;
    $scope.isAdmin_grp = Auth.isAdmin_grp;
    $scope.msg = "Sauvegarder :"
    $scope.info = grp.info;

    Auth.getGroupe(grp._id,
      function (g) {
        $scope.content = g.note;
      });

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.save = function () {
      Auth.updategroupe(grp._id, {
          note: $scope.content
        })
        .then(function (r) {
          $modalInstance.close();
        })
        .catch(function (err) {
          $scope.msg = "Erreur :" + err.data;
        });
    };
  });
