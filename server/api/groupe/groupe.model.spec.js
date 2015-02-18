'use strict';

var should = require('should');
var app = require('../../app');
var Groupe = require('./groupe.model');

var groupe = new Groupe({
  name: 'test-groupe',
  info: 'Groupe de test',
  active: true,
  type: '0', // Ouvert,Modéré,Fermé
  owner: 'admin',
  adminby: ['admin', 'test'],
  participants: ['admin', 'eole']
});

describe('Groupe Model', function () {
  before(function (done) {
    // Clear users before testing
    Groupe.remove().exec().then(function () {
      done();
    });
  });

  afterEach(function (done) {
    Groupe.remove().exec().then(function () {
      done();
    });
  });

  it('should begin with no groupe', function (done) {
    Groupe.find({}, function (err, groupes) {
      groupes.should.have.length(0);
      done();
    });
  });

  /* it('should accept when saving a  groupe', function (done) {
         groupe.save(function () {
                 Groupe.find({}, function (err, groupes) {
                     groupes.should.have.length(1);
                     done();
                 });
             });
         });*/

  /*it('should fail when saving without an owner', function(done) {
      groupe.owner = '';
      groupe.save(function(err) {
        should.exist(err);
        done();
      });
    });


    it('should accept when saving a new  groupe', function (done) {
        groupe.save(function () {
            groupe.name = "Deux";
            var NewG = new Groupe(groupe);
            NewG.save(function () {
                Groupe.find({}, function (err, groupes) {
                    groupes.should.have.length(2);
                    done();
                });
            });
        });
    });

    */



});
