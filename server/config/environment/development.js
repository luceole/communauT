'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/annuaire-dev'
  },
  seedDB: true,

  etherpad: {
    apikey: '2ee76d94192fce9c225318573c40a3f5c35541efdfc3ea39af003df2abc45f88',
    host: 'localhost',
    port: '9001'
  }
};
