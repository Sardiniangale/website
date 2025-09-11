/*
this script is used to handle the cloudflare turnstile callback.
when the turnstile is successfully verified, the main content is displayed.
*/

function onTurnstileSuccess() {
    // set item in local storage
    localStorage.setItem('turnstile-verified', 'true');
    // hide the turnstile container
    document.querySelector('.turnstile-container').style.display = 'none';
    // show the main content
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        if (container.classList.contains('flex-container')) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'block';
        }
    });
}

function checkTurnstileVerification() {
    if (localStorage.getItem('turnstile-verified') === 'true') {
        onTurnstileSuccess();
    }
}

checkTurnstileVerification();