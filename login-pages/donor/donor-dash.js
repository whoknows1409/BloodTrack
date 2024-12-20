// donor-dash.js

async function fetchDonorDetails() {
  const donorId = sessionStorage.getItem('donorId');
  try {
      const response = await fetch(`http://localhost:3000/donor/details/${donorId}`);
      if (!response.ok) throw new Error('Failed to fetch donor details');
      return await response.json();
  } catch (error) {
      console.error('Error fetching donor details:', error);
      return null;
  }
}

async function openForm(formType) {
  if (formType === 'donation') {
      const donorId = sessionStorage.getItem('donorId');
      try {
          const response = await fetch(`http://localhost:3000/donor/details/${donorId}`);
          const { success, data } = await response.json();
          
          if (success) {
              document.getElementById('bloodType').value = data.blood_group;
          } else {
              throw new Error('Failed to fetch donor details');
          }
      } catch (error) {
          console.error('Error fetching donor details:', error);
          showErrorMessage('Failed to load donor information. Please try again.');
          return;
      }
  }
  
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

  const donorId = sessionStorage.getItem('donorId');

  
    const donations = await fetchData(`http://localhost:3000/donor/donation-history/${donorId}`);
    if (donations) updateDonationHistoryTable(donations);
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    showErrorMessage('Failed to fetch data. Please try again later.');
    return null;
  }
}

function showSuccessMessage(message) {
  const successElement = document.getElementById('successMessage');
  successElement.querySelector('.message-text').textContent = message;
  successElement.style.display = 'flex';

  setTimeout(() => {
    closeMessage();
  }, 5000);
}

function showErrorMessage(message) {
  const errorElement = document.getElementById('errorMessage') || createErrorMessage();
  errorElement.querySelector('.message-text').textContent = message;
  errorElement.style.display = 'flex';

  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
}

function createErrorMessage() {
  const div = document.createElement('div');
  div.id = 'errorMessage';
  div.innerHTML = `
    <div class="message-text"></div>
    <button onclick="this.parentElement.style.display='none'">×</button>
  `;
  div.style.cssText = 'display:none; background-color:#ffebee; padding:1rem; margin:1rem; border-radius:4px;';
  document.body.appendChild(div);
  return div;
}

function closeMessage() {
  document.getElementById('successMessage').style.display = 'none';
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) errorMessage.style.display = 'none';
}

// Update the submit donation function
async function submitDonation(event) {
  event.preventDefault();

  const form = document.getElementById('bloodDonationForm');
  const donorId = sessionStorage.getItem('donorId');

  // Create the request body matching the database schema
  const requestBody = {
      donorId: donorId,
      donationData: {
          donor_id: donorId,
          donation_date: form.donationDate.value,
          blood_type: form.bloodType.value, // This will now be the donor's original blood type
          location: form.location.value,
          status: 'Pending'
      }
  };

  console.log('Submitting donation data:', requestBody);

  try {
      const response = await fetch('http://localhost:3000/donor/add-donation', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
          showSuccessMessage('Blood donation request submitted successfully!');
          form.reset();
          closeForm();
          await refreshDonationHistory();
      } else {
          showErrorMessage(data.message || 'Failed to submit donation request');
      }
  } catch (error) {
      console.error('Error submitting donation:', error);
      showErrorMessage('Failed to submit donation. Please try again later.');
  }
}

function updateDonationHistoryTable(donations) {
  const table = document.querySelector('#donationHistory table');
  table.innerHTML = `<tr><th>Donation Date</th><th>Blood Type</th><th>Location</th><th>Status</th><th>Response Date</th></tr>`;
  donations.forEach(donation => {
    const row = `<tr>
      <td>${donation.donation_date}</td>
      <td>${donation.blood_type}</td>
      <td>${donation.location}</td>
      <td class="status ${donation.status.toLowerCase()}">${donation.status}</td>
      <td>${donation.response_date || '-'}</td>
    </tr>`;
    table.innerHTML += row;
  });
}

// Function to fetch donation counts and update the dashboard
async function fetchDonationCounts() {
  const donorId = sessionStorage.getItem('donorId');  // Retrieve donorId from session storage

  if (!donorId) {
      console.error('Donor ID is not set in session storage');
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/donor/donation-counts/${donorId}`);
      const data = await response.json();

      document.getElementById('totalDonations').textContent = data.total || 0;
      document.getElementById('approvedDonations').textContent = data.approved || 0;
      document.getElementById('pendingDonations').textContent = data.pending || 0;
      document.getElementById('rejectedDonations').textContent = data.rejected || 0;
  } catch (error) {
      console.error('Error fetching donation counts:', error);
  }
}

async function refreshDonationHistory() {
  const donorId = sessionStorage.getItem('donorId');
  const donations = await fetchData(`http://localhost:3000/donor/donation-history/${donorId}`);
  if (donations) updateDonationHistoryTable(donations);
}

function logout() {
  sessionStorage.removeItem('donorId');
  window.location.href = 'donor_login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDonationCounts();
});