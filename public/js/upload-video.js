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
} from 'https://releases.transloadit.com/uppy/v3.21.0/uppy.min.mjs';

const uppyVid = new Uppy({
  autoUpload: false,
  debug: true,
})
  .use(Dashboard, {
    inline: true,
    target: '#ctnt-vid-file-btn',
    theme: 'dark',
    width: '20rem',
    height: '100%',
    hideUploadButton: true,
    showLinkToFileUploadResult: true,
  })
  .use(XHRUpload, {
    endpoint: 'api/v1/videos/',
    fieldName: 'video',
    formData: true,
  })
  .use(Form, {
    target: '#videoUploadForm', // Replace with your form's ID
    triggerUploadOnSubmit: true,
    submitOnSuccess: true,
  })
  .setOptions({
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['video/*'],
    },
  });

const uppyThumb = new Uppy({
  autoUpload: false,
  debug: true,
})
  .use(Dashboard, {
    inline: true,
    target: '#ctnt-thumb-file-btn',
    theme: 'dark',
    width: '20rem',
    height: '100%',
    hideUploadButton: true,
    showLinkToFileUploadResult: true,
  })
  .use(XHRUpload, {
    endpoint: 'api/v1/videos/thumbnail',
    fieldName: 'thumbnail',
    formData: true,
  })
  .use(Form, {
    target: '#videoUploadForm', // Replace with your form's ID
    triggerUploadOnSubmit: true,
    submitOnSuccess: true,
  })
  .setOptions({
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*'],
    },
  });

document
  .getElementById('videoUploadForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const videoResult = await uppyVid.run();
    const thumbnailResult = await uppyThumb.run();

    // Combine the results
    const combinedResults = {
      video: videoResult,
      thumbnail: thumbnailResult,
    };

    // console.log(combinedResults.video, combinedResults.thumbnail);

    // Check if the video file was successfully uploaded
    const hasVideo = combinedResults.video.successful.length > 0;

    if (!hasVideo) {
      alert('Please upload the video file.');
      return;
    }

    // Manually trigger the file upload
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const videoData = videoResult.getState().files[0].filename;
    const thumbnailData = thumbnailResult.getState().files[0].filename; // Uncomment if you're using thumbnail

    if (!title) {
      alert('Title is required.');
      return;
    }

    try {
      const baseUrl = await axios({
        method: 'GET',
        url: `/url/get-env-url`,
      });
      const urlPath = baseUrl.data.url;

      const thumb = await axios({
        method: 'POST',
        url: `${urlPath}/api/v1/videos/thumbnail/`,
        data: { thumbnail: thumbnailData },
      });

      console.log(thumb.data.data.thumbnail);

      // const videoFile = videoResult;
      // const thumbnailFile = thumbnailResult;

      const res = await axios({
        method: 'POST',
        url: `${urlPath}/api/v1/videos/`,
        data: {
          title,
          description,
          video: videoData,
          thumbnail: thumb.data.data.thumbnail,
        },
      });

      if (res.data.status.toLowerCase() === 'success') {
        location.reload(true);
        // window.setTimeout(() => {
        //   location.assign('true');
        // }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
