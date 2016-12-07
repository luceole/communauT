'use strict';

angular.module('testApp')
  .factory('Demande', function($resource) {
    return $resource('/api/users/demandes/');
 });




