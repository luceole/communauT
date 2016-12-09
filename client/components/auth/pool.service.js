'use strict';

angular.module('communauT')
  .factory('Poll', function ($resource) {
    return $resource('/api/polls/:id/:controller', {
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
  .factory('Mypolls', function ($resource) {
    return $resource('/api/polls/mypolls')
  });
