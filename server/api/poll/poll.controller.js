'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');
var ObjectId = require('mongoose').Types.ObjectId;

// Get list of polls
exports.index = function (req, res) {
  Poll.find(
    req.query,
    function (err, polls) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(polls);
    });
};

exports.mypolls = function (req, res) {
  console.log(req.query)
    /* var grp = [];
    req.query.mygrp.forEach(function (v) {
      grp.push(new ObjectId(v));
    })
    console.log(grp)*/
  Poll.find({
    isActif: true,
    groupeName: {
      $in: req.query.mygrp
    }
  }, function (err, polls) {
    if (err) {
      console.log(err)
      return handleError(res, err);
    }
    return res.status(200).json(polls);
  });
};

/*exports.actifs = function (req, res) {
  Poll.find({
    isActif: true
  }, function (err, polls) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(polls);
  });
};*/

// Get a single poll
exports.show = function (req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if (err) {
      return handleError(res, err);
    }
    if (!poll) {
      return res.status(404).send('Not Found');
    }
    return res.json(poll);
  });
};

// Creates a new poll in the DB.
exports.create = function (req, res) {
  console.log(req.body)
  Poll.create(req.body, function (err, poll) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log(req.body)
  Poll.findById(req.params.id, function (err, poll) {
    if (err) {
      return handleError(res, err);
    }
    if (!poll) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(poll, req.body, function (a, b) {
      if (_.isArray(a)) {
        return b;
      }
    });

    console.log(updated);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(poll);
    });
  });

};

// vote an existing poll in the DB.
exports.vote = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) {
      return handleError(res, err);
    }
    if (!poll) {
      return res.status(404).send('Not Found');
    }
    /*    var updated = _.merge(poll, req.body, function (a, b) {
          if (_.isArray(a)) {
            return b;
          }
        });*/
    console.log("VOTE")
      // TODO Un seul vote par utilisateur
    var updated = _.findLastIndex(poll.resultats, function (v) {
      return v.user.email == req.body.vote.user.email;
    });
    console.log(updated)
    if (updated == -1) {
      console.log("Nouveau")
      poll.resultats.push(req.body.vote);
    } else {
      console.log("Modif")
      poll.resultats[updated].reponses = req.body.vote.reponses;
    }
    console.log(poll.resultats)
    poll.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(poll);
    });

  });

};


// Deletes a poll from the DB.
exports.destroy = function (req, res) {
  console.log("Delete");
  Poll.findById(req.params.id, function (err, poll) {
    if (err) {
      return handleError(res, err);
    }
    if (!poll) {
      return res.status(404).send('Not Found');
    }
    poll.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
