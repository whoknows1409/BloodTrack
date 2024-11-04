// hospital_dash.js
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const newRequestBtn = document.getElementById('newRequestBtn');
    const modal = document.getElementById('requestModal');
    const requestForm = document.getElementById('requestForm');

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        // Implement logout logic here
        alert('Logging out...');
        window.location.href="hospital_login.html";
    });

    // Open modal
    newRequestBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bloodType = document.getElementById('bloodType').value;
        const units = document.getElementById('units').value;
        const purpose = document.getElementById('purpose').value;

        // Here you would typically send this data to your server
        console.log('New request:', { bloodType, units, purpose }); // Replace with server-side API call
        modal.style.display = 'none';
    });
});