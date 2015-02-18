/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Groupe  = require('../api/groupe/groupe.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});


User.find({}).remove(function() {
User.create(
{
    provider: 'local',
    role: 'admin_grp',
    name: 'Test',
    uid: 'test',
    surname: 'User',
    email: 'test@test.com',
    structure: 'MEN',
    isactif: true,
    password: 'test'
  } ,
   {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    uid: 'admin',
    email: 'admin@admin.com',
    structure: 'MEN',
    isactif: true,
    password: 'admin'
  }, function() {
      console.log('finished populating users admin & test');
User.findOne({uid: 'admin'}, function(err,UserAdmin) {
//console.log("Admin "+UserAdmin.uid);
Groupe.find({}).remove(function() {
   Groupe.create({
   name: 'dream-team',
   info: 'The Dream Team',
   type: 0,
   active: true,
   owner : UserAdmin._id,
   admins : [ UserAdmin._id ],
   participants : [ UserAdmin._id ]
},
  {
  name: 'Equipe One',
  info: 'The One Team',
  active: true,
  type: 5,
  owner : UserAdmin._id,
  admins : [ UserAdmin._id ],
  events: [{title: 'réunion ',start:'2015-02-16',allDay: true }]
  }, function() {
     Groupe.findOne({name: 'dream-team'}, function(err,groupe) {
      //console.log('groupe of '+groupe.name);
      UserAdmin.memberOf.push(groupe._id);
      UserAdmin.save();
      console.log('finished populating groupe of '+UserAdmin.name);
});
});
  });
});
});

var uT=[];
for (var i = 0; i<10; i++)
{
    uT.push(
   {provider: 'local',
    name: 'EOLE'+i,
    uid: 'eole'+i,
    surname: 'Luc',
    email: 'luc@test.com'+i,
    structure: 'EOLE',
    isactif: false,
    isdemande: true,
    //firstdate : "2012/12/12",
    password: 'test'
   });
}
User.create( uT, function() {
console.log('finished populating users eole');
});
});


