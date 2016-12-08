'use strict';

angular.module('communauT')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      updateme: {
        method: 'PUT',
        params: {
          controller: 'updateme'
        }
      },
      update: {
        method: 'PUT',
        params: {
          controller: 'update'
        }
      },
      addusergroupe: {
        method: 'PUT',
        params: {
          controller: 'addusergroupe'
        }
      },
      delusergroupe: {
        method: 'PUT',
        params: {
          controller: 'delusergroupe'
        }
      },
      one: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      bymail: {
        method: 'GET',
        params: {
          controller: 'bymail'
        }
      },
      listadmgrp: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'listadmgrp'
        }
      }

    });
  });
