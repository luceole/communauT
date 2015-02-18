'use strict';
angular.module('testApp')
  .controller('EvenementCtrl', function ($scope,$http,$modal,Groupe,Events) {
  $('#ui-calendar').fullCalendar({
  lang:'fr'
});
$scope.alertOnEventClick= function(ev) { alert(ev.title+ " "+ev.lieu)}; 

 $scope.edit = function(usr) {
     $modal.open({
      controller: 'ModalEditCtrl',
      templateUrl: 'modalEdit.html',
        resolve: {
          Suser: function () {
          return usr;
          }
        }
        });
    };

$scope.alertOnDayClick=$scope.edit;
  $scope.uiConfig = {
      calendar:{
        height: 550,
        editable: true,
        header:{
       center: 'title',
       left: 'month basicWeek agendaDay ',
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
$scope.uiConfig.calendar.monthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];
$scope.uiConfig.calendar.monthNamesShort = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil","Aout","Sept","Oct","Nov","Dec"];
$scope.uiConfig.calendar.dayNamesShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

 $scope.changeView = function(view,calendar) {
      $scope.uiConfig.calendar.view=view;
    };

$scope.events =  [
				{
					title: 'All Day Event',
					start: '2015-02-01'
				},
				{
					title: 'Conflit',
					start: '2015-02-07',
					end: '2015-02-10',
                                        lieu: 'Dijon'
				},
				{
					title: 'Long Event',
					start: '2015-02-05',
					end: '2015-02-09',
                                        lieu: 'Dijon'
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2015-02-09T16:00:00'
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2015-02-16T16:00:00'
				},
				{
					title: 'Conference',
					start: '2015-02-11',
					end: '2015-02-13'
				},
				{
					title: 'Meeting',
					start: '2015-02-12T10:30:00',
					end: '2015-02-12T12:30:00'
				},
				{
					title: 'Lunch',
					start: '2015-02-12T12:00:00'
				},
				{
					title: 'Meeting',
					start: '2015-02-12T14:30:00'
				},
				{
					title: 'Happy Hour',
					start: '2015-02-12T17:30:00'
				},
				{
					title: 'Dinner',
					start: '2015-02-12T20:00:00'
				},
				{
					title: 'Birthday Party',
					start: '2015-02-13T07:00:00'
				},
				{
					title: 'Click for Google',
					url: 'http://google.com/',
					start: '2015-02-28'
				}
			];

  //$scope.eventSources = [$scope.events,Events.query() ];
  $scope.eventSources = [Events.query()];
    $scope.message = 'Hello';
  });


angular.module('testApp')
  .controller('ModalEditCtrl', function ($scope, $modalInstance, $window, Auth,User, Suser) {

});
