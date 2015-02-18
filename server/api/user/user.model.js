'us/ strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
  uid: String,
  name: String,
  surname: String,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  structure: String,
  isactif: Boolean,
  isdemande: Boolean ,
  hashedPassword: String,
  provider: String,
  firstdate: Date,
  creationDate: {type: Date, 'default': Date.now},
  salt: String,
  memberOf: [{ type: Schema.Types.ObjectId, ref : 'Groupe'}]   
});

/**
 * Virtuals
 */
UserSchema
  .virtual('dt')
  .get(function() {
    //return this._id.generationTime;
    return this.name;
  });
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id' : this._id,
      'name': this.name,
      'surname': this.surname,
      'isactif': this.isactif,
      'email': this.email,
      'structure': this.structure,
      'role': this.role,
      'memberOf': this.memberOf
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Courriel obligatoire ');
// Validate empty uid
UserSchema
  .path('uid')
  .validate(function(uid) {
    return uid.length;
  }, 'Identifant obligatoire');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Mot de passe obligatoire');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'Cette adresse  utilisée avec un autre identifiant!');
// Validate uid is not taken
UserSchema
  .path('uid')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({uid: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'Cet identifiant est dèja utilisé!');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
