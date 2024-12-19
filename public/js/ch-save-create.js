/* eslint-disable */
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

const chCreateSaveBtn = document.querySelector('.ch-dtls-about-owner-save-btn');
const createChannel = async (
  name,
  channelUserName,
  about,
  commentToggle,
  commentFilters,
) => {
  try {
    const user = document.getElementById('userId').value;
    // console.log(user);

    let url;
    let method;

    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;

    const resUser = await axios.get(`${urlPath}/api/v1/users/${user}`);
    console.log(`This is User Response: ${JSON.stringify(resUser, null, 2)}`);
    const userChannel = resUser.data.user.channel;
    // console.log(userChannel);

    if (userChannel && userChannel._id) {
      // Update an existing channel
      url = `${urlPath}/api/v1/channels/${userChannel._id}`;
      method = 'PATCH';
    } else {
      // Create a new channel
      url = `${urlPath}/api/v1/channels`;
      method = 'POST';
    }

    const res = await axios({
      method,
      url,
      data: {
        name,
        channelUserName,
        about,
        // commentToggle,
        // commentFilters,
      },
    });

    console.log('RESPONSE:', res);

    if (res.data.status === 'Success') {
      notyf.success('Channel Created Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('error:', err);
    if (err.response && err.response.data && err.response.data.message) {
      notyf.error(`ERROR: ${err.response.data.message}`);
    } else {
      // Generic fallback error
      notyf.error('An unexpected error occurred. Please try again.');
    }
  }
};

chCreateSaveBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const name = document.querySelector('.ch-name-input').value;
  const username = document.querySelector('.ch-username-input').value;
  const about = document.querySelector('.ch-about-textarea').value;

  console.log(`Name: ${name}`, `Username: ${username}`, `About: ${about}`);
  createChannel(name, username, about);
});
