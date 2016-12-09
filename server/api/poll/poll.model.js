'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
//var Groupe = require('../groupe/groupe.model');

var PollSchema = new Schema({
  name: String,
  info: String,
  isActif: Boolean,
  groupe: {
    type: Schema.Types.ObjectId,
    ref: 'Groupe'
  },
  groupeInfo: String,
  groupeName: String,

  propositions: [{
    date: Date,
    stdate: String,
    sttime: []
      // ,allDay: Boolean
      }],


  resultats: [{
      user: {
        name: String,
        email: {
          type: String,
          unique: true
        }
      },
      reponses: []
}]
    /*resultats: [{
    user: {
      name: String,
      email: String
    },
    reponses: [{
      date: Date,
      stdate: String,
      sttime: []
        // ,allDay: Boolean
      }]
}]*/
});

module.exports = mongoose.model('Poll', PollSchema);
