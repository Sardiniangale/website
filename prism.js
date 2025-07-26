document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // In a real application, you would fetch these from a secure backend
    const users = {
        Giacomo: {
            password: process.env.GIACOMO_PASSWORD,
            permissions: ['admin']
        },
        Tommy: {
            password: process.env.TOMMY_PASSWORD,
            permissions: ['matematica_op']
        },
        Kolya: {
            password: process.env.KOLYA_PASSWORD,
            permissions: ['matematica_op', 'mc_op']
        },
        Albion: {
            password: process.env.ALBION_PASSWORD,
            permissions: ['mc_op']
        }
    };

    const user = users[username];

    if (user && user.password === password) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ username, permissions: user.permissions }));
        window.location.href = 'control.html';
    } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        alert('Incorrect username or password');
    }
});
