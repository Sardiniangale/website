document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'test' && password === 'test') {
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = 'control.html';
    } else {
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'status.html';
    }
});
