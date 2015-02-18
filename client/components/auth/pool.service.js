'use strict';

angular.module('testApp')
  .factory('Pool', function ($resource) {
    return $resource('/api/pools/:id/:controller', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT',
        params: {
          controller: 'update'
        }
      },
      vote: {
        method: 'PUT',
        params: {
          controller: 'vote'
        }
      }
    });
  })
  .factory('Mypools', function ($resource) {
    return $resource('/api/pools/mypools')
  });
