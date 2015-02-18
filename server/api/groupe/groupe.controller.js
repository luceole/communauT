'use strict';

var _ = require('lodash');
var Groupe = require('./groupe.model');
/*var config = require('/config/environment');
var ether_api = require('etherpad-lite-client');

 global.etherpad = ether_api.connect({
    apikey: config.etherpad.apikey,
    host: config.etherpad.host,
    port: config.etherpad.port,
  });*/

// Get list of groupes
exports.index = function (req, res) {
  Groupe.find()
    .populate('owner', 'uid')
    .populate('participants', 'uid')
    .populate('adminby', 'uid')
    .exec(function (err, groupes) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, groupes);
    });
};

// Get list of groupes of owner
exports.byowner = function (req, res) {
  var owner = req.query.owner;
  Groupe.find({
      owner: owner
    })
    .populate('participants', 'uid')
    .exec(function (err, groupes) {
      //Groupe.find(req.query,function (err, groupes) {  //ok mais permet toutes requetes
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, groupes);
      console.log(groupes)
    });
};
// Get list of open groupes
exports.isopen = function (req, res) {
  Groupe.find({
      type: {
        $lt: 10
      }
    })
    .populate('owner', 'uid')
    .populate('participants', 'uid')
    .exec(function (err, groupes) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, groupes);
    });
};

exports.eventsofgroup = function (req, res) {
  var groupe = req.params.id;
  console.log(groupe);
  var events = [];
  Groupe.findById(req.params.id).lean()
    .populate('events.participants', 'uid')
    .exec(function (err, groupe) {
      if (err) {
        return handleError(res, err);
      }
      if (!groupe) {
        return res.send(404);
      }
      //events.push.apply(events, groupe.events);
      return res.json(groupe.events);
    });
}
exports.events = function (req, res) {
  //var events = [{title:'Prem'},{title:'deuxieme', start:'2015-02-25'}];
  var events = [];
  Groupe.find({}).lean().exec(function (err, groupes) {
    groupes.forEach(function (groupe, index, tab) {
      events.push.apply(events, groupe.events);
      //console.log(index + " " + events);
    });
    return res.json(events);
  });
}



// Get a single groupe
exports.show = function (req, res) {
  console.log("show" + req.params.id)
  Groupe.findById(req.params.id, function (err, groupe) {
    if (err) {
      return handleError(res, err);
    }
    if (!groupe) {
      return res.send(404);
    }
    return res.json(groupe);
  });
};

// Creates a new groupe in the DB.
exports.create = function (req, res) {
  var newGroupe = new Groupe(req.body);
  //console.log(newGroupe);
  etherpad.createGroup(function (error, data) {
    if (error) console.error('Error creating group: ' + error.message)
    else {
      console.log('New group created: ' + data.groupID)
      newGroupe.groupPadID = data.groupID;
      var args = {
        groupID: data.groupID,
        padName: newGroupe.name,
        text: 'Bienvenu sur le PAD du groupe ' + newGroupe.name,
      }
      etherpad.createGroupPad(args, function (error, data) {
        if (error) console.error('Error creating pad: ' + error.message)
        else {
          console.log('New pad created: ' + data.padID)
        }

      })
    }
    // Alway Create Group
    console.log(newGroupe);
    Groupe.create(newGroupe, function (err, groupe) {
      if (err) {
        return handleError(res, err);
      }
      console.log(groupe);
      return res.json(201, groupe);
    });
  });

};

// Updates an existing groupe in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log(req.body)
  Groupe.findById(req.params.id, function (err, groupe) {
    if (err) {
      return handleError(res, err);
    }
    if (!groupe) {
      return res.send(404);
    }

    var updated = _.merge(groupe, req.body, function (a, b) {
      if (_.isArray(a)) {
        return b;
      }
    });

    updated.save(function (err) {
      if (err) {
        console.log("Erreur Update : " + err)
        return handleError(res, err);
      }
      return res.json(200, updated);
    });
  });
};

// Create or Updates Events an existing groupe in the DB.
exports.eventupdate = function (req, res) {

  /* if (req.body._id) {
       delete req.body._id;
   }*/
  if ((req.user.role !== "admin") && (req.user.adminOf.indexOf(req.params.id) === -1)) {
    return res.send(403);
  }
  Groupe.findById(req.params.id, function (err, groupe) {
    if (err) {
      return handleError(res, err);
    }
    if (!groupe) {
      return res.send(404);
    }
    var ev = groupe.events.id(req.body._id);
    if (ev) { // Drag and Drop
      console.log("Drag/Drop");
      ev.start = req.body.start;
      if (req.body.end) {
        ev.end = req.body.end;
      } else {
        ev.end = req.body.start
      }
      groupe.save(function (err, groupe) {
        if (err) {
          console.log(err);
          return handleError(res, err);
        }
        console.log("Groupe EventUpdate " + groupe.name);
        console.log(req.body);
        return res.json(groupe.events);
      });
    } else {

      // PAD
      var args = {
        groupID: groupe.groupPadID,
        padName: req.body.start + "-" + req.body.end,
        text: 'Bienvenu sur le PAD  ' + req.body.title + ' - ' + req.body.start
      }
      etherpad.createGroupPad(args, function (error, data) {
        if (error) console.error('Error creating pad: ' + error.message)
        else {

          console.log('New pad created: ' + data.padID)
          req.body.eventPadID = data.padID;
        }
        groupe.events.push(req.body);
        groupe.save(function (err, groupe) {
          if (err) {
            console.log(err);
            return handleError(res, err);
          }
          console.log("Groupe EventCreate " + groupe.name);
          console.log(req.body);
          return res.json(groupe.events);
        });

      });
    }
    /*    groupe.save(function (err, groupe) {
          if (err) {
            console.log(err);
            return handleError(res, err);
          }
          console.log("Groupe EventUpdate " + groupe.name);
          console.log(req.body);
          return res.json(groupe.events);
        });*/
  });
};

exports.eventparticipate = function (req, res) {
  console.log("eventparticipate");
  /* if (req.body._id) {
      delete req.body._id;
  }*/
  Groupe.findById(req.params.id, function (err, groupe) {
    if (err) {
      return handleError(res, err);
    }
    if (!groupe) {
      return res.send(404);
    }
    var ev = groupe.events.id(req.body._id);
    if (ev) { // inscription/Dé-inscription
      var index = ev.participants.indexOf(req.body.UserId);
      if (index === -1) // Pas inscrit
      {
        console.log("inscription " + req.body.UserId);
        ev.participants.push(req.body.UserId);
      } else {
        console.log("dé-inscription " + req.body.UserId);
        ev.participants.splice(index, 1);
      }
    } else {
      return res.send(404);
    }
    groupe.save(function (err, groupe) {
      if (err) {
        return handleError(res, err);
      }
      console.log("Groupe Update " + groupe.name);
      return res.json(groupe.events);
    });
  });
}

exports.eventdelete = function (req, res) {
  console.log("eventdelete");
  //console.log(req.user);
  if (req.body._id) {
    delete req.body._id;
  }
  if ((req.user.role !== "admin") && (req.user.adminOf.indexOf(req.params.id) === -1)) {
    return res.send(403);
  }
  Groupe.findById(req.params.id, function (err, groupe) {
    if (err) {
      return handleError(res, err);
    }
    if (!groupe) {
      return res.send(404);
    }
    var ev = groupe.events.id(req.body.id);
    if (!ev) {
      return res.send(404);
    }
    ev.remove(function (err) {
      groupe.save(function (err, groupe) {
        if (err) {
          return handleError(res, err);
        }
        console.log("Groupe Update " + groupe.name);
        return res.json(groupe.events);
      });
    });
  });
};


// Deletes a groupe from the DB.
exports.destroy = function (req, res) {
  Groupe.findById(req.params.id, function (err, groupe) {
    if (err) {
      return handleError(res, err);
    }
    if (!groupe) {
      return res.send(404);
    }
    groupe.remove(function (err) {
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
