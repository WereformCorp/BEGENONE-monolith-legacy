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

const deleteBtn = document.querySelector('.deleteBtn');
const userId = document.querySelector('.userId').value;

// console.log(`USERID SIRRR:`, userId);

const deleteFunction = async (req, res) => {
  try {
    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;

    const res = await axios({
      method: 'GET',
      url: `${urlPath}/api/v1/users/`,
    }).then((data) => {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    });

    // if (res.data.status === 'success') {
    //   // shownotyf.error('success', 'Logged In Successfully!');
    //   window.setTimeout(() => {
    //     location.assign('/');
    //   }, 1500);
    // }
  } catch (err) {
    console.log(err.response);
  }
};

deleteBtn.addEventListener('click', deleteFunction);
