'use strict';

var express = require('express');
var controller = require('./poll.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/mypolls', controller.mypolls);
router.get('/:id', auth.isAuthenticated(), controller.show);
//router.post('/', controller.create);
router.post('/', auth.hasRole('admin_grp'), controller.create);
router.put('/:id/update', auth.hasRole('admin_grp'), controller.update);
router.put('/:id/vote', controller.vote);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
