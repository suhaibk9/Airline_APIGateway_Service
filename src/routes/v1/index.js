const express = require('express');

const { InfoController } = require('../../controllers');

const router = express.Router();

router.get('/info', InfoController.info);
router.use('/', require('./user-routes'));

module.exports = router;
