'use strict';

angular.module('testApp')
  .factory('Auth', function Auth($location, $rootScope, $http,  $cookieStore, $q, User, Groupe) {
    var currentUser = {};
    if($cookieStore.get('token')) {
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
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          uid: user.uid,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
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
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      byMail: function(mel,callback) {
        var cb = callback || angular.noop;
        return User.bymail(mel,
         function(err) {
            return cb(err);
},
          function(err) {
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
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

       groupsofOwner: function(uid, callback) {
        var cb = callback || angular.noop;
        return Groupe.query(
          function(data) {
            return cb(data);
          },
          function(err) {
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
      updateUser: function(id,user, callback) {
        var cb = callback || angular.noop;
        return User.update({id: id},user,
          function(data) {
            return cb(data);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      updateMe: function(id,user, callback) {
        var cb = callback || angular.noop;
        return User.updateme({id: id},user,
          function(data) {
            return cb(data);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },
       getusers : function(id, callback) {
        var cb = callback || angular.noop;
        return User.query(
          function(data) {
            return cb(data);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },


       addUserGroup: function (idGroupe,callback) {
        var cb = callback || angular.noop;
        return User.addusergroupe({ id: currentUser._id},{idGroupe: idGroupe},
         function(user) {
         currentUser = User.get();
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

        delUserGroup: function (idGroupe,callback) {
        var cb = callback || angular.noop;
        return User.delusergroupe({ id: currentUser._id},{idGroupe: idGroupe},
         function(user) {
         currentUser = User.get();
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      },


/***** Admin Groupe ****/
        updategroupe: function(id,groupe, callback) {
        var cb = callback || angular.noop;
        return Groupe.update({id: id},groupe,
          function(data) {
            return cb(data);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },
        createGroupe: function(groupe, callback) {
        var cb = callback || angular.noop;

        return Groupe.save(groupe,
          function(data) {
            return cb(groupe);
          },
          function(err) {
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
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
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
      isAdmin: function() {
        return currentUser.role === 'admin';
      },
      isAdmin_grp: function() {
        return currentUser.role === 'admin_grp';
      },

      isActif: function() {
        return currentUser.isactif;
      },
      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
