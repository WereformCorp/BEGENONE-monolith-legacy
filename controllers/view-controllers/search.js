/**
 * @fileoverview Search results page view renderer
 * @module controllers/view-controllers/search
 * @layer Controller (View)
 *
 * @description
 * Renders the search results page. Fetches search results from the internal
 * search API, resolves thumbnail and channel logo CloudFront URLs, and
 * passes the enriched video list to the listSearch template.
 *
 * @dependencies
 * - Upstream: view route handler
 * - Downstream: axios (internal API), urlPath-TimeController, catchAsync
 */
const axios = require('axios');

const catchAsync = require('../../utils/catchAsync');
const {
  urlPath,
  calculateTimeAgo,
} = require('../util-controllers/urlPath-TimeController');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"

const search = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.query;

  try {
    // Fetch search results
    const response = await axios.get(
      `${urlPath}/search/content?query=${searchTerm}`,
    );
    const data = response.data.results;

    // Extract video data
    const videosData = data.map((video) => video.item);

    // Fetch all thumbnails
    const thumbnailsResponse = await axios.get(
      `${urlPath}/api/v1/videos/thumbnail`,
    );
    const thumbnails = thumbnailsResponse.data.urls;

    // Create a map of thumbnail filename to URL
    const thumbnailMap = new Map(
      thumbnails.map((item) => [item.thumbnail, item.url]),
    );

    // Map the thumbnail URLs to all videos
    const videosWithThumbnails = videosData
      .filter((video) => video.channel)
      .map((video) => ({
        ...video,
        thumbnailUrl: thumbnailMap.get(video.thumbnail) || null,
        timeAgo: calculateTimeAgo(video.time), // Assuming you have a function to calculate time ago
        channelLogo: video.channel.channelLogo || null,
      }));

    videosWithThumbnails.forEach((video) => {
      video.channelLogo = `${cloudFrontDomain}/${video.channelLogo}`;
    });

    // console.log(`CHANNEL LOGO:`, videosWithThumbnails);

    // Render the search results with the correct videosWithThumbnails
    res.status(200).render('../views/main/search/_listSearch', {
      title: 'Search Videos',
      user: res.locals.user,
      userData: res.locals.user,
      videos: videosWithThumbnails,
      showAds: res.locals.showAds,

      // channelLogo: videosWithThumbnails.channel.channelLogo,
    });
  } catch (err) {
    console.log(`SEARCH | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = search;
