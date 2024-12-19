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

const chDeleteBtn = document.querySelector('.ch-delete');
const deleteChannel = async (channelId) => {
  try {
    // console.log(`DELETE CHANNEL FUNCTION -----> CHANNEL ID:`, channelId);
    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    const res = await axios.delete(`${urlPath}/api/v1/channels/${channelId}`);

    // console.log('RESPONSE:', res);

    if (res.data.status === '204') {
      // shownotyf.error('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('error:', err);
  }
};

chDeleteBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const channelId = document.querySelector('.ch-delete-input').value;

  console.log(`CHANNEL ID: ${channelId}`);
  deleteChannel(channelId);
});
