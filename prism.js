document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // --- Temporary login logic for testing ---
    // In a real application, this would be an API call to your backend
    // to exchange credentials for a secure JWT.

    if (username === 'admin' && password === 'password123') {
        // On successful login, store a dummy token and redirect to the control center
        // In a real app, the token would come from the server.
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = 'control.html';
    } else {
        // For any other user, redirect to the public status page.
        // In a real app, the server would determine access levels.
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'status.html';
    }
});

// Simple check on the control page to redirect if not authenticated
if (window.location.pathname.endsWith('control.html')) {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'prism.html';
    }
}
