/* eslint-disable */

const commentForm = document.getElementById('commentForm');
const commentsContainer = document.querySelector('.ctnt-cmmnt-list');
const commentsAmount = document.querySelector('.ctnt-cmmnts-amount');

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

    if (res.data.status.toLowerCase() !== 'success')
      return alert(`Coudnt post the comment\n${res.data.message}`);

    // Getting the comment data
    const commentData = res.data.data;
    console.log(commentData);

    // Compiling the comment pug template
    const compiledCommentRes = await axios({
      url: `http://127.0.0.1:3000/api/v1/comments/comment.pug`,
      method: 'POST',
      data: commentData,
    });

    // Checking the health
    if (compiledCommentRes.data.status !== 'success')
      return alert(
        `Coudnt load the comment\n${res.data.message}\nplease reload to see the comment`,
      );

    // Inserting the comment html
    commentsContainer.insertAdjacentHTML(
      'afterbegin',
      compiledCommentRes.data.data.compiledTemplate,
    );

    // Adding the comments count 1
    commentsAmount.textContent = String(
      parseInt(commentsAmount.textContent) + 1,
    );
    console.log('RESPONSE:', res);

    // console.log('RESPONSE:', res);
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
