// eslint-disable-next-line import/no-extraneous-dependencies
const Fuse = require('fuse.js');

const Video = require('../../models/videoModel');
const catchAsync = require('../../utils/catchAsync');

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
