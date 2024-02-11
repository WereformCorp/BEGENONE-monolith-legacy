/* eslint-disable */
const logoutBtn = document.querySelector('.logoutBtn');

const logout = async (req, res) => {
  try {
    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;

    const res = await axios({
      method: 'GET',
      url: `${urlPath}/api/v1/users/logout`,
    });

    if (res.data.status === 'success') {
      // showAlert('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
  }
};

if (logoutBtn) logoutBtn.addEventListener('click', logout);
