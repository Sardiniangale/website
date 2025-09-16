document.addEventListener('DOMContentLoaded', () => {
    const loginError = sessionStorage.getItem('loginError');
    if (loginError) {
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.marginBottom = '15px';
        errorDiv.textContent = `Authentication Error: ${loginError}`;
        const container = document.querySelector('.container');
        container.insertBefore(errorDiv, container.firstChild);
        sessionStorage.removeItem('loginError');
    }

    const magic = new Magic('pk_live_B7A8FE1826EFD9F9');
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value;
        if (email) {
            try {
                const didToken = await magic.auth.loginWithMagicLink({ email });
                const response = await fetch('/magic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ didToken }),
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = 'control.html';
                } else {
                    alert('You are not authorized to access this page.');
                }
            } catch (error) {
                console.error('Magic link login failed:', error);
                alert('Login failed. Please try again.');
            }
        }
    });
});