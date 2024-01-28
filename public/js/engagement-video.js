/* eslint-disable */
const likeButton = document.querySelector('.sect-mid-vdoP-navLike');
const dislikeButton = document.querySelector('.sect-mid-vdoP-navDislike');

const updateLikesDislikesCount = async (videoId, action) => {
  try {
    const response = await axios.patch(
      `http://127.0.0.1:3000/api/v1/videos/interaction/${videoId}/${action}`,
    );

    const likesCountElement = document.querySelector('.likesCount');
    const dislikesCountElement = document.querySelector('.dislikesCount');

    likesCountElement.textContent = response.data.likes;
    dislikesCountElement.textContent = response.data.dislikes;
  } catch (error) {
    console.error(`Error while ${action} the video:`, error);
  }
};

likeButton.addEventListener('click', async function () {
  const videoId = document.querySelector('.videoId').value;
  console.log(`THIS IS VIDEO ID FROM ENGAGEMENT VIDEO JS FILE: ${videoId}`);
  await updateLikesDislikesCount(videoId, 'like');
});

dislikeButton.addEventListener('click', async function () {
  const videoId = document.querySelector('.videoId').value;
  console.log(`THIS IS VIDEO ID FROM ENGAGEMENT VIDEO JS FILE: ${videoId}`);
  await updateLikesDislikesCount(videoId, 'dislike');
});
