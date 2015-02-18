/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Pool = require('./pool.model');

exports.register = function(socket) {
  Pool.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Pool.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('pool:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pool:remove', doc);
}
