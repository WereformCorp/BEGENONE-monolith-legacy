const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router({ mergeParams: true });

router.get('/content', searchController.searchAll);

module.exports = router;
