// donor_login.js

// Function to show the login modal
function showLogin() {
    const modal = new bootstrap.Modal(document.getElementById('donorModal'));
    modal.show();
}

// Toggle password visibility
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Helper function to check if the password meets the requirements
function validatePassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUppercase && hasNumber && hasSpecialChar;
}

// Login Form Validation and Handling
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Validate email and password
    if (!email || !password) {
        alert("Email and password are required.");
        return;
    }

    // Send login request to the backend
    fetch('http://localhost:3000/auth/donor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Login failed: " + response.statusText);
        }
        return response.text();
    })
    .then(message => {
        alert(message);
        window.location.href = "donor-dash.html"; // Redirect to donor dashboard
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
});

// Registration Form Handling
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const full_name = document.getElementById("regFullName").value;
    const gender = document.getElementById("regGender").value;
    const age = document.getElementById("regAge").value;
    const blood_group = document.getElementById("regBloodGroup").value;
    const address = document.getElementById("regAddress").value;
    const contact_number = document.getElementById("regContact").value;

    // Validate all required fields
    if (!email || !password || !full_name || !gender || !age || !blood_group || !address || !contact_number) {
        alert("All fields are required.");
        return;
    }

    // Send registration request to the backend
    fetch('http://localhost:3000/auth/donor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, gender, age, blood_group, address, contact_number })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Registration failed: " + response.statusText);
        }
        return response.text();
    })
    .then(message => {
        alert(message);
        window.location.href = "donor-dash.html"; // Redirect to donor dashboard
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
});

// Real-time Password Feedback Display for Registration
document.getElementById("regPassword").addEventListener("input", function() {
    const isValid = validatePassword(this.value);
    const feedback = this.nextElementSibling;
    if (isValid) {
        this.classList.remove("is-invalid");
        feedback.style.display = "none";
    } else {
        this.classList.add("is-invalid");
        feedback.style.display = "block";
        feedback.innerText = "Password must be at least 8 characters, contain an uppercase letter, a number, and a special character.";
    }
});

// Real-time Registration Form Validation
document.getElementById("registerForm").addEventListener("input", function(event) {
    const input = event.target;
    if (!input.value) {
        input.classList.add("is-invalid");
    } else {
        input.classList.remove("is-invalid");
    }
});

// Registration Form Validation on Submit
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let valid = true;

    // Check all inputs
    document.querySelectorAll("#registerForm .form-control").forEach(input => {
        if (!input.value) {
            input.classList.add("is-invalid");
            valid = false;
        } else {
            input.classList.remove("is-invalid");
        }
    });

    // Age Validation
    const age = document.getElementById("regAge");
    if (age.value < 18) {
        age.classList.add("is-invalid");
        valid = false;
    } else {
        age.classList.remove("is-invalid");
    }

    // Contact Number Validation
    const contactNumber = document.getElementById("regContact");
    if (!/^\d{10}$/.test(contactNumber.value)) {
        contactNumber.classList.add("is-invalid");
        valid = false;
    } else {
        contactNumber.classList.remove("is-invalid");
    }

    // Email Validation
    const email = document.getElementById("regEmail");
    const isEmailValid = /\S+@\S+\.\S+/.test(email.value);
    if (!isEmailValid) {
        email.classList.add("is-invalid");
        valid = false;
    } else {
        email.classList.remove("is-invalid");
    }

    // Password and Confirm Password Validation
    const password = document.getElementById("regPassword");
    const confirmPassword = document.getElementById("regConfirmPassword");
    const isPasswordValid = validatePassword(password.value);
    if (!isPasswordValid) {
        password.classList.add("is-invalid");
        valid = false;
    } else {
        password.classList.remove("is-invalid");
    }

    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add("is-invalid");
        valid = false;
    } else {
        confirmPassword.classList.remove("is-invalid");
    }

    // Submit if all validations pass
    if (valid) {
        alert("Registration successful!");
        // Optional: Redirect to login page or dashboard
        window.location.href = "donor-dash.html";
    }
});
