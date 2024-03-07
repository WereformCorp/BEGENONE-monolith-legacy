/* eslint-disable */
const delteVideoBtn = document.querySelector('.delteVideo-Btn');
const videoId = document.querySelector('.delteVideo-Btn').value;

const deleteVideo = async (req, res) => {
  try {
    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    const res = await axios({
      method: 'DELETE',
      url: `${urlPath}/api/v1/videos/${videoId}`,
    });

    window.location.href = '/all-uploads'; // Redirect to "/all-uploads"
  } catch (err) {
    console.log(err);
    res.json({
      message: err.message,
      err,
    });
  }
};

delteVideoBtn.addEventListener('click', (e) => {
  e.preventDefault();
  deleteVideo();
});
