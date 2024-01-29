/* eslint-disable */
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
    console.log(user);
    const resUser = await axios.get(`/api/v1/users/${user}`);
    console.log(`This is User Response: ${resUser}`);
    const userChannel = resUser.data.user.channel;
    console.log(userChannel);

    let url;
    let method;

    if (userChannel && userChannel._id) {
      // Update an existing channel
      url = `http://127.0.0.1:3000/api/v1/channels/${userChannel._id}`;
      method = 'PATCH';
    } else {
      // Create a new channel
      url = 'http://127.0.0.1:3000/api/v1/channels';
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
      // showAlert('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/user-channel');
      }, 1500);
    }
  } catch (err) {
    console.log('error:', err);
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
