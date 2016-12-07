'use strict';
'use strict';
angular.module('testApp')
  .controller('EvenementCtrl', function ($scope, $http, $modal, $filter, $compile, Auth, Groupe, Events, Calendar) {
    $scope.eventSources = [];
    $scope.selectedGroupeInfo = "";
    //        $scope.userGroupes = Auth.getCurrentUser().memberOf;
    if (Auth.isAdmin()) {
      $scope.isadminGroupes = Auth.getCurrentUser().adminOf;
      console.log("i am admin");
    } else {
      $scope.isadminGroupes = Auth.getCurrentUser().adminOf;
    }
    $scope.userGroupes = $scope.isadminGroupes;

    $scope.refreshEvents = function () {
      var eventsGroupe = {};
      var couleur = ['chocolate', 'FireBrick', 'Tan', 'Peru', 'oliveDrab', 'Lavender', 'GoldenRod', 'CornFlowerBlue', 'LightSkyBlue', 'grey', 'DotgerBlue', 'ForestGreen', 'DarkRed', ];
      console.log("refreshEvent");
      angular.forEach($scope.isadminGroupes, function (grp, index) {
        //console.log(grp);
        //var myUid = Auth.getCurrentUser()._id;
        Auth.eventsofgroup(grp._id)
          .then(function (data) {
            if (data.length > 0) {
              eventsGroupe.events = angular.copy(data);
              eventsGroupe.color = couleur[index]; // Todo  Index > couleur.length !
              eventsGroupe.index = index;
              eventsGroupe.groupe_id = grp._id;
              // eventsGroupe.groupe_isadmin = grp.admins.indexOf(myUid);  // TODO Gestion des droits administrateur
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
    $scope.refreshEvents();

    // ** Modification **//
    $scope.editEvent = function (ev, jsEvent, view) {
      console.debug('editEvent');
      console.debug(ev);
      var modalInstance = $modal.open({
        controller: 'ModalEditEvCtrl',
        templateUrl: 'modalEv.html',
        resolve: {
          Sdate: function () {
            return ev.start;
          },
          updateEvent: function () {
            return ev;
          },
          userGroupes: function () {
            return $scope.userGroupes
          },
          refreshEvents: function () {
            return $scope.refreshEvents
          },
          eventSources: function () {
            return $scope.eventSources
          }
        }
      });
    };

    // ** Ajout **//
    $scope.addEvent = function (date, jsEvent, view) {
      $modal.open({
        controller: 'ModalEditEvCtrl',
        templateUrl: 'modalEv.html',
        resolve: {
          Sdate: function () {
            return date;
          },
          updateEvent: function () {
            return;
          },
          userGroupes: function () {
            return $scope.userGroupes
          },
          refreshEvents: function () {
            return $scope.refreshEvents
          },
          eventSources: function () {
            return $scope.eventSources
          }
        }
      });
    };


    // Drag&Drop
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
      $scope.alertMessage = ('  * Evenement modifé Debute à ' + event.start.format());
      if (!event.allDay) {
        event.end = event.end; // Never NULL => ForceEventDuration exept for AllDay Event
      }

      Auth.eventupdate(event.source.group._id, {
        _id: event._id,
        allDay: event.allDay,
        start: new Date(event.start),
        end: new Date(event.end)
      }).then(function (data) {
        $scope.refreshEvents();
      })
    };

    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
      $scope.alertMessage = (' *  Evenement modifé termine à ' + event.end.format());
      Auth.eventupdate(event.source.group._id, {
        _id: event._id,
        start: event.start,
        end: event.end
      });
    };

    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
      if (event.end == null )  event.end=event.start;
      var icalEvent = {
        // start: new Date(event.start + (60 * 60 * 1000)), // Marche pas jour complet !!!
        start: new Date(event.start.format()),
        end: new Date(event.end.format())
      };
      icalEvent.title = event.groupe;
      icalEvent.description = event.info + " " + event.lieu;
      icalEvent.addresss = event.lieu;
      var StartStop = event.start.format('DD/MM/YYYY')
      if (!event.allDay && event.end) {
        StartStop = event.start.format('DD/MM/YYYY HH:mm') + "  - " + event.end.format('hh:mm');
      }
      console.log(icalEvent)
      element.qtip({
        content: {
          button: true,
          title: event.title,
          text: "Groupe: " + event.groupe + "<br>info: " + event.info + "<br> Lieu: " + event.lieu + "<br>" + StartStop + "<br> <a href='/note'>PAD</a> <a href='" + Calendar.ical(icalEvent) + "'> ICAL </a> <a href='" + Calendar.google(icalEvent) + "'> GOOGLE </a> "
            /* text: "Groupe: " + event.groupe + "<br>info: " + event.info + "<br> Lieu: " + event.lieu + "<br>" + StartStop + "<br> <a href='/note'>PAD</a>"*/
        },
        hide: {
          delay: 2500
        },
        show: {
          solo: true
        }
      });

    }

    $scope.alertOnEventClick = $scope.editEvent;
    $scope.alertOnDayClick = $scope.addEvent;
    $scope.uiConfig = {
      calendar: {
        lang: 'fr',
        height: 550,
        editable: true,
        timezone: 'local',
        forceEventDuration: true,
        header: {
          center: 'title',
          left: 'month agendaWeek agendaDay ',
          right: 'today prev,next'
        },
        dayClick: $scope.alertOnDayClick,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    $scope.uiConfig.calendar.dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    $scope.uiConfig.calendar.monthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
    $scope.uiConfig.calendar.monthNamesShort = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"];
    $scope.uiConfig.calendar.dayNamesShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    /* $scope.changeView = function (view, calendar) {
       refreshEvents();
       alert("view");
       $scope.uiConfig.calendar.view = view;
     };*/

  });

angular.module('testApp')
  .controller('ModalEditEvCtrl', function ($scope, $modalInstance, $window, $filter, Auth, Groupe, Events, updateEvent, Sdate, userGroupes, eventSources, refreshEvents) {
    $scope.forms = {};
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'short'];
    $scope.format = $scope.formats[2];
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.backupEvent = new Events();
    $scope.calEvent = new Events();
    $scope.grp = {};
    $modalInstance.result.then(function () {
      refreshEvents();
    }, function () {
      console.debug('Modal dismissed');
    });


    if (updateEvent) { //Update Event
      $scope.newEv = false;
      $scope.titre = "Modification de l'événement";
      $scope.backupEvent = updateEvent._id;
      $scope.calEvent.title = updateEvent.title;
      $scope.calEvent.info = updateEvent.info;
      $scope.calEvent.participants = updateEvent.participants;
      $scope.calEvent.allDay = updateEvent.allDay;
      $scope.calEvent.start = new Date(updateEvent.start);
      $scope.calEvent.lieu = updateEvent.lieu;
      if (updateEvent.end) {
        $scope.calEvent.end = new Date(updateEvent.end);
      } else {
        $scope.calEvent.end = new Date(updateEvent.start);
      }
      $scope.userGroupes = userGroupes;
      $scope.selectedGroupeInfo = updateEvent.source.group.info;
    } else // New Event
    {
      $scope.newEv = true;
      $scope.titre = "Ajout d'un événement";
      $scope.calEvent.start = new Date(Sdate);
      $scope.calEvent.end = new Date(Sdate);
      $scope.Groupes = userGroupes;
      $scope.grp.selected = userGroupes[0];
      $scope.calEvent.info = "REUNION";
      $scope.isadminGroupes = userGroupes;
      $scope.grp.selected = userGroupes[0];
      $scope.libDate = Sdate.format();
      $scope.calEvent.allDay = true;
    }
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.openDD = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedDD = true;
    };
    $scope.openDF = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedDF = true;
    };
    $scope.delete = function () {
      if ($scope.calEvent.participants.length > 0) {
        if (!$window.confirm("Attention des participants sont inscrits \nConfirmez vous la suppression?")) {
          return;
        }
      }
      Auth.eventdelete(updateEvent.source.groupe_id, {
          id: $scope.backupEvent
        })
        .then(function (data) {
          $modalInstance.close();
        })
        .catch(function (err) {
          err = err.data;
          $window.alert("Maj Erreur " + err);
          console.log(err);
          $modalInstance.close();
        });
    };

    $scope.ok = function (form) {

      $scope.submitted = true;
      console.log($scope.forms.tab1.$valid)
      if ($scope.forms.tab1.$valid) {

        if ($scope.newEv) {
          console.log("Ajout  ");
          console.debug($scope.grp.selected);
          $scope.calEvent.title = $scope.grp.selected.info;
          $scope.calEvent.groupe = $scope.grp.selected.info;
          console.log($scope.calEvent);
          Auth.eventupdate($scope.grp.selected._id, $scope.calEvent)
            .then(function (e) {
              $modalInstance.close();
            })
            .catch(function (err) {
              err = err.data;
              $window.alert("Maj Erreur : " + err);
              console.log(err);
              $modalInstance.close();
              /*$scope.errors = {};
              // Update validity of form fields that match the mongoose errors
              angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;*/
            });
        } else {
          console.log("Modification");
          // On efface et on recreer => (o) cf Function eventUpdate du serveur 
          Auth.eventdelete(updateEvent.source.groupe_id, {
              id: $scope.backupEvent
            })
            .then(function (e) {

              var partab = [];
              angular.forEach($scope.calEvent.participants, function (participant) {
                var id = participant._id
                partab.push(id);
              });
              $scope.calEvent.participants = partab;
              $scope.calEvent.groupe = updateEvent.source.group.info;
              console.log($scope.calEvent);
              Auth.eventupdate(updateEvent.source.groupe_id, $scope.calEvent)
                .then(function (e) {
                  $modalInstance.close();
                })
                .catch(function (err) {
                  console.log(err);
                  err = err.data;
                  $window.alert("Maj Erreur : " + err);
                  $modalInstance.close();
                  $scope.errors = {};
                  // Update validity of form fields that match the mongoose errors
                  angular.forEach(err.errors, function (error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = error.message;
                  });
                });

            }).catch(function (err) {
              console.log(err);
              err = err.data;
              $window.alert("Maj Erreur : " + err);
              $modalInstance.close();
            });
        }
      }
    }
  });
