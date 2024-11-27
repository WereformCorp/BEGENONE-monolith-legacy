/* eslint-disable */

const deleteBtn = document.querySelector('.deleteBtn');
const userId = document.querySelector('.userId').value;

console.log(`USERID SIRRR:`, userId);

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

if (deleteBtn) deleteBtn.addEventListener('click', deleteFunction);
