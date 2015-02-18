'use strict';

var _ = require('lodash');
var Groupe = require('./groupe.model');

// Get list of groupes
exports.index = function(req, res) {
  Groupe.find() 
.populate('owner','uid')
.exec(function (err, groupes) {
    if(err) { return handleError(res, err); }
    return res.json(200, groupes);
  });
};

// Get list of groupes of owner
exports.byowner = function(req, res) {
 var owner = req.query.owner;
 Groupe.find({ owner: owner },function (err, groupes) {
 //Groupe.find(req.query,function (err, groupes) {  //ok mais permet toutes requetes
    if(err) { return handleError(res, err); }
    return res.json(200, groupes);
  });
};
// Get list of open groupes
exports.isopen = function(req, res) {
Groupe.find({type: {$lt: 10 }})
.populate('owner','uid')
.populate('participants','uid')
.exec(function (err, groupes) {
    if(err) { return handleError(res, err); }
    return res.json(200, groupes);
  });
};

exports.eventsofgroup = function(req,res) {
var groupe=req.param.id;
Groupe.findById(req.params.id, function (err, groupe) {
    if(err) { return handleError(res, err); }
    if(!groupe) { return res.send(404); }
    return res.json(events);
  });
}
exports.events = function(req,res) {
  //var events = [{title:'Prem'},{title:'deuxieme', start:'2015-02-25'}];
  var events = [];
  Groupe.find({}).lean().exec(function(err,groupes)  {
  groupes.forEach(function(groupe,index,tab) {
    events.push.apply(events,groupe.events);
    console.log( index+ " " +groupe.events);
    console.log( index+ " " +events);
  });
    return res.json(events);
  });
}



// Get a single groupe
exports.show = function(req, res) {
  Groupe.findById(req.params.id, function (err, groupe) {
    if(err) { return handleError(res, err); }
    if(!groupe) { return res.send(404); }
    return res.json(groupe);
  });
};

// Creates a new groupe in the DB.
exports.create = function(req, res) {
var newGroupe = new Groupe(req.body);
  console.log(newGroupe);
  Groupe.create(newGroupe, function(err, groupe) {
    if(err) { return handleError(res, err); }
    return res.json(201, groupe);
  });
};

// Updates an existing groupe in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Groupe.findById(req.params.id, function (err, groupe) {
    if (err) { return handleError(res, err); }
    if(!groupe) { return res.send(404); }
    var updated = _.merge(groupe, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      //console.log("Groupe Update "+updated.name);
      return res.json(200, updated);
    });
  });
};

// Updates Events an existing groupe in the DB.
exports.eventupdate = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Groupe.findById(req.params.id, function (err, groupe) {
    if (err) { return handleError(res, err); }
    if(!groupe) { return res.send(404); }
    var updated = _.merge(groupe, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      //console.log("Groupe Update "+updated.name);
      return res.json(200, updated);
    });
  });
};


// Deletes a groupe from the DB.
exports.destroy = function(req, res) {
  Groupe.findById(req.params.id, function (err, groupe) {
    if(err) { return handleError(res, err); }
    if(!groupe) { return res.send(404); }
    groupe.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
