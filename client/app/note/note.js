'use strict';

angular.module('communauT')
  .config(function ($stateProvider) {
    $stateProvider
      .state('note', {
        url: '/note',
        templateUrl: 'app/note/note.html',
        controller: 'NoteCtrl'
      });
  });
