/**
 * @fileoverview Search API route definition.
 * @module routes/searchRoutes
 * @layer Route
 * @basepath /api/v1/search
 *
 * @description
 * Registers a single GET endpoint at /content that delegates to the searchAll
 * controller for cross-collection content search. The router uses mergeParams: true
 * for potential nested mounting.
 *
 * Middleware chain: no authentication guard; the endpoint is publicly accessible.
 *
 * @dependencies
 * - Upstream: app.js (mounted at /api/v1/search)
 * - Downstream: controllers/search-controllers/searchController
 */

const express = require('express');
// const searchController = require('../controllers/searchController');
const searchAll = require('../controllers/search-controllers/searchController');

const router = express.Router({ mergeParams: true });

router.get(
  '/content',
  // searchController.searchAll
  searchAll,
);

module.exports = router;
