/* eslint-disable */
import {
  Uppy,
  Dashboard,
  XHRUpload,
  Form,
  ImageEditor,
  Informer,
  StatusBar,
  ThumbnailGenerator,
} from 'https://releases.transloadit.com/uppy/v3.21.0/uppy.min.mjs';

const uppyBtn = document.querySelector('#openUppyButton');

const uppy = new Uppy({
  autoUpload: false,
  debug: true,
})
  .use(Dashboard, {
    inline: true,
    target: '#ctnt-vid-file-btn',
    theme: 'dark',
    width: '20rem',
    height: '12rem',
  })
  .use(XHRUpload, {
    endpoint: 'api/v1/videos/',
    fieldName: 'video',
    formData: true,
  })
  .use(Form, {
    target: '#videoUploadForm', // Replace with your form's ID
    getMetaFromForm: true,
    addResultToForm: true,
  })
  .setOptions({
    restrictions: {
      maxNumberOfFiles: 1,
    },
  });

// const uppyThumb = new Uppy({
//   autoUpload: false,
//   debug: true,
// })
//   .use(Dashboard, {
//     inline: true,
//     target: '#ctnt-thumb-file-btn',
//     theme: 'dark',
//     width: '20rem',
//     height: '12rem',
//   })
//   .use(XHRUpload, {
//     endpoint: 'api/v1/videos/',
//     fieldName: 'thumbnail',
//     formData: true,
//   })
//   .use(Form, {
//     target: '#videoUploadForm', // Replace with your form's ID
//     getMetaFromForm: true,
//     addResultToForm: true,
//   })
//   .setOptions({
//     restrictions: {
//       maxNumberOfFiles: 1,
//     },
//   });

document
  .getElementById('videoUploadForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    // Manually trigger the file upload
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    console.log(`Title: ${title}`, `Description: ${description}`);
    const video = uppy.getState().files[0];
    // const thumbnail = uppyThumb.getState().files[0]; // Uncomment if you're using thumbnail

    console.log(video);
    // console.log(thumbnail);

    if (!title) {
      alert('Title is required.');
      return;
    }

    uppy.upload();
    await uppy.run();
    // document.getElementById('videoUploadForm').submit();

    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/videos/',
        data: {
          title,
          description,
          video: video.filename,
          // thumbnail: thumbnail.filename,
        },
      });

      if (res.data.status === 'Success') {
        showAlert('success', 'Logged In Successfully!');
        // window.setTimeout(() => {
        //   location.assign('/upload');
        // }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
