'use strict';

var ldap = require('ldapjs');
var User = require('./user.model');
var Groupe = require('../groupe/groupe.model');
//var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var ether_api = require('etherpad-lite-client');
/*
var etherpad = ether_api.connect({
  apikey: '2ee76d94192fce9c225318573c40a3f5c35541efdfc3ea39af003df2abc45f88',
  host: 'localhost',
  port: 9001,
});
*/

var validationError = function (res, err) {
  return res.json(422, err);
};


/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  //console.log(req.query);
  //User.find({}, '-salt -hashedPassword', function (err, users) {
  User.find(req.query, '-salt -hashedPassword', function (err, users) {
    if (err) return res.send(500, err);
    res.json(200, users);
  });
};

/*
 * get list of Demands
 */
exports.demandes = function (req, res) {
  User.find({
    isdemande: true
  }, '-salt -hashedPassword', function (err, users) {
    //User.find({isactif: false }, '-salt -hashedPassword', function (err, users) {
    if (err) return res.send(500, err);
    res.json(200, users);
  });
};

/*
 * find user by email
 */
exports.bymail = function (req, res) {
  var mel = req.query.email;
  User.findOne({
    email: mel
  }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
    console.log("u=" + user + " err=" + err);
    if (!user) return res.send(404);
    res.send(200);
  });
};


// Inscription dans un groupe
// Revoir le coté "transaction"
exports.addusergroup = function (req, res) {
  var userId = req.params.id;
  var groupeId = String(req.body.idGroupe);
  User.findById(userId, '-salt -hashedPassword')
    .populate('memberOf', 'info')
    .exec(function (err, user) {
      if (err) {
        return err;
      }
      if (!user) {
        return res.send(404);
      }
      user.memberOf.push(groupeId);
      user.save(function (err) {
        if (err) {
          return err;
        }
        Groupe.findById(groupeId, function (err, groupe) {
          if (err) {
            return err;
          }
          groupe.participants.push(userId);
          groupe.save(function (err) {
            if (err) {
              return err;
            }
            return res.json(200, user);
          });
        });
      });
    });
};
exports.delusergroup = function (req, res) {
  var userId = req.params.id;
  var groupeId = String(req.body.idGroupe);
  User.findById(userId, '-salt -hashedPassword')
    //.populate('memberOf','info')  // le pull ne marche pas bien avec populate
    .exec(function (err, user) {
      if (err) {
        return err;
      }
      if (!user) {
        return res.send(404);
      }
      user.memberOf.pull(groupeId);
      console.log("1" + user.memberOf);
      user.save(function (err) {
        if (err) {
          return err;
        }
        Groupe.findById(groupeId, function (err, groupe) {
          if (err) {
            return err;
          }
          groupe.participants.pull(userId);
          groupe.save(function (err) {
            if (err) {
              return err;
            }
            console.log(user.memberOf);
            return res.json(200, user);
          });
        });

      });
    });
};


/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.isactif = false;

  newUser.isdemande = true;
  newUser.dt = Date.now();
  etherpad.createAuthor(newUser.uid,
    function (error, data) {
      if (error) console.error('Error creating User on PAD: ' + error.message)
      else {
        console.log('New pad USer created: ' + data.authorID)
        newUser.authorPadID = data.authorID;
      }
      newUser.save(function (err, user) {
        if (err) return validationError(res, err);
        var token = jwt.sign({
          _id: user._id
        }, config.secrets.session, {
          expiresInMinutes: 60 * 5
        });
        res.json({
          token: token
        });
      });
    });
  //ldapAdd(req);
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, '-salt -hashedPassword')
    .populate('memberOf')
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return res.send(401);
      res.json(200, user.profile);
    });
};
/**
 * Get my info
 */
exports.me = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
      _id: userId
    }, '-salt -hashedPassword')
    .populate('memberOf', 'info  groupPadID name')
    .populate('adminOf', 'info name')
    .exec(function (err, user) { // don't ever give out the password or salt
      if (err) return next(err);
      if (!user) return res.json(401);
      res.json(user);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};
/**
 *  Update a user
 *
 */
// Updates an existing user. (prop isactif)
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  User.findById(req.params.id, function (err, user) {
    //if (err) { return handleError(res, err); }
    if (err) {
      return err;
    }
    if (!user) {
      return res.send(404);
    }
    console.log("--------- USER ---------------");
    console.log(user)
    var updated = _.merge(user, req.body);
    updated.isactif = req.body.isactif;
    updated.isdemande = false;
    if ((updated.authorPadID === undefined) || (updated.authorPadID.length < 1)) {
      etherpad.createAuthor(updated.uid,
        function (error, data) {
          if (error) console.error('Error creating User on PAD: ' + error.message)
          else {
            console.log('New pad USer created: ' + data.authorID)
            updated.authorPadID = data.authorID;
          }
          updated.save(function (err) {
            if (err) {
              return handleError(res, err);
            }
            return res.json(200, user);
          });
        });

    } else {
      updated.save(function (err) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, user);
      });
    }
  });
};


// Updates an existing user. 
exports.updateMe = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log("server updateMe ");
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      return res.send(404);
    }
    var newUser = new User(req.body);
    user.name = newUser.name;
    user.surname = newUser.surname;
    user.structure = newUser.structure;
    user.email = newUser.email;
    user.save(function (err) {
      //if (err) { return handleError(res, err); }
      return res.json(200, user);
    });
  });
};


/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};


/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};

/**
 * Maj Annuaire LDAP
 * PROTOTYPE!
 */
var ldapAdd = function (req) {
  // Add to LDAP
  //var dn = 'uid='+req.body.name+','+'ou=utilisateurs,ou=eole,ou=education,o=gouv,c=fr';
  var dn = 'cn=' + req.body.name + ',' + 'dc=mondomaine,dc=lan';
  var entry = {
    objectClass: 'inetOrgPerson',
    uid: req.body.name,
    sn: req.body.name,
    cn: req.body.surname + ' ' + req.body.name,
    givenName: req.body.surname,
    mail: req.body.email,
    userPassword: req.body.password
  };
  console.log(entry);
  //var clientLdap=ldap.createClient({url:'ldap://platon.ac-dijon.fr'});
  //clientLdap.bind('cn=admin,o=gouv,c=fr','AdminEole21',function(err) 
  var clientLdap = ldap.createClient({
    url: 'ldap://172.26.60.27'
  });
  clientLdap.bind('cn=Administrator,cn=users,dc=mondomaine,dc=lan', 'eole2144!', function (err) {
    console.log(err)
  });
  clientLdap.add(dn, entry, function (err) {
    console.log(err);
  });
  clientLdap.unbind(function (err) {
    console.log(err);
  });
}

function handleError(res, err) {
  return res.send(500, err);
}
