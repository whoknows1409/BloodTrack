// admin_dash.js

function logout() {
    alert("Logging out...");
    window.location.href="admin_login.html"
    // Implement logout functionality
}

function openTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}

function approveDonationRequest(element) {
    // Logic to approve donation and add units to stock
    alert("Donation request approved.");
    // Update stock and status
}

function rejectDonationRequest(element) {
    // Logic to reject donation
    alert("Donation request rejected.");
}

function approveBloodRequest(element) {
    // Logic to approve blood request and reduce units from stock
    alert("Blood request approved.");
    // Update stock and status
}

function rejectBloodRequest(element) {
    // Logic to reject blood request
    alert("Blood request rejected.");
}

function openUpdateModal() {
    document.getElementById('updateModal').style.display = 'block';
}

function closeUpdateModal() {
    document.getElementById('updateModal').style.display = 'none';
}
