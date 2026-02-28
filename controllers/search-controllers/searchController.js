/**
 * @fileoverview In-memory fuzzy search across video titles using Fuse.js
 * @module controllers/search-controllers/searchController
 * @layer Controller
 *
 * @description
 * Performs a fuzzy text search against all Video documents. Loads the full Video
 * collection into memory, initializes a Fuse.js instance keyed on the title field,
 * and executes the search against the query string parameter. This approach trades
 * memory for simplicity; it is suitable for moderate dataset sizes.
 *
 * @dependencies
 * - Upstream: search route handler
 * - Downstream: Video model, Fuse.js, catchAsync
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const Fuse = require('fuse.js');

const Video = require('../../models/videoModel');
const catchAsync = require('../../utils/catchAsync');

/**
 * Loads all Video documents, builds a Fuse.js index on the title field,
 * and returns fuzzy-matched results for the provided query string parameter.
 * @param {import('express').Request} req - Express request with query.query search term
 * @param {import('express').Response} res - Express response returning matched results
 * @param {import('express').NextFunction} next - Express next middleware
 */
const searchAll = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.query;
  try {
    const SEARCH_DATA = await Video.find();

    const FUSE_OPTIONS = {
      keys: ['title'],
      // includeScore: true, // This will include scores in the result
      // threshold: 0.4, // Adjust the threshold based on your preference
    };
    // Create a Fuse instance with the options
    // if (SEARCH_DATA && !FUSE_INSTANCE)
    const FUSE_INSTANCE = new Fuse(SEARCH_DATA, FUSE_OPTIONS);

    // if (!FUSE_INSTANCE) return;

    // Perform the search
    const searchResults = FUSE_INSTANCE.search(searchTerm);

    res.status(200).json({
      status: 'success',
      message: 'SuccessFully Loaded The Document',
      results: searchResults,
    });
  } catch (err) {
    console.log(`SEARCH | SEARCH CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = searchAll;
