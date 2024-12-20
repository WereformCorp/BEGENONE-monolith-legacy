const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const { urlPath } = require('../util-controllers/urlPath-TimeController');

const clipZ = catchAsync(async (req, res, next) => {
  try {
    const videos = await axios.get(`${urlPath}/api/v1/videos/`);
    const videosData = videos.data.data;
    res.status(200).render('../views/main/contents/clipZ', {
      title: `Search Videos`,
      videos: videosData,
      showAds: res.locals.showAds,
    });
  } catch (err) {
    console.log(`CLIPZ | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = clipZ;
