'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');

var user = new User({
  provider: 'local',
  uid: 'myuid',
  name: 'Fake User',
  surname: 'surname user',
  structure: 'my structure',
  isactif: false,
  isdemande: true,
  email: 'test@test.com',
  password: 'password'
});

describe('User Model', function() {
  before(function(done) {
    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });
  
    it('should accept when saving a  user', function(done) {         
    user.save(function() {
       User.find({}, function(err, users) {
      users.should.have.length(1);
      done();
    });
    });
  });
    
  it('should fail when saving a duplicate user', function(done) {
    user.save(function() {        
      var userDup = new User(user);
        userDup.save(function(err) {
      User.find({}, function(err, users) {
      users.should.have.length(1);
        done();
      });
    });
  });
  });

  it('should fail when saving without an email', function(done) {
    var user1 = new User(user);
    user1.email = '';
    user1.save(function(err) {
      should.exist(err);
      done();
    });
  });
    
      it('should fail when saving without an uid', function(done) {
    var user1 = new User(user);
    user1.uid='';
    user1.save(function(err) {
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
});