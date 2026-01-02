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
            localStorage.setItem('turnstile-verified', 'true');
            document.body.classList.remove('turnstile-active');
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
        document.body.classList.remove('turnstile-active');
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
    } else {
        document.body.classList.add('turnstile-active');
        const turnstileContainer = document.querySelector('.turnstile-container');
        if (turnstileContainer) {
            turnstileContainer.style.display = 'flex';
        }
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.display = 'none';
        });
    }
}

// Wait for the DOM to be fully loaded before checking the verification status
document.addEventListener('DOMContentLoaded', checkTurnstileVerification);