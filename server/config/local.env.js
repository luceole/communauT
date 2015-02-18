'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'test-secret',

  etherpad: {
  apikey: '2ee76d94192fce9c225318573c40a3f5c35541efdfc3ea39af003df2abc45f88',
  host: 'localhost',
  port: '9001'
  },

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
