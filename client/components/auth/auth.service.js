'use strict';

angular.module('communauT')
  .factory('Auth', function Auth($location, $rootScope, $http, $cookieStore, $q, User, Groupe, Poll,Demande) {
    var currentUser = {};
    if ($cookieStore.get('token')) {
      currentUser = User.get();
    }
    return {
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post('/auth/local', {
          uid: user.uid,
          password: user.password
        }).
        success(function (data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function (err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function () {
        $cookieStore.remove('token');
        currentUser = {};
      },
     DemandesPage: function (page, callback) {
        var cb = callback || angular.noop;
        return Demande.get({page: page},
          function (err) {
            return cb(err);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      byMail: function (mel, callback) {
        var cb = callback || angular.noop;
        return User.bymail(mel,
          function (err) {
            return cb(err);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      listadmgrp: function (callback) {
        var cb = callback || angular.noop;
        return User.listadmgrp(
          function (err) {
            return cb(err);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      openPad: function (pad, callback) {
        var cb = callback || angular.noop;
        $http.post('/api/pads', {
          groupID: pad.groupID,
          authorID: pad.authorID,
        }).
        success(function (data) {
          // console.log("session PAD: " + data.sessionID);
          $cookieStore.put('sessionID', data.sessionID);
          return cb(data);
        }).
        error(function (err) {
          console.lo("err :" + err)
          return cb(err);
        }.bind(this)).$promise;
      },
      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function (user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function (data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function (err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      groupsofOwner: function (uid, callback) {
        var cb = callback || angular.noop;
        return Groupe.query(
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      getGroupe: function (id, callback) {
        var cb = callback || angular.noop;
        return Groupe.show({
            id: id
          },
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       *  Update a user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      updateUser: function (id, user, callback) {
        var cb = callback || angular.noop;
        return User.update({
            id: id
          }, user,
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      updateMe: function (id, user, callback) {
        var cb = callback || angular.noop;
        return User.updateme({
            id: id
          }, user,
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      getusers: function (id, callback) {
        var cb = callback || angular.noop;
        return User.query(
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      listadmin: function (id, callback) {
        var cb = callback || angular.noop;
        return User.query({
            role: 'admin'
          },
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      addUserGroup: function (idGroupe, callback) {
        var cb = callback || angular.noop;
        return User.addusergroupe({
            id: currentUser._id
          }, {
            idGroupe: idGroupe
          },
          function (user) {
            currentUser = User.get();
            return cb(user);
          },
          function (err) {
            return cb(err);
          }).$promise;
      },

      delUserGroup: function (idGroupe, callback) {
        var cb = callback || angular.noop;
        return User.delusergroupe({
            id: currentUser._id
          }, {
            idGroupe: idGroupe
          },
          function (user) {
            currentUser = User.get();
            return cb(user);
          },
          function (err) {
            return cb(err);
          }).$promise;
      },
      eventparticipate: function (id, ev, callback) {
        var cb = callback || angular.noop;
        return Groupe.eventparticipate({
            id: id
          }, ev,
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      eventupdate: function (id, ev, callback) {
        var cb = callback || angular.noop;
        return Groupe.eventupdate({
            id: id
          }, ev,
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      eventdelete: function (id, ev, callback) {
        var cb = callback || angular.noop;
        return Groupe.eventdelete({
            id: id
          }, ev,
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      eventsofgroup: function (id, callback) {
        var cb = callback || angular.noop;
        return Groupe.eventsofgroup({
            id: id
          },
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },


      /***** Admin Groupe ****/
      updategroupe: function (id, groupe, callback) {
        var cb = callback || angular.noop;
        return Groupe.update({
            id: id
          }, groupe,
          function (data) {
            return cb(data);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      createGroupe: function (groupe, callback) {
        var cb = callback || angular.noop;

        return Groupe.save(groupe,
          function (data) {
            return cb(groupe);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },


      // Create Poll
      createPoll: function (poll, callback) {
        var cb = callback || angular.noop;

        return Poll.save(poll,
          function (data) {
            return cb(poll);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      updatePoll: function (id, poll, callback) {
        var cb = callback || angular.noop;

        return Poll.update({
            id: id
          }, poll,
          function (data) {
            return cb(poll);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      votePoll: function (id, poll, callback) {
        var cb = callback || angular.noop;
        console.log(poll)
        return Poll.vote({
            id: id
          }, poll,
          function (data) {
            return cb(poll);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },
      mypolls: function (mygrp, callback) {
        var cb = callback || angular.noop;
        console.log(mygrp);
        return Mypolls(mygrp,
          function (data) {
            return cb(mygrp);
          },
          function (err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function (oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({
          id: currentUser._id
        }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function (user) {
          return cb(user);
        }, function (err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function () {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function () {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function (cb) {
        if (currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function () {
            cb(true);
          }).catch(function () {
            cb(false);
          });
        } else if (currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function () {
        return currentUser.role === 'admin';
      },
      isAdmin_grp: function () {
        return (currentUser.role === 'admin_grp' || currentUser.role === 'admin');
      },

      isActif: function () {
        return currentUser.isactif;
      },
      /**
       * Get auth token
       */
      getToken: function () {
        return $cookieStore.get('token');
      }
    };
  });
