document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // This is where you would make the API call to your backend.
    // The backend would be running on your local server and connected via Cloudflare Tunnel.
    // For now, we'll just log the credentials to the console.
    console.log('Username:', username);
    console.log('Password:', password);

    // Example of how you would fetch a token from your backend:
    /*
    try {
        const response = await fetch('https://prism-api.yourdomain.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('jwt', token);
            // Redirect to a protected dashboard page
            // window.location.href = '/dashboard.html'; 
        } else {
            // Handle login failure
            alert('Login failed!');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
    */
});