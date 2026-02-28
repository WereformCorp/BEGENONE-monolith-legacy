/**
 * @fileoverview Environment-specific base URL utility route definition.
 * @module routes/urlPathRoutes
 * @layer Route
 * @basepath /api/v1/url
 *
 * @description
 * Registers a single GET endpoint at /get-env-url that returns the current
 * environment base URL via the baseUrlController. Used by client-side code
 * to resolve API and asset paths dynamically based on deployment environment.
 *
 * Middleware chain: no authentication guard; the endpoint is publicly accessible.
 *
 * @dependencies
 * - Upstream: app.js (mounted at /api/v1/url)
 * - Downstream: controllers/util-controllers/baseUrlController
 */

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
