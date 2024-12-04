const express = require('express');
// const baseUrlController = require('../controllers/baseUrlController');
const getBaseUrl = require('../controllers/util-controllers/baseUrlController');

const router = express.Router({ mergeParams: true });
router.get(
  '/get-env-url',
  // baseUrlController.getBaseUrl
  getBaseUrl,
);

module.exports = router;
