'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/demandes', auth.hasRole('admin'), controller.demandes);
router.get('/bymail', controller.bymail);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/addusergroupe', controller.addusergroup);
router.put('/:id/delusergroupe', controller.delusergroup);
router.put('/:id/updateme', auth.isAuthenticated(), controller.updateMe);
router.put('/:id/update', auth.hasRole('admin'), controller.update);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;