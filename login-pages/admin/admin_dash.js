// admin_dash.js

// Global variables
let currentDonationRequests = [];
let currentBloodRequests = [];

// Initialize dashboard when document loads
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    loadDonationRequests();
    loadBloodRequests();
    loadRequestHistory();
    //viewDonors();
    //viewRecipients();

    // Add click handlers for navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', event => {
            const target = event.target;
            if (target.classList.contains('nav-link')) {
                const linkText = target.textContent.trim();
                
                // Show/hide relevant sections based on what was clicked
                if (linkText === 'Donation Requests') {
                    document.getElementById('donationRequestsTable').style.display = 'block';
                    document.getElementById('bloodRequests').style.display = 'none';
                    document.getElementById('requestHistory').style.display = 'none';
                }
                else if (linkText === 'Blood Requests') {
                    document.getElementById('donationRequestsTable').style.display = 'none';
                    document.getElementById('bloodRequests').style.display = 'block';
                    document.getElementById('requestHistory').style.display = 'none';
                }
                else if (linkText === 'Request History') {
                    document.getElementById('donationRequestsTable').style.display = 'none';
                    document.getElementById('bloodRequests').style.display = 'none';
                    document.getElementById('requestHistory').style.display = 'block';
                }
            }
        });
    });
});

async function initializeDashboard() {
    try {
        await loadDashboardData();
        await loadAllRequests();
        // Set default tab after ensuring DOM is loaded
        setTimeout(() => openTab('donationRequestsTable'), 100);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = "admin_login.html";
}

// Tab switching
function openTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    const buttons = document.getElementsByClassName('tab-btn');
    
    if (!tabs || !buttons) return;

    Array.from(tabs).forEach(tab => {
        if (tab) tab.style.display = 'none';
    });
    
    Array.from(buttons).forEach(button => {
        if (button) button.classList.remove('active');
    });

    const selectedTab = document.getElementById(tabId);
    const selectedButton = document.querySelector(`button[onclick="openTab('${tabId}')"]`);
    
    if (selectedTab) selectedTab.style.display = 'block';
    if (selectedButton) selectedButton.classList.add('active');
}

// Load dashboard overview data
async function loadDashboardData() {
    try {
        const stockResponse = await fetch('http://localhost:3000/admin/blood-stock');
        if (!stockResponse.ok) throw new Error('Failed to fetch blood stock');
        const bloodStock = await stockResponse.json();
        updateBloodStockDisplay(bloodStock);

        const [donorsResponse, recipientsResponse] = await Promise.all([
            fetch('http://localhost:3000/admin/donors'),
            fetch('http://localhost:3000/admin/recipients')
        ]);

        if (!donorsResponse.ok || !recipientsResponse.ok) {
            throw new Error('Failed to fetch counts');
        }

        const donors = await donorsResponse.json();
        const recipients = await recipientsResponse.json();

        const donorCount = document.querySelector('.donor-count');
        const recipientCount = document.querySelector('.recipient-count');

        if (donorCount && recipientCount) {
            donorCount.textContent = donors.length;
            recipientCount.textContent = recipients.length;
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert(`Error loading dashboard data: ${error.message}`);
    }
}

// Update blood stock display
function updateBloodStockDisplay(stockData) {
    const stockList = document.querySelector('.blood-stock ul');
    const totalUnitsElement = document.querySelector('.total-units');
    
    if (!stockList || !totalUnitsElement) {
        console.error('Blood stock elements not found');
        return;
    }

    let totalUnits = 0;
    stockList.innerHTML = '';

    stockData.forEach(item => {
        totalUnits += Number(item.units);
        const li = document.createElement('li');
        li.textContent = `${item.blood_type}: ${item.units} units`;
        stockList.appendChild(li);
    });

    totalUnitsElement.textContent = totalUnits;
}

// Load all requests
async function loadAllRequests() {
    try {
        await Promise.all([
            loadDonationRequests(),
            loadBloodRequests()
        ]);
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

// Display donation requests
function displayDonationRequests(requests) {
    const tableBody = document.querySelector('#donationRequestsTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = requests.length ? '' : '<tr><td colspan="7">No pending donation requests</td></tr>';

    requests.forEach(request => {
        tableBody.innerHTML += `
            <tr>
                <td>${request.donor_id}</td>
                <td>${request.full_name}</td>
                <td>${request.blood_group}</td>
                <td>${request.address}</td>
                <td>${new Date(request.donation_date).toLocaleDateString()}</td>
                <td>${request.status}</td>
                <td>
                    ${request.status === 'Pending' ? `
                        <button onclick="handleDonationRequest(${request.donation_id}, 'Approved')">
                            Approve
                        </button>
                        <button onclick="handleDonationRequest(${request.donation_id}, 'Rejected')">
                            Reject
                        </button>
                    ` : request.status}
                </td>
            </tr>
        `;
    });
}

// Handle donation request approval/rejection
async function handleDonationRequest(donationId, status) {
    try {
        const response = await fetch(`http://localhost:3000/admin/donation-requests/${donationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Request failed');

        // Refresh the data
        loadDonationRequests();
        loadDashboardData();
        
        alert(`Donation request ${status.toLowerCase()} successfully`);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to process request');
    }
}

// Load donation requests
async function loadDonationRequests() {
    try {
        const response = await fetch('http://localhost:3000/admin/donation-requests');
        const data = await response.json();
        displayDonationRequests(data);
    } catch (error) {
        console.error('Error loading donation requests:', error);
        displayDonationRequests([]);
    }
}

// Load blood requests
async function loadBloodRequests() {
    try {
        const response = await fetch('http://localhost:3000/admin/blood-requests');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { success, data } = await response.json();

        if (success) {
            if (data.length === 0 || data.every(request => request.status !== 'Pending')) {
                clearBloodRequestsTable();
            } else {
                displayBloodRequests(data);
            }
        } else {
            throw new Error('Failed to fetch blood requests');
        }
    } catch (error) {
        console.error('Error loading blood requests:', error);
        clearBloodRequestsTable();
    }
}

function clearBloodRequestsTable() {
    const tableBody = document.querySelector('#bloodRequests tbody');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No pending blood requests</td></tr>';
    }
}

// Display blood requests
function displayBloodRequests(requests) {
    const tableBody = document.querySelector('#bloodRequests tbody');
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }

    if (!requests || requests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No blood requests available</td></tr>';
        return;
    }

    const requestRows = requests.map(request => `
        <tr>
            <td>${request.recipient_id || 'N/A'}</td>
            <td>${request.blood_type || 'N/A'} (${request.units || 0} units)</td>
            <td>${request.purpose || 'N/A'}</td>
            <td>${request.status || 'N/A'}</td>
            <td>
                ${request.status === 'Pending' ? `
                    <button onclick="handleBloodRequest(${request.request_id}, 'Approved')"
                            style="background-color: #4CAF50; color: white; margin-right: 5px;">
                        Approve
                    </button>
                    <button onclick="handleBloodRequest(${request.request_id}, 'Rejected')"
                            style="background-color: #f44336; color: white;">
                        Reject
                    </button>
                ` : request.status}
            </td>
        </tr>
    `).join('');

    tableBody.innerHTML = requestRows;
}

// Handle blood request approval/rejection
async function handleBloodRequest(requestId, status) {
    try {
        // Different endpoints for approve and reject
        const endpoint = status === 'Approved' 
            ? `http://localhost:3000/admin/blood-requests/${requestId}/approve`
            : `http://localhost:3000/admin/blood-requests/${requestId}/reject`;

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                request_id: requestId,
                comments: status === 'Rejected' ? 'Request rejected by admin' : ''
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to process request');
        }

        const result = await response.json();
        alert(result.message);
        
        // Refresh the data
        await Promise.all([
            loadBloodRequests(),
            loadDashboardData()
        ]);
    } catch (error) {
        console.error('Error processing request:', error);
        alert(`Failed to process request: ${error.message}`);
    }
}

// Load request history
async function loadRequestHistory() {
    try {
        const response = await fetch('http://localhost:3000/admin/request-history');
        const { success, data } = await response.json();
        
        if (success) {
            displayRequestHistory(data);
        } else {
            throw new Error('Failed to fetch request history');
        }
    } catch (error) {
        console.error('Error loading request history:', error);
        displayRequestHistory([]);
    }
}

// Display request history
function displayRequestHistory(history) {
    const tableBody = document.querySelector('#requestHistory tbody');
    if (!tableBody) return;

    tableBody.innerHTML = history.length ? '' : '<tr><td colspan="7">No request history found</td></tr>';

    history.forEach(item => {
        tableBody.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.type}</td>
                <td>${item.full_name || 'N/A'}</td>
                <td>${item.blood_type}</td>
                <td>${item.units} unit(s)</td>
                <td>${item.status}</td>
                <td>${item.comments || 'N/A'}</td>
            </tr>
        `;
    });
}

// Modal functions for blood stock updates
function openUpdateModal() {
    document.getElementById('updateModal').style.display = 'block';
}

function closeUpdateModal() {
    document.getElementById('updateModal').style.display = 'none';
}

// Handle blood stock update form submission
document.getElementById('update-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch('http://localhost:3000/admin/blood-stock', {
            method: 'POST', // Changed from PUT to POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                blood_type: formData.get('blood-type'),
                units: parseInt(formData.get('units'))
            })
        });

        if (!response.ok) throw new Error('Update failed');
        
        const data = await response.json();
        alert('Blood stock updated successfully');
        closeUpdateModal();
        loadDashboardData();
    } catch (error) {
        console.error('Error updating blood stock:', error);
        alert('Error updating blood stock');
    }
});

async function viewDonors() {
    try {
        const response = await fetch('http://localhost:3000/admin/donors');
        if (!response.ok) throw new Error('Failed to fetch donors');
        const donors = await response.json();
        displayDonors(donors);
    } catch (error) {
        console.error('Error loading donors:', error);
        alert('Error loading donors');
    }
}

async function viewRecipients() {
    try {
        const response = await fetch('http://localhost:3000/admin/recipients');
        if (!response.ok) throw new Error('Failed to fetch recipients');
        const recipients = await response.json();
        displayRecipients(recipients);
    } catch (error) {
        console.error('Error loading recipients:', error);
        alert('Error loading recipients');
    }
}

function displayRecipients(recipients) {
    // Store the current dashboard content
    const dashboardContent = document.querySelector('.dashboard-main').innerHTML;
    
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="list-container">
            <div class="list-header">
                <h2>Recipient List</h2>
                <button class="back-btn" onclick="restoreDashboard()">Back to Dashboard</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    ${recipients.map(recipient => `
                        <tr>
                            <td>${recipient.id}</td>
                            <td>${recipient.full_name}</td>
                            <td>${recipient.age}</td>
                            <td>${recipient.gender}</td>
                            <td>${recipient.contact_number}</td>
                            <td>${recipient.address}</td>
                            <td>${recipient.email}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Store the original dashboard content
    if (!window.dashboardState) {
        window.dashboardState = dashboardContent;
    }

    const mainContent = document.querySelector('.dashboard-main');
    mainContent.innerHTML = '';
    mainContent.appendChild(content);
}

function displayDonors(donors) {
    // Store the current dashboard content
    const dashboardContent = document.querySelector('.dashboard-main').innerHTML;
    
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="list-container">
            <div class="list-header">
                <h2>Donor List</h2>
                <button class="back-btn" onclick="restoreDashboard()">Back to Dashboard</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Blood Group</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    ${donors.map(donor => `
                        <tr>
                            <td>${donor.id}</td>
                            <td>${donor.full_name}</td>
                            <td>${donor.blood_group}</td>
                            <td>${donor.age}</td>
                            <td>${donor.gender}</td>
                            <td>${donor.contact_number}</td>
                            <td>${donor.address}</td>
                            <td>${donor.email}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Store the original dashboard content
    if (!window.dashboardState) {
        window.dashboardState = dashboardContent;
    }

    const mainContent = document.querySelector('.dashboard-main');
    mainContent.innerHTML = '';
    mainContent.appendChild(content);
}

// Function to restore dashboard
function restoreDashboard() {
    if (window.dashboardState) {
        const mainContent = document.querySelector('.dashboard-main');
        mainContent.innerHTML = window.dashboardState;
        // Reinitialize any necessary dashboard components
        loadDashboardData();
    }
}