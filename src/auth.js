// auth.js

document.addEventListener('DOMContentLoaded', () => {
    // initialize google auth
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: document.querySelector('meta[name="google-signin-client_id"]').content
        }).then(() => {
            document.getElementById('customGoogleButton').addEventListener('click', () => {
                gapi.auth2.getAuthInstance().signIn();
            });
        });
    });
});

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;

  // send the token to the cloudflare worker for verification
  fetch('/functions/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: id_token }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
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