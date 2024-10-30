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

