'use strict';

var _ = require('lodash');
var Pool = require('./pool.model');
var ObjectId = require('mongoose').Types.ObjectId;

// Get list of pools
exports.index = function (req, res) {
  Pool.find(
    req.query,
    function (err, pools) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(pools);
    });
};

exports.mypools = function (req, res) {
  console.log(req.query)
    /* var grp = [];
    req.query.mygrp.forEach(function (v) {
      grp.push(new ObjectId(v));
    })
    console.log(grp)*/
  Pool.find({
    isActif: true,
    groupeName: {
      $in: req.query.mygrp
    }
  }, function (err, pools) {
    if (err) {
      console.log(err)
      return handleError(res, err);
    }
    return res.status(200).json(pools);
  });
};

/*exports.actifs = function (req, res) {
  Pool.find({
    isActif: true
  }, function (err, pools) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(pools);
  });
};*/

// Get a single pool
exports.show = function (req, res) {
  Pool.findById(req.params.id, function (err, pool) {
    if (err) {
      return handleError(res, err);
    }
    if (!pool) {
      return res.status(404).send('Not Found');
    }
    return res.json(pool);
  });
};

// Creates a new pool in the DB.
exports.create = function (req, res) {
  console.log(req.body)
  Pool.create(req.body, function (err, pool) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(pool);
  });
};

// Updates an existing pool in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log(req.body)
  Pool.findById(req.params.id, function (err, pool) {
    if (err) {
      return handleError(res, err);
    }
    if (!pool) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(pool, req.body, function (a, b) {
      if (_.isArray(a)) {
        return b;
      }
    });

    console.log(updated);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(pool);
    });
  });

};

// vote an existing pool in the DB.
exports.vote = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Pool.findById(req.params.id, function (err, pool) {
    if (err) {
      return handleError(res, err);
    }
    if (!pool) {
      return res.status(404).send('Not Found');
    }
    /*    var updated = _.merge(pool, req.body, function (a, b) {
          if (_.isArray(a)) {
            return b;
          }
        });*/
    console.log("VOTE")
      // TODO Un seul vote par utilisateur
    var updated = _.findLastIndex(pool.resultats, function (v) {
      return v.user.email == req.body.vote.user.email;
    });
    console.log(updated)
    if (updated == -1) {
      console.log("Nouveau")
      pool.resultats.push(req.body.vote);
    } else {
      console.log("Modif")
      pool.resultats[updated].reponses = req.body.vote.reponses;
    }
    console.log(pool.resultats)
    pool.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(pool);
    });

  });

};


// Deletes a pool from the DB.
exports.destroy = function (req, res) {
  console.log("Delete");
  Pool.findById(req.params.id, function (err, pool) {
    if (err) {
      return handleError(res, err);
    }
    if (!pool) {
      return res.status(404).send('Not Found');
    }
    pool.remove(function (err) {
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
