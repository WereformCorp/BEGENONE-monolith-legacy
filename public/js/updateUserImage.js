/* eslint-disable */
import {
  Uppy,
  Dashboard,
  XHRUpload,
  ImageEditor,
  Form,
  // } from 'https://releases.transloadit.com/uppy/v3.21.0/uppy.min.mjs';
} from 'https://releases.transloadit.com/uppy/v4.7.0/uppy.min.mjs';

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

const uppyPfp = new Uppy({
  autoUpload: true,
  debug: true,
});

uppyPfp
  .use(Dashboard, {
    inline: false,
    target: '#ch-upload-pfp-file-btn',
    theme: 'dark',
    width: '100%',
    height: '100%',
    hideUploadButton: false,
  })
  .use(XHRUpload, {
    endpoint: 'api/v1/channels/profilepic',
    fieldName: 'profilepic',
    formData: true,
    timeout: 600000,
    onSuccess: (response) => {
      notyf.success('Upload successful!');
      console.log('Upload response:', response);
    },
    onError: (error) => {
      notyf.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
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
      maxFileSize: 2 * 1024 * 1024,
    },
  });

document
  .getElementById('openUppyButton-profilepic')
  .addEventListener('click', (e) => {
    e.preventDefault();
    uppyPfp.getPlugin('Dashboard').openModal();
  });

uppyPfp.on('file-added', (file) => {
  uppyPfp.getPlugin('Dashboard').closeModal();
  if (file)
    document.getElementById('openUppyButton-profilepic').style.display = 'none';
  else
    document.getElementById('openUppyButton-profilepic').style.display = 'flex';
  const dashboardPlugin = uppyPfp.getPlugin('Dashboard');
  dashboardPlugin.setOptions({
    inline: true,
    target: '#ch-upload-pfp-file-btn',
  });
});

const uppyBanner = new Uppy({
  autoUpload: true,
  debug: true,
});

uppyBanner
  .use(Dashboard, {
    inline: false,
    target: '.section-middle-image-editor',
    theme: 'dark',
    width: '100%',
    height: '100%',
    hideUploadButton: false,
  })
  .use(XHRUpload, {
    endpoint: 'api/v1/channels/banner',
    fieldName: 'banner',
    formData: true,
    timeout: 600000,
    onSuccess: (response) => {
      notyf.success('Upload successful!');
      console.log('Upload response:', response);
    },
    onError: (error) => {
      notyf.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    },
  })
  .use(ImageEditor, {
    target: Dashboard,
    cropperOptions: {
      aspectRatio: 5 / 1, // Set the aspect ratio to 5:1
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
      maxFileSize: 2 * 1024 * 1024,
    },
  });

document
  .getElementById('openUppyButton-banner')
  .addEventListener('click', (e) => {
    e.preventDefault();
    uppyBanner.getPlugin('Dashboard').openModal();
  });

// Handle modal close event and cancel upload
uppyBanner.on('file-added', (file) => {
  // uppyBanner.getPlugin('Dashboard').closeModal();
  document.getElementById('container').style.backgroundColor =
    'rgba(24,24,24,0.3)';
  if (file) {
    document.getElementById('openUppyButton-banner').style.display = 'none';
  } else
    document.getElementById('openUppyButton-banner').style.display = 'flex';
  const dashboardPlugin = uppyBanner.getPlugin('Dashboard');
  dashboardPlugin.setOptions({
    inline: true, // Change to inline mode
    target: '.section-middle-image-editor', // Ensure this matches the target ID
  });
});

// uppyPfp.on('complete', (result) => {
//   console.log('Upload complete!');
//   // Perform any actions you need after upload completes, For example, you can log the uploaded files
//   console.log(result.successful);

//   // Redirect to the desired URL
//   window.location.href = '/channel-settings'; // Replace with your actual redirect URL
// });

// document
//   .getElementById('videoUploadForm')
//   .addEventListener('submit', async (e) => {
//     e.preventDefault();

//     try {
//       // Manually trigger the file upload
//       const title = document.getElementById('title').value;
//       const description = document.getElementById('description').value;
//       if (!title) {
//         notyf.error('Title is required.');
//         return;
//       }

//       const formattedDescription = description.replace(/\n/g, '<br>');
//       document.getElementById('description').innerHTML = formattedDescription;

//       const baseUrl = await axios({
//         method: 'GET',
//         url: `/url/get-env-url`,
//       });
//       const urlPath = baseUrl.data.url;
//       console.log(urlPath);
//       const response = await axios.post(`${urlPath}/api/v1/channels/`, {
//         title,
//         formattedDescription,
//       });
//       console.log(`RESPONSE . DATA:`, response.data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   });
