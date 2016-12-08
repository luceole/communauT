'use strict';

angular.module('communauT')
  .factory('Demande', function($resource) {
    return $resource('/api/users/demandes/');
 });




