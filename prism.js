document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = {
        Giacomo: {
            password: 'g!AcoMo.aDmIn.pWd#24',
            permissions: ['admin']
        },
        Tommy: {
            password: 'tOmMy.mAtH.oP.pWd#57',
            permissions: ['matematica_op']
        },
        Kolya: {
            password: 'kOlYa.mAtH.mC.oP.pWd#89',
            permissions: ['matematica_op', 'mc_op']
        },
        Albion: {
            password: 'aLbIoN.mC.oP.pWd#13',
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
