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

// Login Form Validation and Redirection
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
    
    // Email and password validations
    const isEmailValid = /\S+@\S+\.\S+/.test(email.value);
    if (!isEmailValid) email.classList.add("is-invalid");
    else email.classList.remove("is-invalid");

    if (!password.value) password.classList.add("is-invalid");
    else password.classList.remove("is-invalid");

    if (isEmailValid && password.value) {
        // Redirect to dashboard on successful login
        alert("Logged in successfully!");
        window.location.href = "donor-dash.html";
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
