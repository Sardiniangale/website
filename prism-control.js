document.addEventListener('DOMContentLoaded', () => {
    const user = { permissionLevel: 'Admin' }; // Demo user

    const permissionIcon = document.getElementById('permissionIcon');
    const permissionText = document.getElementById('permissionText');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Set permission icon and text
    permissionText.textContent = user.permissionLevel;

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
            mathematicaTty.innerHTML = '<textarea id="tty-input" rows="10" cols="50"></textarea><button id="send-tty">Send</button>';
        }, 2000);
    });

    // Initial section to show
    showSection('minecraft-section');
});
