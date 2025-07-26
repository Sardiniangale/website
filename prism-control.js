document.addEventListener('DOMContentLoaded', () => {
    // check for authentication
    if (localStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'prism.html';
        return; // stop executing the script
    }

    const user = JSON.parse(localStorage.getItem('user'));

    const permissionText = document.getElementById('permissionText');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // set permission text
    permissionText.textContent = `Perms: ${user.permissions.join(', ')}`;

    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // prevent the default anchor tag behavior
        // in a real application, you would have a more secure logout process
        // for now, we'll just redirect to the login page
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        window.location.href = 'prism.html';
    });

    // Sidebar functionality
    sidebar.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && event.target.hasAttribute('data-section')) {
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
    const minecraftSection = document.getElementById('minecraft-section');
    if (!user.permissions.includes('admin') && !user.permissions.includes('mc_op')) {
        minecraftSection.style.display = 'none';
    }

    // Mathematica controls
    const mathematicaSection = document.getElementById('mathematica-section');
    if (!user.permissions.includes('admin') && !user.permissions.includes('matematica_op')) {
        mathematicaSection.style.display = 'none';
    }

    // Initial section to show
    if (user.permissions.includes('admin') || user.permissions.includes('mc_op')) {
        showSection('minecraft-section');
    } else if (user.permissions.includes('matematica_op')) {
        showSection('mathematica-section');
    }
});
