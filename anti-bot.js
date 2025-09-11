/*
this script is used to handle the cloudflare turnstile callback.
when the turnstile is successfully verified, the main content is displayed.
*/

async function onTurnstileSuccess(token) {
    try {
        const response = await fetch(`/functions/turnstile?token=${token}`);
        const data = await response.json();
        console.log('Turnstile verification response:', data); // Log the response
        if (data.success) {
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
        } else {
            // Check for specific error codes from the backend
            if (data.error) {
                alert(`Verification failed: ${data.error}. Details: ${data.details || 'N/A'}`);
            } else if (data['error-codes'] && data['error-codes'].length > 0) {
                alert(`Verification failed with error: ${data['error-codes'][0]}`);
            }
            else {
                alert('Verification failed. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error during verification:', error);
        alert('An error occurred during verification. Please try again.');
    }
}

function checkTurnstileVerification() {
    if (localStorage.getItem('turnstile-verified') === 'true') {
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
}

checkTurnstileVerification();

function renderTurnstile() {
    if (typeof turnstile !== 'undefined') {
        turnstile.render('#turnstile-widget', {
            sitekey: '0x4AAAAAABjjUJDmc_m8M2IQ',
            callback: onTurnstileSuccess,
        });
    }
}