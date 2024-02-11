const express = require('express');
const baseUrlController = require('../controllers/baseUrlController');

const router = express.Router({ mergeParams: true });
router.get('/get-env-url', baseUrlController.getBaseUrl);
module.exports = router;
