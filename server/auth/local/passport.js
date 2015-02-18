var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'uid',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(uid, password, done) {
      User.findOne({
        uid: uid
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'Erreur Identification  ' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Erreur Identification' });
        }
        return done(null, user);
      });
    }
  ));
};
