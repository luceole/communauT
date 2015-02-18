'use strict';
angular.module('testApp')
   .factory('Groupe', function ($resource) {
    return $resource('/api/groupes/:id/:controller', {
  id: '@_id'
  },
 {  
 update: {
     method: 'PUT',
     params: {
     controller:'update'
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


