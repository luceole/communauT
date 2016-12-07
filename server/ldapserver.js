'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var config = require('./config/environment');
var ldap = require('ldapjs');
var parseFilter = require('ldapjs').parseFilter;
var User =  require('./api/user/user.model.js');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

var SUFFIX='dc=eole';
var ldapUsers = {};


function authorize(req, res, next) {
console.log("authorize :" +req.connection.ldap.bindDN)
  if (!req.connection.ldap.bindDN.equals('cn=admin,dc=eole'))
{
    console.log("not admin ");
    //return next(new ldap.InsufficientAccessRightsError());
}
  return next();
}

function toLdap(u) {
var r={
dn: 'cn='+u.uid+','+SUFFIX,
attributes: {
cn: u.uid,
uid: u.uid,
name: u.name ,
surname: u.surname,
structure: u.structure,
mail: u.email,
objectclass: 'eoleUser'
}
};
return(r);
}

var server = ldap.createServer();

server.listen(1389, function() {
console.log("Ldap Server Started "+ server.url)
});

// LDAPBIND
server.bind(SUFFIX, function(req, res, next) {
var dn=req.dn.toString();
var uid=dn.split(",")[0].split("=")[1];
User.findOne({uid: uid}, function(err,u) {

  if (err) console.log("****"+err);
  if (!u)    return next(new ldap.NoSuchObjectError(dn));
  if (!u.authenticate( req.credentials))
    return next(new ldap.InvalidCredentialsError());
  res.end();
  console.log("BIND  OK "+u["uid"]);
  return next();
});
});
// LDAPSEARCH
server.search(SUFFIX,  authorize, function(req, res, next) {
  var dn = req.dn.toString();
  var filter=parseFilter(req.filter.toString());
  var Stringfilter=req.filter.toString();
  console.log("SEARCH : " + filter);
  if (Stringfilter.match(/uid=/))
  {
   var uid=Stringfilter.replace(/\)/g,"").split("uid=")[1];
   var q={uid: uid, isactif: true};
} else var q ={ isactif: true};
User.find( q  , function(err,users) {
  var user = {};
  if (err) console.log(err);
        for( var i = 0; i< users.length; i++)
        {
         user= toLdap(users[i]);
         if (req.filter.matches(user.attributes))
         res.send(user);
        }
   res.end();
   return next();
   });
}); // Fin Search



