'use strict';

var _ = require('lodash');
var Event = require('./event.model');
var Groupe = require('../groupe/groupe.model');

// Get list of events
exports.index = function (req, res) {
  Event.find(function (err, events) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, events);
  });
};

// Get a single event
exports.show = function (req, res) {
  Event.findById(req.params.id, function (err, event) {
    if (err) {
      return handleError(res, err);
    }
    if (!event) {
      return res.send(404);
    }
    return res.json(event);
  });
};

// Creates a new event in the DB.
exports.create = function (req, res) {
  console.log(req.body);
  Event.create(req.body, function (err, event) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, event);
  });
};

// Updates an existing event in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Event.findById(req.params.id, function (err, event) {
    if (err) {
      return handleError(res, err);
    }
    if (!event) {
      return res.send(404);
    }
    var updated = _.merge(event, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, event);
    });
  });
};

// Deletes a event from the DB.
exports.destroy = function (req, res) {
  Event.findById(req.params.id, function (err, event) {
    if (err) {
      return handleError(res, err);
    }
    if (!event) {
      return res.send(404);
    }
    event.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

// Get list of events by group 
exports.bygroup = function (req, res) {
  var group = req.query.group;
  /*
   Groupe.find({ owner_uid: owner },function (err, groupes) {
      if(err) { return handleError(res, err); }
      return res.json(200, groupes);
    });
  */
};

function handleError(res, err) {
  return res.send(500, err);
}
