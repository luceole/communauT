/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log("Starting in  " + process.env.NODE_ENV + " mode");
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Etherpad ?
if (config.etherpad) {
  var ether_api = require('etherpad-lite-client');
  console.log(" - Link Etherpad=" + config.etherpad.host + ":" + config.etherpad.port);
  global.etherpad = ether_api.connect({
    apikey: config.etherpad.apikey,
    host: config.etherpad.host,
    port: config.etherpad.port,
  });
}


// Connect to ldap
if (config.ldap) {
  console.log(" - Link Ldap=" + config.ldap.host);
  var ldap = require('ldapjs');
  var clientLdap = ldap.createClient({
    url: 'ldap://' + config.ldap.host
  });
  clientLdap.bind(config.ldap.baseDN, config.ladp.password, function (err) {
    console.log(err)
  });
}

// Populate DB with sample data 
if (config.seedDB) {
  require('./config/seed');
}

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
