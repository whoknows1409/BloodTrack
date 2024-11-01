// script.js

function openForm(formType) {
    document.getElementById(formType + 'Form').style.display = 'block';
  }
  
  function closeForm() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
  }
  
  async function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="openTab('${tabName}')"]`).classList.add('active');
  
    const donorId = sessionStorage.getItem('donorId'); // Ensure donorId is stored upon login
    
    if (tabName === 'donationHistory') {
      const donations = await fetchData(`/donor/donation-history/${donorId}`);
      updateDonationHistoryTable(donations);
    } else if (tabName === 'requestHistory') {
      const requests = await fetchData(`/donor/request-history/${donorId}`);
      updateRequestHistoryTable(requests);
    }
  }
  
// Helper function to fetch data
async function fetchData(url) {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      console.error('Error fetching data:', response.statusText);
    }
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
  
  // Update table functions
function updateDonationHistoryTable(donations) {
    const table = document.querySelector('#donationHistory table');
    table.innerHTML = `<tr><th>Donation Date</th><th>Blood Type</th><th>Location</th><th>Status</th><th>Response Date</th><th>Comments</th></tr>`;
    donations.forEach(donation => {
      const row = `<tr>
        <td>${donation.donation_date}</td>
        <td>${donation.blood_type}</td>
        <td>${donation.location}</td>
        <td class="status ${donation.status.toLowerCase()}">${donation.status}</td>
        <td>${donation.response_date || '-'}</td>
        <td>${donation.comments || '-'}</td>
      </tr>`;
      table.innerHTML += row;
    });
  }
  
  function updateRequestHistoryTable(requests) {
    const table = document.querySelector('#requestHistory table');
    table.innerHTML = `<tr><th>Request Date</th><th>Blood Type & Units</th><th>Purpose</th><th>Location</th><th>Status</th><th>Response Date</th><th>Comments</th></tr>`;
    requests.forEach(request => {
      const row = `<tr>
        <td>${request.request_date}</td>
        <td>${request.blood_type} (${request.units} units)</td>
        <td>${request.purpose}</td>
        <td>${request.location}</td>
        <td class="status ${request.status.toLowerCase()}">${request.status}</td>
        <td>${request.response_date || '-'}</td>
        <td>${request.comments || '-'}</td>
      </tr>`;
      table.innerHTML += row;
    });
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