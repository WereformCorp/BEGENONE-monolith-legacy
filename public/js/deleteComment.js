// /* eslint-disable */
// let deleteCommentBtn;
// if (document.querySelector('.delete-comment-btn')) {
//   deleteCommentBtn = document.querySelector('.delete-comment-btn');

//   console.log(`DELETE COMMENT BUTTON`, deleteCommentBtn);

//   const deleteComment = async (commentId) => {
//     try {
//       const baseUrl = await axios({
//         method: 'GET',
//         url: `/url/get-env-url`,
//       });
//       const urlPath = baseUrl.data.url;
//       const res = await axios({
//         method: 'DELETE',
//         url: `${urlPath}/api/v1/comments/${commentId}`,
//       }).then(location.reload(true));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   deleteCommentBtn.addEventListener('click', (e) => {
//     e.preventDefault();

//     const commentId = document.querySelector('.delete-comment-id').value;
//     const userId = e.target.dataset.ownerId;

//     const loggedInUserId = document.querySelector('.userId').value;

//     // Check if the logged-in user is the owner of the comment
//     if (userId === loggedInUserId) {
//       deleteComment(commentId); // Proceed to delete the comment
//     } else {
//       alert('You can only delete your own comments.');
//     }
//     // deleteComment(commentId);
//   });
// }

/* eslint-disable */

// Select all delete buttons for comments dynamically
const deleteCommentBtns = document.querySelectorAll('.delete-comment-btn');

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
    });
    // Remove the comment from the DOM if delete was successful
    const commentElement = document.querySelector(`#comment-${commentId}`);
    if (commentElement) {
      commentElement.remove();
    }
  } catch (err) {
    console.log('Error deleting comment:', err);
  }
};

// Attach event listeners to all delete comment buttons
deleteCommentBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const commentId = deleteBtn
      .closest('.comment')
      .querySelector('.delete-comment-id').value;
    const userId = deleteBtn.dataset.ownerId;
    const loggedInUserId = document.querySelector('.userId').value;

    // Check if the logged-in user is the owner of the comment
    if (userId === loggedInUserId) {
      deleteComment(commentId); // Proceed to delete the comment
    } else {
      alert('You can only delete your own comments.');
    }
  });
});
