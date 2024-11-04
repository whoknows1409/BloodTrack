function showLogin() {
    const modal = new bootstrap.Modal(document.getElementById('recipientModal'));
    modal.show();
}

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

// Real-time Password Feedback Display
document.getElementById("regPassword").addEventListener("input", function () {
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

document.getElementById("loginForm").addEventListener("submit", function (event) {
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
        // Send login request to server
        fetch('http://localhost:3000/auth/recipient/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        })
        .then(response => {
            if (!response.ok) throw new Error('Login failed. Please check your credentials.');
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            console.log(data); // Log the response for debugging
            alert(data.message || "Login successful"); // Notify user
            if (data.success) {
                sessionStorage.setItem('recipientId', data.recipientId); // Store recipientId in sessionStorage
                console.log("Recipient ID stored in session:", data.recipientId); // Log stored ID
                window.location.href = "recipient_dash.html"; // Redirect to recipient dashboard
            }
        })
        .catch(error => {
            alert(error.message);
        });
    }
});

// Registration Form Validation
document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("regEmail");
    const password = document.getElementById("regPassword");
    const confirmPassword = document.getElementById("regConfirmPassword");
    const full_name = document.getElementById("regFullName");
    const gender = document.getElementById("regGender");
    const age = document.getElementById("regAge");
    const blood_group = document.getElementById("regBloodGroup");
    const address = document.getElementById("regAddress");
    const contactNumber = document.getElementById("regContact");

    // Validate all fields
    const isFormValid = [
        email.value, password.value, confirmPassword.value, full_name.value, 
        gender.value, age.value, blood_group.value, address.value, contactNumber.value
    ].every(field => field);

    if (!isFormValid) {
        alert("Please fill out all fields.");
        return;
    }

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    // Send registration request to server
    fetch('http://localhost:3000/auth/recipient/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            full_name: full_name.value,
            gender: gender.value,
            age: age.value,
            blood_group: blood_group.value,
            address: address.value,
            contact_number: contactNumber.value,
        }),
    })
    .then(response => {
        if (!response.ok) throw new Error('Registration failed. Please try again.');
        return response.text();
    })
    .then(data => {
        alert(data);  // Display success message
        if (data.success) {
            sessionStorage.setItem('recipientId', data.recipientIdId);
        window.location.href = "recipient_dash.html";  // Redirect to recipient dashboard
        }
    })
    .catch(error => {
        alert(error.message);  // Display error message
    });
});
