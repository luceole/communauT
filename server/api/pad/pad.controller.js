'use strict';

var _ = require('lodash');
var Pad = require('./pad.model');
/*var ether_api = require('etherpad-lite-client');
var etherpad = ether_api.connect({
  apikey: '2ee76d94192fce9c225318573c40a3f5c35541efdfc3ea39af003df2abc45f88',
  host: 'localhost',
  port: 9001,
});*/

// Get list of pads
exports.index = function (req, res) {
  Pad.find(function (err, pads) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, pads);
  });
};

// Get a single pad
exports.show = function (req, res) {
  Pad.findById(req.params.id, function (err, pad) {
    if (err) {
      return handleError(res, err);
    }
    if (!pad) {
      return res.send(404);
    }
    return res.json(pad);
  });
};

// Creates session for Etherpad
exports.create = function (req, res) {
  console.log("openPad");
  console.log(req.body);
  var args = {
    groupID: req.body.groupID,
    authorID: req.body.authorID,
    validUntil: Math.floor(Date.now() / 1000) + 6000,
  }
  etherpad.createSession(args,
    function (error, data) {
      if (error) console.error('Error creating Session on PAD: ' + error.message)
      else {
        console.log('New pad Session created: ' + data.sessionID)
      }
      return res.json(200, data);

    });
};

// Updates an existing pad in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Pad.findById(req.params.id, function (err, pad) {
    if (err) {
      return handleError(res, err);
    }
    if (!pad) {
      return res.send(404);
    }
    var updated = _.merge(pad, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, pad);
    });
  });
};

// Deletes a pad from the DB.
exports.destroy = function (req, res) {
  Pad.findById(req.params.id, function (err, pad) {
    if (err) {
      return handleError(res, err);
    }
    if (!pad) {
      return res.send(404);
    }
    pad.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
