/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Groupe = require('./groupe.model');

exports.register = function(socket) {
  Groupe.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Groupe.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('groupe:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('groupe:remove', doc);
}