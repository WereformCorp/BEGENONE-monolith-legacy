/* eslint-disable */

const commentForm = document.getElementById('commentForm');

const postComment = async (comment) => {
  try {
    const commentText = comment.trim();

    if (commentText === '') {
      alert(`Please input a comment to proceed.`);
      return;
    }

    const videoId = document.querySelector('.videoId').value;
    console.log(`This is the video ID: ${videoId}`);
    // const video = await axios.get(
    //   `${req.protocol}://${req.get('host')}/api/v1/videos/${videoId}`,
    // );

    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    const res = await axios({
      method: 'POST',
      url: `${urlPath}/api/v1/videos/${videoId}/comments`,
      data: {
        comment: commentText,
      },
    });

    console.log('RESPONSE:', res);
  } catch (err) {
    console.log(`ERROR MESSAGE: ${err.message}`, err);
  }
};

commentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const comment = document.getElementById('commentInput').value;

  console.log(`COMMENT: ${comment}`);
  postComment(comment);
});
