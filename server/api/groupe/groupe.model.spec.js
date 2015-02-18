'use strict';

var should = require('should');
var app = require('../../app');
var Groupe = require('./groupe.model');

var groupe = new Groupe({
  name: 'test-groupe',
  info: 'Groupe de test',
  active: true,
  type : '0',    // Ouvert,Modéré,Fermé
  owner_uid : 'admin',
  admin_uid : ['admin','test' ]
});

describe('Groupe Model', function() {
  before(function(done) {
    // Clear users before testing
    Groupe.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Groupe.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no groupe', function(done) {
    Groupe.find({}, function(err, groupes) {
      groupes.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate groupe', function(done) {
    groupe.save(function() {
      var Dup = new Groupe(groupe);
      Dup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

/*
  it('should accept when saving a new  groupe', function(done) {
    groupe.save(function() {
      groupe.name="Deux";
      var Dup = new Groupe(groupe);
      Groupe.find({}, function(err, groupes) {
      groupes.should.have.length(2);
      done();
      });
      });
  });
*/
/*
  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function() {
    return user.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function() {
    return user.authenticate('blah').should.not.be.true;
  });
*/
});
