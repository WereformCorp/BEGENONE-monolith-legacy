/* eslint-disable */
const deleteCommentBtn = document.querySelector('.delete-comment-btn');

console.log(`DELETE COMMENT BUTTON`, deleteCommentBtn);

const deleteComment = async (commentId) => {
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

  const commentId = document.querySelector('.delete-comment-id').value;
  const userId = e.target.dataset.ownerId;

  const loggedInUserId = document.querySelector('.userId').value;

  // Check if the logged-in user is the owner of the comment
  if (userId === loggedInUserId) {
    deleteComment(commentId); // Proceed to delete the comment
  } else {
    alert('You can only delete your own comments.');
  }
  // deleteComment(commentId);
});
