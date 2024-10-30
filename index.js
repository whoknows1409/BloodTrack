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

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute("data-target");
            const current = +counter.innerText;
            const increment = target / 200;  // Adjust this value to control speed

            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCount, 5);  // Update every 10ms
            } else {
                counter.innerText = target.toLocaleString() + "+";  // Add "+" after reaching target
            }
        };
        
        updateCount();
    });
});
