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

// Password validation function
function validatePassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUppercase && hasNumber && hasSpecialChar;
}

// Login Form Validation
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("adminEmail");
    const password = document.getElementById("loginPassword");

    // Check if email and password are valid
    let valid = true;

    const isEmailValid = /\S+@\S+\.\S+/.test(email.value);
    if (!isEmailValid) {
        email.classList.add("is-invalid");
        valid = false;
    } else {
        email.classList.remove("is-invalid");
    }

    const isPasswordValid = validatePassword(password.value);
    if (!isPasswordValid) {
        password.classList.add("is-invalid");
        valid = false;
    } else {
        password.classList.remove("is-invalid");
    }

    if (valid) {
        alert("Logged in successfully!");
        window.location.href="admin_dash.html"
    }
});
