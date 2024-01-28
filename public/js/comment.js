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
    // const video = await axios.get(
    //   `http://127.0.0.1:3000/api/v1/videos/${videoId}`,
    // );
    // console.log(videoId);

    // console.log(commentText);

    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/videos/${videoId}/comments`,
      data: {
        comment: commentText,
      },
    });

    console.log('RESPONSE:', res);

    // if (res.data.status === 'success') {
    //   // showAlert('success', 'Logged In Successfully!');
    //   window.setTimeout(() => {
    //     location.assign('/');
    //   }, 1500);
    // }
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
