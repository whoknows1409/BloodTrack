// script.js

function openForm(formType) {
    document.getElementById(formType + 'Form').style.display = 'block';
  }
  
  function closeForm() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
  }
  
  function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="openTab('${tabName}')"]`).classList.add('active');
  }
  
  function logout() {
    alert("Logging out...");
    // Clear user data (if any) - adjust as needed for your application
    //localStorage.removeItem('user'); // Example for removing user data
    // Redirect to login page
    window.location.href = 'donor_login.html'; // Adjust the path as needed
}