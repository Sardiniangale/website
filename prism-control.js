document.addEventListener('DOMContentLoaded', () => {
    // Demo users
    const users = {
        admin: { permissionLevel: 'Admin' },
        mcop: { permissionLevel: 'MC op' },
        mathop: { permissionLevel: 'Math op' },
        supervisor: { permissionLevel: 'Supervisor' }
    };

    // For demo purposes, we'll just pick a user.
    // In a real application, you would have a login system.
    const user = users.admin;

    const permissionText = document.getElementById('permissionText');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Set permission text
    permissionText.textContent = `Perms: ${user.permissionLevel}`;

    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', () => {
        // In a real application, you would have a more secure logout process.
        // For now, we'll just redirect to the login page.
        window.location.href = 'prism.html';
    });

    // Sidebar functionality
    sidebar.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            const section = event.target.getAttribute('data-section');
            showSection(section);
        }
    });

    function showSection(section) {
        // Hide all sections
        const sections = mainContent.querySelectorAll('.content-section');
        sections.forEach(s => s.style.display = 'none');

        // Show the selected section
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }

    // Minecraft controls
    const startServerBtn = document.getElementById('start-server');
    const stopServerBtn = document.getElementById('stop-server');
    const addWhitelistBtn = document.getElementById('add-whitelist');
    const whitelistUsernameInput = document.getElementById('whitelist-username');
    const whitelistUsersList = document.getElementById('whitelist-users');

    startServerBtn.addEventListener('click', () => {
        // Add start server logic here
        console.log('Starting server...');
    });

    stopServerBtn.addEventListener('click', () => {
        // Add stop server logic here
        console.log('Stopping server...');
    });

    addWhitelistBtn.addEventListener('click', () => {
        const username = whitelistUsernameInput.value.trim();
        if (username) {
            const li = document.createElement('li');
            li.textContent = username;
            whitelistUsersList.appendChild(li);
            whitelistUsernameInput.value = '';
        }
    });

    // Mathematica controls
    const startTtyBtn = document.getElementById('start-tty');
    const mathConnectionStatus = document.getElementById('math-connection-status');
    const mathActiveUsers = document.getElementById('math-active-users');
    const mathematicaTty = document.getElementById('mathematica-tty');

    startTtyBtn.addEventListener('click', () => {
        // Add start TTY logic here
        console.log('Starting TTY...');
        mathConnectionStatus.textContent = 'Connecting...';
        // Simulate connection
        setTimeout(() => {
            mathConnectionStatus.textContent = 'Connected';
            mathActiveUsers.textContent = '1';
            mathematicaTty.innerHTML = '<div id="tty-output"></div><input type="text" id="tty-input" placeholder="Enter command...">';
            const ttyInput = document.getElementById('tty-input');
            const ttyOutput = document.getElementById('tty-output');
            ttyInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    const command = ttyInput.value;
                    ttyInput.value = '';
                    // Simulate sending command and receiving response
                    ttyOutput.innerHTML += `<p>&gt; ${command}</p>`;
                    setTimeout(() => {
                        ttyOutput.innerHTML += `<p>Response to ${command}</p>`;
                    }, 1000);
                }
            });
        }, 2000);
    });

    // Initial section to show
    showSection('minecraft-section');
});
