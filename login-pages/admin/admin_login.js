// Show the login modal on load
document.addEventListener("DOMContentLoaded", function () {
    const modal = new bootstrap.Modal(document.getElementById('adminModal'));
    modal.show();
});

// Toggle password visibility
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Login Form Submission with Backend Check
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Validate email format
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    if (!isEmailValid) {
        alert("Please enter a valid email.");
        return;
    }

    // Send login request to backend
    fetch('http://localhost:3000/auth/admin/login', { // Adjusted the endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        // Log the entire response for debugging
        console.log('Response:', response);
        return response.text(); // Get the response as text
    })
    .then(data => {
        console.log('Response Data:', data); // Log the raw response data
        if (data === "Login successful") { // Check for direct response string
            alert("Logged in successfully!");
            window.location.href = "admin_dash.html";
        } else {
            alert("Invalid email or password. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Invalid email or password. Please try again.");
    });
});
