/*
this script is used to handle the cloudflare turnstile callback.
when the turnstile is successfully verified, the login form is displayed.
*/

function onTurnstileSuccess() {
    // hide the turnstile container
    document.querySelector('.turnstile-container').style.display = 'none';
    // show the login form
    document.querySelector('.container').style.display = 'block';
}