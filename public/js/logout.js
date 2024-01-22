/* eslint-disable */
const logoutBtn = document.querySelector('.logoutBtn');

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err.response);
  }
};

if (logoutBtn) logoutBtn.addEventListener('click', logout);
