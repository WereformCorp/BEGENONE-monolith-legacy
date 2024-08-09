/* eslint-disable */
import {
  Uppy,
  Dashboard,
  XHRUpload,
  Form,
  DragDrop,
  ImageEditor,
  Informer,
  StatusBar,
  ThumbnailGenerator,
  // } from 'https://releases.transloadit.com/uppy/v3.17.0/uppy.min.js';
} from 'https://releases.transloadit.com/uppy/v3.21.0/uppy.min.mjs';

// import Uppy from '@uppy/core';
// import Dashboard from '@uppy/dashboard';
// import XHRUpload from '@uppy/xhr-upload';
// import Form from '@uppy/form';
// import DragDrop from '@uppy/drag-drop';
// import ImageEditor from '@uppy/image-editor';
// import Informer from '@uppy/informer';
// import StatusBar from '@uppy/status-bar';
// import ThumbnailGenerator from '@uppy/thumbnail-generator';

// // Include necessary CSS files
// import '@uppy/core/dist/style.css';
// import '@uppy/dashboard/dist/style.css';
// import '@uppy/status-bar/dist/style.css';

const uppyVid = new Uppy({
  autoUpload: true,
  debug: true,
  // autoProceed: true,
});

uppyVid
  .use(Dashboard, {
    inline: false, // Start as modal
    target: '#ctnt-vid-file-btn',
    theme: 'dark',
    width: '100%',
    height: '100%',

    hideUploadButton: true,
    // showLinkToFileUploadResult: true,
  })
  .use(XHRUpload, {
    endpoint: 'api/v1/videos/',
    fieldName: 'video',
    formData: true,
  })
  .use(Form, {
    target: '#videoUploadForm',
    triggerUploadOnSubmit: true,
    submitOnSuccess: true,
  })
  .setOptions({
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['video/*'],
    },
  });

document
  .getElementById('openUppyButton-video')
  .addEventListener('click', (e) => {
    e.preventDefault();
    // Open the Dashboard modal
    uppyVid.getPlugin('Dashboard').openModal();
    document.getElementById('openUppyButton-video').style.display = 'none';
  });

// Handle modal close event and cancel upload

uppyVid.on('file-added', (file) => {
  uppyVid.getPlugin('Dashboard').closeModal();

  const dashboardPlugin = uppyVid.getPlugin('Dashboard');
  dashboardPlugin.setOptions({
    inline: true, // Change to inline mode
    target: '#ctnt-vid-file-btn', // Ensure this matches the target ID
    // showLinkToFileUploadResult: true,
  });
  // document.getElementById('openUppyButton-video').style.display = 'none';
});

// uppyVid.use(DragDrop, { target: '#ctnt-vid-file-btn' });

const uppyThumb = new Uppy({
  autoUpload: true,
  debug: true,
  // autoProceed: true,
});

uppyThumb
  .use(Dashboard, {
    inline: false, // Start as modal
    target: '#ctnt-thumb-file-btn',
    theme: 'dark',
    width: '100%',
    height: '100%',

    hideUploadButton: true,
    // showLinkToFileUploadResult: true,
  })
  .use(XHRUpload, {
    endpoint: 'api/v1/videos/thumbnail',
    fieldName: 'thumbnail',
    formData: true,
  })
  .use(Form, {
    target: '#videoUploadForm',
    triggerUploadOnSubmit: true,
    // submitOnSuccess: true,
  })
  .setOptions({
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*'],
    },
  });

document
  .getElementById('openUppyButton-thumb')
  .addEventListener('click', (e) => {
    e.preventDefault();
    // Open the Dashboard modal
    uppyThumb.getPlugin('Dashboard').openModal();
    document.getElementById('openUppyButton-thumb').style.display = 'none';
  });

// Handle modal close event and cancel upload

uppyThumb.on('file-added', (file) => {
  uppyThumb.getPlugin('Dashboard').closeModal();

  const dashboardPlugin = uppyThumb.getPlugin('Dashboard');
  dashboardPlugin.setOptions({
    inline: true, // Change to inline mode
    target: '#ctnt-thumb-file-btn', // Ensure this matches the target ID
    // showLinkToFileUploadResult: true,
  });
  // document.getElementById('openUppyButton-video').style.display = 'none';
});

document
  .getElementById('videoUploadForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      // const videoResult = await uppyVid.upload();

      // const videoResult = await uppyVid.run();
      // const thumbnailResult = await uppyThumb.run();

      // // Combine the results
      // const combinedResults = {
      //   video: videoResult,
      //   thumbnail: thumbnailResult,
      // };

      // console.log(combinedResults.video, combinedResults.thumbnail);

      // Check if the video file was successfully uploaded
      // const hasVideo = combinedResults.video.successful.length > 0;

      // if (!hasVideo) {
      //   alert('Please upload the video file.');
      //   return;
      // }

      // if (videoResult.successful.length > 0) {
      // Manually trigger the file upload
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      // const videoData = videoResult.getState().files[0].filename;
      // const videoUrl =
      //   combinedResults.video.successful[0].response.body.fileUrl;
      // const thumbnailData = thumbnailResult.getState().files[0].filename; // Uncomment if you're using thumbnail

      if (!title) {
        alert('Title is required.');
        return;
      }

      const baseUrl = await axios({
        method: 'GET',
        url: `/url/get-env-url`,
      });
      const urlPath = baseUrl.data.url;
      console.log(urlPath);

      // const thumb = await axios({
      //   method: 'POST',
      //   url: `${urlPath}/api/v1/videos/thumbnail/`,
      //   data: { thumbnail: thumbnailData },
      // });

      // console.log(thumb.data.data.thumbnail);

      // const videoFile = videoResult;
      // const thumbnailFile = thumbnailResult;

      const response = await axios.post(`${urlPath}/api/v1/videos/`, {
        title,
        description,
        // video: videoUrl,
        // thumbnail: thumb.data.data.thumbnail,
      });

      // const res = await axios({
      //   method: 'POST',
      //   url: `${urlPath}/api/v1/videos/`,
      //   data: {
      //     title,
      //     description,
      //     // video: videoUrl,
      //     // thumbnail: thumb.data.data.thumbnail,
      //   },
      // });

      // if (result.successful.length > 0) {
      //   // Redirect after successful upload
      //   window.location.href = '/success-page'; // Replace with your redirect URL
      // } else {
      //   console.error('Upload failed:', result.failed);
      // }

      console.log(`RESPONSE . DATA:`, response.data);

      if (response.data.status.toLowerCase() === 'success') {
        window.assign('/');
        location.reload(false);
        // window.setTimeout(() => {
        //   location.assign('true');
        // }, 1500);
      }
      // } else {
      //   alert('Please upload the video file.');
      // }
    } catch (error) {
      console.error('Error:', error);
    }
  });
