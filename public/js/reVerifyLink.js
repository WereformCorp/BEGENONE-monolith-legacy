/* eslint-disable */
const btnReset = document.querySelector('.btn-resend');
const btnGoHome = document.querySelector('.btn-goHome');
btnReset.addEventListener('click', async function (e) {
  e.preventDefault(); // Prevent default anchor behavior

  try {
    btnReset.textContent = 'Sending to your email...';

    const baseUrl = await axios({
      method: 'GET',
      url: `/url/get-env-url`,
    });
    const urlPath = baseUrl.data.url;
    // Trigger the resend verification request
    const verificationData = await axios({
      method: 'POST',
      url: `${urlPath}/api/v1/users/resend-verification`,
    });

    if (verificationData.data.status === 'success') {
      btnReset.textContent = 'Email Sent!';
      btnReset.style.display = 'none';
      btnGoHome.style.display = 'block';
      btnGoHome.textContent = 'Sent To Your Email! Go Home?';

      alert('Verification link resent! Please check your email.');
    } else {
      alert(
        'There was an issue sending the verification link. Please try again.',
      );
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      alert(error.response.data.message); // Show specific error (rate limit)
    } else {
      btnReset.textContent = 'Email Sent!';
      btnReset.style.display = 'none';
      btnGoHome.style.display = 'block';
      btnGoHome.textContent = 'An Error Occured';
      alert(
        "If you have tried more than 2 times, you can't resend another email for another 1 hour. [An error occurred. Please try again later.]",
      );
      setTimeout(() => {
        window.location.href = '/'; // Redirect to homepage
      }, 1000);
    }
  }
});

btnGoHome.addEventListener('click', async function (e) {
  setTimeout(() => {
    window.location.href = '/'; // Redirect to homepage
  }, 1000);
});
