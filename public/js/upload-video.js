/* eslint-disable */
import {
  Uppy,
  Dashboard,
  XHRUpload,
  Form,
  // } from 'https://releases.transloadit.com/uppy/v3.21.0/uppy.min.mjs';
} from 'https://releases.transloadit.com/uppy/v4.7.0/uppy.min.mjs';

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

const notyf = new Notyf({
  duration: 10000, // Notification display time in ms
  position: {
    x: 'right',
    y: 'top',
  },
  types: [
    {
      type: 'info',
      background: 'blue',
      icon: {
        className: 'material-icons',
        tagName: 'i',
        text: 'info',
      },
    },
  ],
});

const userReverifyLinkBtn = document.querySelector('.userReverifyLinkBtn');

if (userReverifyLinkBtn)
  userReverifyLinkBtn.addEventListener('click', function (e) {
    e.preventDefault();

    // Disable button to prevent accidental clicks during video upload
    userReverifyLinkBtn.disabled = true;

    // Redirect to verification page
    window.location.href = '/re-verify';
  });

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
    timeout: 600000,
    onBeforeRequest: (req) => {
      // Optionally log or modify the request
    },
    onSuccess: (response) => {
      // Handle success response if needed
      console.log('Upload succeeded:', response);
    },
    onError: (error) => {
      if (error.response) {
        const errorMessage =
          error.response.data.message || 'An unknown error occurred.';
        notyf.error(errorMessage);
      } else {
        notyf.error('Network error, please try again.');
      }
      console.error('Upload failed:', error);
    },
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
      maxFileSize: 200 * 1024 * 1024,
    },
  });

document
  .getElementById('openUppyButton-video')
  .addEventListener('click', (e) => {
    e.preventDefault();
    // Open the Dashboard modal
    uppyVid.getPlugin('Dashboard').openModal();
    // document.getElementById('openUppyButton-video').style.display = 'none';
  });

// Handle modal close event and cancel upload

uppyVid.on('file-added', (file) => {
  uppyVid.getPlugin('Dashboard').closeModal();
  if (file)
    document.getElementById('openUppyButton-video').style.display = 'none';
  else document.getElementById('openUppyButton-video').style.display = 'flex';

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
    endpoint: 'api/v1/videos/thumbnail/',
    fieldName: 'thumbnail',
    formData: true,
    timeout: 600000,
    onBeforeRequest: (req) => {
      // Optionally log or modify the request
    },
    onSuccess: (response) => {
      // Handle success response if needed
      console.log('Upload succeeded:', response);
    },
    onError: (error) => {
      // Handle upload failure response if needed
      console.error('Upload failed:', error);
    },
  })
  .use(Form, {
    target: '#videoUploadForm',
    triggerUploadOnSubmit: true,
  })
  .setOptions({
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*'],
      maxFileSize: 1 * 1024 * 1024,
    },
  });

document
  .getElementById('openUppyButton-thumb')
  .addEventListener('click', (e) => {
    e.preventDefault();
    // Open the Dashboard modal
    uppyThumb.getPlugin('Dashboard').openModal();
    // document.getElementById('openUppyButton-thumb').style.display = 'none';
  });

// Handle modal close event and cancel upload
uppyThumb.on('file-added', (file) => {
  uppyThumb.getPlugin('Dashboard').closeModal();

  if (file)
    document.getElementById('openUppyButton-thumb').style.display = 'none';
  else document.getElementById('openUppyButton-thumb').style.display = 'flex';

  const dashboardPlugin = uppyThumb.getPlugin('Dashboard');
  dashboardPlugin.setOptions({
    inline: true, // Change to inline mode
    target: '#ctnt-thumb-file-btn', // Ensure this matches the target ID
    // showLinkToFileUploadResult: true,
  });
});

uppyVid.on('complete', (result) => {
  console.log('Upload complete!', result);

  // Perform any actions you need after upload completes
  // For example, you can log the uploaded files
  console.log(result.successful);

  // Redirect to the desired URL
  // window.location.href = '/'; // Replace with your actual redirect URL
  if (result.successful.length > 0) {
    // Successfully uploaded
    window.location.href = '/'; // Redirect or show success message
  } else {
    // Handle failure
    notyf.error('Video upload failed.');
  }
});

document
  .getElementById('videoUploadForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      // Manually trigger the file upload
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      if (!title) {
        notyf.error('Title is required.');
        return;
      }

      const formattedDescription = description.replace(/\n/g, '<br>');
      document.getElementById('description').innerHTML = formattedDescription;

      const baseUrl = await axios({
        method: 'GET',
        url: `/url/get-env-url`,
      });
      const urlPath = baseUrl.data.url;
      console.log(urlPath);
      const response = await axios.post(`${urlPath}/api/v1/videos/`, {
        title,
        formattedDescription,
      });
      console.log(`RESPONSE . DATA:`, response.data);

      // if (response.data.status.toLowerCase() === 'success') {
      //   window.assign('/');
      //   location.reload(false);
      // }
    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => {
        console.log('Execution resumed after 5 seconds');
        // Continue the execution or perform additional actions here
      }, 5000);
    }
  });
