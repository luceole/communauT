'use strict';
var User = require('../user/user.model');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  title: String,
  start: Date,
  end: Date,
  allDay: Boolean,
  info: String,
  lieu: String,
  participants : [ {type:Schema.Types.ObjectId, ref: 'User'}]
});

var GroupeSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  type : Number,    // 0 Ouvert, 5 Modéré, 10 Fermé
  owner :  {type:Schema.Types.ObjectId, ref: 'User'} ,
  admins : [ {type:Schema.Types.ObjectId, ref: 'User' }],
  participants : [ {type:Schema.Types.ObjectId, ref: 'User'}],
  demandes : [ {type:Schema.Types.ObjectId, ref: 'User'}],
  events: [EventSchema]
});

/**
 * Validations
 */
GroupeSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Nom de groupe obligatoire');

GroupeSchema
  .path('owner')
  .validate(function(owner) {
    return owner.length;
  }, 'Propriétaire obligatoire');

GroupeSchema
  .path('owner')
  .validate(function(value, respond) {
    var self = this;
    User.findById(value, function(err, user) {
      if(err) throw err;
      if(user) {
        return respond(true);
      }
      return respond(false);
    });
}, 'Utilsateur inconnu!!');

module.exports = mongoose.model('Groupe', GroupeSchema);
