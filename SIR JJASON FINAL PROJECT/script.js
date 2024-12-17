let users = [];
let lastHighlightedRow = null;
let editingUserId = null;

// Load users from localStorage on page load
window.onload = function() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
        renderTable();
        updateStats();
    }
};

// Add a new user
function addUser() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const role = document.getElementById('role').value;
    const status = document.getElementById('status').value;

    // Validate inputs
    if (!name || !email || !phone) {
        alert('Please fill in all fields.');
        return;
    }
    if (!validateEmail(email)) {
        alert('Please enter a valid email.');
        return;
    }
    if (!validatePhone(phone)) {
        alert('Phone number should contain numbers only.');
        return;
    }

    const newUser = { id: Date.now(), name, email, phone, role, status };
    users.unshift(newUser);
    saveUsersToLocalStorage();
    renderTable();
    clearForm();
    updateStats();
}

// Highlight the most recent row
function highlightNewRow() {
    const table = document.getElementById('userTable');
    const rows = table.getElementsByTagName('tr');

    if (rows.length > 0) {
        const firstRow = rows[0];
        firstRow.style.backgroundColor = 'rgb(99, 228, 138)'; 
        lastHighlightedRow = firstRow;
    }
}

// Render the user table based on search and filter inputs
function renderTable() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;

    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = '';

    users
        .filter(user => {
            return (
                (user.name.toLowerCase().includes(searchInput) || !searchInput) &&
                (user.role === roleFilter || !roleFilter)
            );
        })
        .forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>
                    <button class="action-btn edit" onclick="editUser(${user.id})">Edit</button>
                    <button class="action-btn delete" onclick="deleteUser(${user.id})">Delete</button>
                    ${user.status === 'Inactive'
                        ? `<button class="action-btn activate" onclick="changeStatus(${user.id}, 'Active')">Activate</button>`
                        : `<button class="action-btn deactivate" onclick="changeStatus(${user.id}, 'Inactive')">Deactivate</button>`}
                </td>
            `;
            tableBody.appendChild(row);
        });

    highlightNewRow();
}

// Edit user details
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    // Populate the form with the user’s data
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    document.getElementById('role').value = user.role;
    document.getElementById('status').value = user.status;

    editingUserId = id;
    document.getElementById('addButton').textContent = 'Save Changes';
}

// Add a new user or save changes to an existing user
function addOrEditUser() {
    if (editingUserId) {
        // Save changes to existing user
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const role = document.getElementById('role').value;
        const status = document.getElementById('status').value;

        if (!name || !email || !phone) {
            alert('Please fill in all fields.');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email.');
            return;
        }
        if (!validatePhone(phone)) {
            alert('Phone number should contain numbers only.');
            return;
        }

        const user = users.find(u => u.id === editingUserId);
        if (user) {
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.role = role;
            user.status = status;
        }

        editingUserId = null;
        document.getElementById('addButton').textContent = 'Add User';
    } else {
        addUser(); // Add new user
    }

    saveUsersToLocalStorage();
    renderTable();
    updateStats();
    clearForm();
}

// Delete a user from the list
function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    saveUsersToLocalStorage();
    renderTable();
    updateStats();
}

// Change a user's status (Active/Inactive)
function changeStatus(id, newStatus) {
    const user = users.find(user => user.id === id);
    if (user) {
        user.status = newStatus;
        saveUsersToLocalStorage();
        renderTable();
        updateStats();
    }
}

// Update the statistics of total, active, and inactive users
function updateStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    const inactiveUsers = totalUsers - activeUsers;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('inactiveUsers').textContent = inactiveUsers;
}

// Validate email format
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Validate phone number format
function validatePhone(phone) {
    const phonePattern = /^[0-9]+$/;
    return phonePattern.test(phone);
}

// Clear the form fields
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('role').value = 'Admin';
    document.getElementById('status').value = 'Active';

    editingUserId = null;
    document.getElementById('addButton').textContent = 'Add User';
}

// Save users to localStorage
function saveUsersToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Event listeners for search, role filter, and adding/editing users
document.getElementById('search').addEventListener('input', renderTable);
document.getElementById('roleFilter').addEventListener('change', renderTable);
document.getElementById('addButton').addEventListener('click', addOrEditUser);
