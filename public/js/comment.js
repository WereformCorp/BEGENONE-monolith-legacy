/* eslint-disable */
// const notyf = new Notyf({
//   duration: 10000, // Notification display time in ms
//   position: {
//     x: 'right',
//     y: 'top',
//   },
//   types: [
//     {
//       type: 'info',
//       background: 'blue',
//       icon: {
//         className: 'material-icons',
//         tagName: 'i',
//         text: 'info',
//       },
//     },
//   ],
// });

const commentForm = document.getElementById('commentForm');
const commentsContainer = document.querySelector('.ctnt-cmmnt-list');
const commentsAmount = document.querySelector('.ctnt-cmmnts-amount');
const commentHtmlHead = document.querySelector('.ctnt-cmmnt-listItems');

const channelId = document.querySelector('.hidden-channel-id');
const channelName = document.querySelector('.hidden-channel-name');

const postComment = async (comment) => {
  try {
    const commentText = comment.trim();

    if (commentText === '') {
      alert(`Please input a comment to proceed.`);
      return;
    }

    const videoId = document.querySelector('.videoId').value;
    // console.log(`This is the video ID: ${videoId}`);
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

    if (res.data.status.toLowerCase() !== 'success') {
      return alert(`Coudnt post the comment\n${res.data.message}`);
    }

    // Getting the comment data
    const commentData = res.data.data;

    console.log(`comment data:`, commentData);

    const compiledCommentRes = await axios({
      url: `${urlPath}/api/v1/comments/comment.pug`,
      method: 'POST',
      data: commentData,
    });

    console.log(`COMPILED COMMENT RESPONSE: `, compiledCommentRes.data);

    // Checking the health
    if (compiledCommentRes.data.status !== 'success')
      return alert(
        `Coudnt load the comment\n${res.data.message}\nplease reload to see the comment`,
      );

    if (res.data.status.toLowerCase() === 'success') {
      commentsContainer.insertAdjacentHTML(
        'afterbegin',
        compiledCommentRes.data.data.compiledTemplate,
      );
    }
    // Adding the comments count 1
    commentsAmount.textContent = String(
      parseInt(commentsAmount.textContent) + 1,
    );
    // console.log('RESPONSE:', res);

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
