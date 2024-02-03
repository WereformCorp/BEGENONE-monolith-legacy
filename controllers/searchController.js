// eslint-disable-next-line import/no-extraneous-dependencies
const Fuse = require('fuse.js');

const Video = require('../models/videoModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const Channel = require('../models/channelModel');
// (async function () {
//   const SEARCH_DATA = await Video.find();
//   console.log(SEARCH_DATA);
// })();

exports.searchAll = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.query;
  // console.log(searchTerm);
  // let FUSE_INSTANCE;

  try {
    const SEARCH_DATA = await Video.find();
    // console.log(SEARCH_DATA);

    const FUSE_OPTIONS = {
      keys: [
        'title',
        // {
        //   title: SEARCH_DATA.map((video) => video.title),
        // },
      ],
      // includeScore: true, // This will include scores in the result
      // threshold: 0.4, // Adjust the threshold based on your preference
    };
    // Create a Fuse instance with the options
    // if (SEARCH_DATA && !FUSE_INSTANCE)
    const FUSE_INSTANCE = new Fuse(SEARCH_DATA, FUSE_OPTIONS);

    // if (!FUSE_INSTANCE) return;

    // Perform the search
    const searchResults = FUSE_INSTANCE.search(searchTerm);

    // const finalResults = searchResults.forEach((results) => results);
    // console.log(searchResults);
    // console.log(searchResults.length);
    res.status(200).json({
      status: 'success',
      message: 'SuccessFully Loaded The Document',
      results: searchResults,
    });
  } catch (err) {
    res.json({
      status: 'Fail',
      message: err.message,
      err,
    });
  }
});
