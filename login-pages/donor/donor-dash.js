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
  
  // New functions for handling form submissions and success messages
  function showSuccessMessage(message) {
    const successElement = document.getElementById('successMessage');
    successElement.querySelector('.message-text').textContent = message;
    successElement.style.display = 'flex';
    
    // Automatically hide the message after 5 seconds
    setTimeout(() => {
      closeMessage();
    }, 5000);
  }
  
  function closeMessage() {
    document.getElementById('successMessage').style.display = 'none';
  }
  
  function submitDonation(event) {
    event.preventDefault();
    
    // Get form data
    const form = document.getElementById('bloodDonationForm');
    const formData = new FormData(form);
    
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful submission
    
    // Show success message
    showSuccessMessage('Blood donation request submitted successfully!');
    
    // Clear form and close modal
    form.reset();
    closeForm();
    
    // Optionally, refresh the donation history table
    // You would typically do this after getting a response from your backend
    refreshDonationHistory();
  }
  
  function submitRequest(event) {
    event.preventDefault();
    
    // Get form data
    const form = document.getElementById('bloodRequestForm');
    const formData = new FormData(form);
    
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful submission
    
    // Show success message
    showSuccessMessage('Blood request submitted successfully!');
    
    // Clear form and close modal
    form.reset();
    closeForm();
    
    // Optionally, refresh the request history table
    // You would typically do this after getting a response from your backend
    refreshRequestHistory();
  }
  
  function refreshDonationHistory() {
    // Function to refresh the donation history table
    // You would typically fetch updated data from your backend here
    console.log('Refreshing donation history...');
  }
  
  function refreshRequestHistory() {
    // Function to refresh the request history table
    // You would typically fetch updated data from your backend here
    console.log('Refreshing request history...');
  }
  
  function logout() {
    alert("Logging out...");
    window.location.href = 'donor_login.html';
  }