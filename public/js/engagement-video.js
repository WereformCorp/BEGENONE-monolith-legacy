/* eslint-disable */
// const likeButton = document.querySelector('.sect-mid-vdoP-navLike');
// const dislikeButton = document.querySelector('.sect-mid-vdoP-navDislike');

// const updateLikesDislikesCount = async (videoId, action) => {
//   try {
//     const baseUrl = await axios({
//       method: 'GET',
//       url: `/url/get-env-url`,
//     });
//     const urlPath = baseUrl.data.url;
//     const response = await axios.patch(
//       `${urlPath}/api/v1/videos/interaction/${videoId}/${action}`,
//     );

//     const likesCountElement = document.querySelector('.likesCount');
//     const dislikesCountElement = document.querySelector('.dislikesCount');

//     likesCountElement.textContent = `Likes - ${response.data.likes}`;
//     dislikesCountElement.textContent = `Dislike - ${response.data.dislikes}`;
//   } catch (error) {
//     console.error(`Error while ${action} the video:`, error);
//   }
// };

// likeButton.addEventListener('click', async function () {
//   const videoId = document.querySelector('.videoId').value;
//   // console.log(`THIS IS VIDEO ID FROM ENGAGEMENT VIDEO JS FILE: ${videoId}`);
//   await updateLikesDislikesCount(videoId, 'like');
// });

// dislikeButton.addEventListener('click', async function () {
//   const videoId = document.querySelector('.videoId').value;
//   console.log(`THIS IS VIDEO ID FROM ENGAGEMENT VIDEO JS FILE: ${videoId}`);
//   await updateLikesDislikesCount(videoId, 'dislike');
// });

// Function to update likes and dislikes count
// const updateLikesDislikesCount = async (videoId, action) => {
//   try {
//     const baseUrl = await axios({
//       method: 'GET',
//       url: `/url/get-env-url`,
//     });
//     const urlPath = baseUrl.data.url;
//     const response = await axios.patch(
//       `${urlPath}/api/v1/videos/interaction/${videoId}/${action}`,
//     );

//     console.log(
//       `RESPONSE FROM UPDATE LIKES DISLIKES COUNT FUNCTION:`,
//       response.data,
//     );

//     if (response.data.status === 'success') {
//       const likesCountElement = document.querySelector('.likesCount');
//       const dislikesCountElement = document.querySelector('.dislikesCount');

//       likesCountElement.textContent = `Likes - ${response.data.likes}`;
//       dislikesCountElement.textContent = `Dislikes - ${response.data.dislikes}`;
//     } else {
//       alert(`Error while ${action}ing the video: ${response.data.status}`);
//     }
//   } catch (error) {
//     console.error(`Error while ${action} the video:`, error);
//   }
// };

// // Function to observe like and dislike button clicks for all videos
// const observeLikeDislikeButtons = () => {
//   // Event delegation: Add a single event listener to a parent element (document)
//   document.addEventListener('click', (event) => {
//     const likeButton = event.target.closest('.sect-mid-vdoP-navLike');
//     console.log(`LIKE BUTTON:`, likeButton);
//     const dislikeButton = event.target.closest('.sect-mid-vdoP-navDislike');
//     console.log(`DISLIKE BUTTON:`, dislikeButton);

//     if (likeButton) {
//       console.log(
//         `LIKE BUTTON IN IF STATEMENT FROM ENGAGEMENT VIDEO JS:`,
//         likeButton,
//       );
//       // Find videoId for the clicked like button
//       const videoId = likeButton
//         .closest('.content-containers')
//         .getAttribute('data-video-id');
//       console.log(`VIDEO ID:`, videoId);
//       updateLikesDislikesCount(videoId, 'like');
//     }

//     if (dislikeButton) {
//       console.log(
//         `DISLIKE BUTTON IN IF STATEMENT FROM ENGAGEMENT VIDEO JS:`,
//         dislikeButton,
//       );
//       // Find videoId for the clicked dislike button
//       const videoId = dislikeButton
//         .closest('.content-containers')
//         .getAttribute('data-video-id');
//       console.log(`VIDEO ID:`, videoId);
//       updateLikesDislikesCount(videoId, 'dislike');
//     }
//   });
// };

const updateLikesDislikesCount = async (videoId, action, buttonElement) => {
  try {
    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    const response = await axios.patch(
      `${urlPath}/api/v1/videos/interaction/${videoId}/${action}`,
    );

    console.log(
      `RESPONSE FROM UPDATE LIKES DISLIKES COUNT FUNCTION:`,
      response.data,
    );

    if (response.data.status === 'success') {
      // Find the specific video container for the clicked button
      const videoContainer = buttonElement.closest('.content-containers');

      // Find the likes and dislikes count elements within this video container
      const likesCountElement = videoContainer.querySelector('.likesCount');
      const dislikesCountElement =
        videoContainer.querySelector('.dislikesCount');

      // Update the counts for the correct video
      if (likesCountElement) {
        likesCountElement.textContent = `Like - ${response.data.likes}`;
      }
      if (dislikesCountElement) {
        dislikesCountElement.textContent = `Dislike - ${response.data.dislikes}`;
      }
    } else {
      alert(`Error while ${action}ing the video: ${response.data.status}`);
    }
  } catch (error) {
    console.error(`Error while ${action} the video:`, error);
  }
};

// Function to observe like and dislike button clicks for all videos
const observeLikeDislikeButtons = () => {
  // Event delegation: Add a single event listener to a parent element (document)
  document.addEventListener('click', (event) => {
    const likeButton = event.target.closest('.sect-mid-vdoP-navLike');
    const dislikeButton = event.target.closest('.sect-mid-vdoP-navDislike');

    if (likeButton) {
      // Find videoId for the clicked like button
      const videoId = likeButton
        .closest('.content-containers')
        .getAttribute('data-video-id');
      updateLikesDislikesCount(videoId, 'like', likeButton);
    }

    if (dislikeButton) {
      // Find videoId for the clicked dislike button
      const videoId = dislikeButton
        .closest('.content-containers')
        .getAttribute('data-video-id');
      updateLikesDislikesCount(videoId, 'dislike', dislikeButton);
    }
  });
};

// Initialize the observer
observeLikeDislikeButtons();

// Call the function to observe like and dislike interactions
// observeLikeDislikeButtons();
