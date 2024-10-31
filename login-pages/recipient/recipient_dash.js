// recipient_dash.js

function logout() {
    alert("Logging out...");
    // Add your logout functionality here
    window.location.href = 'recipient_login.html'; // Adjust the path as needed
}

function openRequestForm() {
    document.getElementById('requestForm').style.display = 'block';
}

function closeRequestForm() {
    document.getElementById('requestForm').style.display = 'none';
}

function openTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}
