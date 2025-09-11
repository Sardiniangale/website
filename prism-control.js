document.addEventListener('DOMContentLoaded', () => {
    // fetch user data from a protected endpoint
    fetch('/functions/api/user')
    .then(response => {
        if (!response.ok) {
            throw new Error('Not authenticated');
        }
        return response.json();
    })
    .then(user => {
        const permissionText = document.getElementById('permissionText');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const userManagementLink = document.getElementById('user-management-link');
        const userManagementSection = document.getElementById('user-management-section');

        // set permission text
        permissionText.textContent = `Perms: ${user.permissions.join(', ')}`;

        // show user management link if admin
        if (user.permissions.includes('admin')) {
            userManagementLink.style.display = 'block';
        }

        const logoutButton = document.getElementById('logoutButton');

        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            // clear the session cookie by setting its expiration to a past date
            document.cookie = "__session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

        // User management functionality
        if (user.permissions.includes('admin')) {
            const addUserForm = document.getElementById('addUserForm');
            const newUserEmail = document.getElementById('newUserEmail');
            const newUserPermissions = document.getElementById('newUserPermissions');
            const userList = document.getElementById('userList');

            // list users
            const listUsers = () => {
                fetch('/functions/api/users')
                .then(response => response.json())
                .then(users => {
                    userList.innerHTML = '';
                    users.forEach(user => {
                        const li = document.createElement('li');
                        li.textContent = user.name;
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Remove';
                        deleteButton.addEventListener('click', () => {
                            fetch('/functions/api/users', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ email: user.name })
                            })
                            .then(() => listUsers());
                        });
                        li.appendChild(deleteButton);
                        userList.appendChild(li);
                    });
                });
            };

            listUsers();

            // add user
            addUserForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const permissions = Array.from(newUserPermissions.selectedOptions).map(option => option.value);
                fetch('/functions/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: newUserEmail.value, permissions })
                })
                .then(() => {
                    newUserEmail.value = '';
                    newUserPermissions.selectedIndex = -1;
                    listUsers();
                });
            });
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
        if (.permissions.includes('admin') || user.permissions.includes('mc_op')) {
            showSection('minecraft-section');
        } else if (user.permissions.includes('matematica_op')) {
            showSection('mathematica-section');
        }
    })
    .catch(() => {
        window.location.href = 'prism.html';
    });
});