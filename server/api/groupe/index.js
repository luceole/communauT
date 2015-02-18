'use strict';

var express = require('express');
var controller = require('./groupe.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');



var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/byowner', auth.isAuthenticated(), controller.byowner);
router.get('/isopen', auth.isAuthenticated(), controller.isopen);
router.get('/events',  controller.events);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/',  auth.hasRole('admin'), controller.create);
router.put('/:id/eventupdate',  (auth.hasRole('admin') || auth.hasRole('admin_grp')),controller.eventupdate);
router.put('/:id/update', auth.hasRole('admin')  ,controller.update);
router.patch('/:id',  auth.hasRole('admin_grp'),controller.update);
router.delete('/:id',  auth.hasRole('admin_grp'),controller.destroy);

module.exports = router;
