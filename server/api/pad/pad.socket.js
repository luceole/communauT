/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Pad = require('./pad.model');

exports.register = function(socket) {
  Pad.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Pad.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('pad:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pad:remove', doc);
}