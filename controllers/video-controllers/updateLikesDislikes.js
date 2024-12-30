const Video = require('../../models/videoModel');
const catchAsync = require('../../utils/catchAsync');

const updateLikesDislikes = catchAsync(async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    const { action } = req.params; // 'like', 'dislike', or 'remove'

    // Find the video by its ID
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        status: 'fail',
        message: 'Video not found',
      });
    }

    // Check if the user already liked the video
    const userLiked = video.likedBy.includes(userId);
    const userDisliked = video.dislikedBy.includes(userId);

    if (action === 'like') {
      if (userLiked) {
        // If the user already liked, remove the like
        video.likes -= 1;
        const index = video.likedBy.indexOf(userId);
        video.likedBy.splice(index, 1);
      } else {
        // Increment the likes count
        video.likes += 1;

        // Add the user to the likedBy array
        video.likedBy.push(userId);

        // If the user already disliked, remove the dislike
        if (userDisliked) {
          video.dislikes -= 1;
          const index = video.dislikedBy.indexOf(userId);
          video.dislikedBy.splice(index, 1);
        }
      }
    } else if (action === 'dislike') {
      if (userDisliked) {
        // If the user already disliked, remove the dislike
        video.dislikes -= 1;
        const index = video.dislikedBy.indexOf(userId);
        video.dislikedBy.splice(index, 1);
      } else {
        // Increment the dislikes count
        video.dislikes += 1;

        // Add the user to the dislikedBy array
        video.dislikedBy.push(userId);

        // If the user already liked, remove the like
        if (userLiked) {
          video.likes -= 1;
          const index = video.likedBy.indexOf(userId);
          video.likedBy.splice(index, 1);
        }
      }
    }

    if (video.likes < 0)
      return new Error(
        `You Cannot Like a Video in Minus, What kinda guy does that? Ik there's probably a bug, just let us know about the error. `,
      );

    // Save the updated video
    await video.save();

    // Respond with the updated likes and dislikes count
    res.status(200).json({
      status: 'success',
      likes: video.likes,
      dislikes: video.dislikes,
      userLiked: video.likedBy.includes(userId),
      userDisliked: video.dislikedBy.includes(userId),
    });
  } catch (err) {
    console.log(`UPDATE LIKES DISLIKES | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateLikesDislikes;
