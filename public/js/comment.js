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
    //   `http://127.0.0.1:3000/api/v1/videos/${videoId}`,
    // );

    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/videos/${videoId}/comments`,
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
