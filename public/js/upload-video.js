/* eslint-disable */
const uploadVideoForm = document.querySelector('.sect-mid-contentContainer');
// thumbnail,
// section,
// sponsors,
const upload = async (title, description, video) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/videos',
      data: {
        title,
        description,
        video,
        // thumbnail,
        // section,
        // sponsors,
      },
    });

    console.log('RESPONSE:', res);

    if (res.data.status === 'success') {
      // showAlert('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('error:', err);
  }
};

uploadVideoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const video = document.getElementById('videoFile').files[0];

  console.log(`TITLE: ${title}`, `PASSWORD: ${description}`);
  upload(title, description, video);
});
