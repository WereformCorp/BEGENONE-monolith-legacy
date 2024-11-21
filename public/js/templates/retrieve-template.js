// const axios = require('axios');
// console.log('HI FROM FRONTEND');
// axios
//   .get('http://localhost:80/') // Use the actual backend URL
//   .then((res) => {
//     const { title, videos, user, userData, thumbnail } = res.data;

//     // Render Pug template using the data
//     const html = pug.renderFile('frontend/main/mainVideoCard.pug', {
//       title: title,
//       videos: videos,
//       thumbnail: thumbnail,
//       user: user,
//       userData: userData,
//     });

//     console.log(`HTML FILE IS HERE: ------------------>${html}`);

//     // Inject the rendered HTML into the page (e.g., into a div with id="content")
//     document.getElementById('content').innerHTML = html;
//   })
//   .then((req, res) => {
//     console.log(`RESPONSE:`, res);
//   })
//   .catch((error) => {
//     console.error('Error fetching overview data:', error);
//   });
