// recipient_dash.js

function openRequestForm() {
  document.getElementById('requestForm').style.display = 'block';
}

function closeRequestForm() {
  document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
}

async function openTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[onclick="openTab('${tabName}')"]`).classList.add('active');

  const recipientId = sessionStorage.getItem('recipientId');
  const requests = await fetchData(`http://localhost:3000/recipient/request-history/${recipientId}`);
  if (requests) updateRequestHistoryTable(requests);
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

async function submitRequest(event) {
  event.preventDefault();

  const form = document.getElementById('bloodRequestForm');
  const recipientId = sessionStorage.getItem('recipientId');
  const requestBody = {
    recipientId: recipientId,
    requestData: {
      blood_type: form.requestBloodType.value,
      units: form.units.value,
      purpose: form.purpose.value,
      location: form.requestLocation.value,
    }
  };

  console.log('Submitting request data:', requestBody); // Debug log

  try {
    const response = await fetch('http://localhost:3000/recipient/add-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (response.ok) {
      showSuccessMessage('Blood request submitted successfully!');
      form.reset();
      closeRequestForm();
      await refreshRequestHistory();
    } else {
      showErrorMessage(data.message || 'Failed to submit blood request');
    }
  } catch (error) {
    console.error('Error submitting request:', error);
    showErrorMessage('Failed to submit request. Please try again later.');
  }
}

function updateRequestHistoryTable(requests) {
  const table = document.querySelector('#requestHistory table');
  table.innerHTML = `<tr><th>Request Date</th><th>Blood Type & Units</th><th>Purpose</th><th>Location</th><th>Status</th><th>Response Date</th><th>Comments</th></tr>`;  // Clear existing rows
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

async function fetchRequestCounts() {
  const recipientId = sessionStorage.getItem('recipientId');

  if (!recipientId) {
    console.error('Recipient ID is not set in session storage');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/recipient/request-counts/${recipientId}`);
    const data = await response.json();

    document.getElementById('total-requests').textContent = data.total || 0;
    document.getElementById('approved-count').textContent = data.approved || 0;
    document.getElementById('pending-count').textContent = data.pending || 0;
    document.getElementById('rejected-count').textContent = data.rejected || 0;
  } catch (error) {
    console.error('Error fetching request counts:', error);
  }
}

async function refreshRequestHistory() {
  const recipientId = sessionStorage.getItem('recipientId');
  const requests = await fetchData(`http://localhost:3000/recipient/request-history/${recipientId}`);
  if (requests) updateRequestHistoryTable(requests);
}

function logout() {
  sessionStorage.removeItem('recipientId');
  window.location.href = 'recipient_login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  fetchRequestCounts();
});

document.getElementById('bloodRequestForm').addEventListener('submit', submitRequest);