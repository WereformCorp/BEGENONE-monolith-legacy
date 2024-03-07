/* eslint-disable */
const deleteCommentBtn = document.querySelector('.delete-comment-Btn');
const commentId = document.querySelector('.delete-comment-Btn').value;

const deleteComment = async () => {
  try {
    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    const res = await axios({
      method: 'DELETE',
      url: `${urlPath}/api/v1/comments/${commentId}`,
    }).then(location.reload(true));
  } catch (err) {
    console.log(err);
  }
};

deleteCommentBtn.addEventListener('click', (e) => {
  e.preventDefault();

  deleteComment();
});
