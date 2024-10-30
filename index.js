function toggleDropdown() {
    const dropdown = document.getElementById("loginDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.login-btn')) {
        const dropdown = document.getElementById("loginDropdown");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    }
}

// Add this to your index.js
document.addEventListener('DOMContentLoaded', function() {
    // Close dropdown when scrolling on mobile
    window.addEventListener('scroll', function() {
        const dropdown = document.getElementById("loginDropdown");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    });

    // Close dropdown when clicking anywhere on mobile
    document.addEventListener('touchstart', function(event) {
        const dropdown = document.getElementById("loginDropdown");
        if (!event.target.matches('.login-btn') && dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    });
});