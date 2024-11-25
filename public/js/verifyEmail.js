// /* eslint-disable */

// const { default: axios } = require('axios');

// // Frontend: Email verification page
// document.addEventListener('DOMContentLoaded', async () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const token = urlParams.get('token'); // Retrieve the token from the URL

//   const baseUrl = await axios({
//     method: 'GET',
//     url: `/url/get-env-url`,
//   });
//   const urlPath = baseUrl.data.url;

//   if (token) {
//     const response = await axios.get(
//       `${urlPath}/api/v1/users/verifyEmail/${token}`,
//     );

//     console.log(`RESPONSE FROM verifyEMAIL.js:`, response);

//     const data = await response.json();

//     if (data.status === 'success') {
//       alert('Your account has been successfully activated!');
//       window.location.assign('/'); // Or redirect to the main page
//     } else {
//       alert('Invalid or expired token.');
//     }
//   } else {
//     alert('No token provided.');
//   }
// });
