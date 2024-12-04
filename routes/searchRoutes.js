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
