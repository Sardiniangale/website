
// auth.js

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('customGoogleButton').addEventListener('click', () => {
        gapi.auth2.getAuthInstance().signIn();
    });
});

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;

  // send the token to the cloudflare worker for verification
  fetch('/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: id_token }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // store the session token in local storage
      localStorage.setItem('session_token', data.token);
      // redirect to the control panel
      window.location.href = 'control.html';
    } else {
      // sign the user out
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(() => {
        alert('you are not authorized to access this page.');
      });
    }
  });
}
