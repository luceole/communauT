'use strict';
angular.module('testApp')
  .factory('Groupe', function ($resource) {
    return $resource('/api/groupes/:id/:controller', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT',
        params: {
          controller: 'update'
        }
      },
      show: {
        method: 'GET',
        params: {}
      },
      eventsofgroup: {
        method: 'get',
        isArray: true,
        params: {
          controller: 'eventsofgroup'
        }
      },
      eventupdate: {
        method: 'PUT',
        isArray: true,
        params: {
          controller: 'eventupdate'
        }
      },
      eventparticipate: {
        method: 'PUT',
        isArray: true,
        params: {
          controller: 'eventparticipate'
        }
      },
      eventdelete: {
        method: 'PUT',
        isArray: true,
        params: {
          controller: 'eventdelete'
        }
      }
    });
  })
  .factory('GroupeOf', function ($resource) {
    return $resource('/api/groupes/byowner');
  })
  .factory('GroupeOpen', function ($resource) {
    return $resource('/api/groupes/isopen');
  })
  .factory('Events', function ($resource) {
    return $resource('/api/groupes/events');
  });
