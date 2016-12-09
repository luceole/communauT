'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'test-secret',

  etherpad: {
  apikey: 'ab5bf2ed0cf6df5457a43e2000f33c15f367e8e309d12d905b4a3a04aa3b23eb',
  host: 'localhost',
  port: '9001'
  },

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
