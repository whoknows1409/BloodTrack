// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
}

// Check Password Requirements
function validatePassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUppercase && hasNumber && hasSpecialChar;
}

// Display Password Requirements Feedback
function displayPasswordFeedback(inputId, isValid) {
    const input = document.getElementById(inputId);
    const feedback = input.nextElementSibling;
    if (isValid) {
        input.classList.remove("is-invalid");
        feedback.style.display = "none";
    } else {
        input.classList.add("is-invalid");
        feedback.style.display = "block";
        feedback.innerText = "Password must be at least 8 characters, contain an uppercase letter, a number, and a special character.";
    }
}

// Form Validation
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById("clanalystEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate password is filled
    if (password === "") {
        alert("Please enter your password.");
        return;
    }

    // Proceed with login
    alert("Login successful!");
    window.location.href="hospital_dash.html";
    // Add further login logic here (e.g., server authentication)
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const hospitalName = document.getElementById("hospitalName").value;
    const address = document.getElementById("hospitalAddress").value;
    const contactNumber = document.getElementById("hospitalContact").value;
    const analystName = document.getElementById("clanalystName").value;
    const email = document.getElementById("clanalystEmailReg").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    // Required field validations
    if (!hospitalName || !address || !contactNumber || !analystName || !email || !password || !confirmPassword) {
        alert("All fields are required.");
        return;
    }

    // Validate contact number format
    if (!/^\d{10}$/.test(contactNumber)) {
        alert("Contact number must be 10 digits.");
        return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate password requirements
    const isPasswordValid = validatePassword(password);
    displayPasswordFeedback("regPassword", isPasswordValid);
    if (!isPasswordValid) return;

    // Confirm password match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Proceed with registration
    alert("Registration successful!");
    window.location.href="hospital_dash.html";
    // Add further registration logic here (e.g., saving data to the server)
});

// Validate password in real-time
document.getElementById("regPassword").addEventListener("input", function() {
    const isValid = validatePassword(this.value);
    displayPasswordFeedback("regPassword", isValid);
});

// Toggle Tabs
document.addEventListener("DOMContentLoaded", function() {
    const modal = new bootstrap.Modal(document.getElementById('hospitalModal'));
    modal.show();
});
