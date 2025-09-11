async function onTurnstileSuccess(token) {
    try {
        const response = await fetch('/turnstile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
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
            alert('Verification failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during verification:', error);
        alert('An error occurred during verification. Please try again.');
    }
}

function checkTurnstileVerification() {
    if (localStorage.getItem('turnstile-verified') === 'true') {
        const turnstileContainer = document.querySelector('.turnstile-container');
        if (turnstileContainer) {
            turnstileContainer.style.display = 'none';
        }
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

// Wait for the DOM to be fully loaded before checking the verification status
document.addEventListener('DOMContentLoaded', checkTurnstileVerification);
