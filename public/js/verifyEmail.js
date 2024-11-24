/* eslint-disable */
// Frontend: Email verification page
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('authToken'); // Retrieve the token from the URL

  if (token) {
    const response = await fetch(`/api/v1/users/verify-email/${token}`, {
      method: 'PATCH',
    });
    const data = await response.json();

    if (data.status === 'success') {
      alert('Your account has been successfully activated!');
      window.location.assign('/'); // Or redirect to the main page
    } else {
      alert('Invalid or expired token.');
    }
  } else {
    alert('No token provided.');
  }
});
