// Service History Component
async function renderServiceHistory() {
    const container = document.getElementById('service-history');
    
    try {
        const bookings = await api.getBookings();
        const vehicles = await api.getVehicles();
        
        // Create a map of vehicle IDs to vehicle info
        const vehicleMap = {};
        vehicles.forEach(v => {
            vehicleMap[v.id] = v;
        });
        
        // Sort bookings by date (newest first)
        const sortedBookings = [...bookings].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header">Service History</div>
                
                ${sortedBookings.length === 0 ? `
                    <p style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No service bookings found. <a href="#" onclick="navigateToSection('booking'); return false;">Book a service</a> to get started.
                    </p>
                ` : `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vehicle</th>
                                <th>Service Type</th>
                                <th>Status</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedBookings.map(booking => {
                                const vehicle = vehicleMap[booking.vehicleId];
                                const vehicleInfo = vehicle 
                                    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` 
                                    : 'Unknown Vehicle';
                                    
                                return `
                                    <tr>
                                        <td>${formatDate(booking.date)}</td>
                                        <td>${vehicleInfo}</td>
                                        <td>${booking.serviceType}</td>
                                        <td>
                                            <span class="status-badge status-${booking.status}">
                                                ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>${booking.notes || '-'}</td>
                                        <td>
                                            ${booking.status === 'scheduled' ? `
                                                <button class="btn btn-primary btn-small" onclick="editBooking(${booking.id})">
                                                    Edit
                                                </button>
                                                <button class="btn btn-success btn-small" onclick="markBookingCompleted(${booking.id})">
                                                    Complete
                                                </button>
                                            ` : ''}
                                            <button class="btn btn-danger btn-small" onclick="deleteBooking(${booking.id})">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                `}
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="card"><p style="color: red;">Error loading service history: ${error.message}</p></div>`;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

async function markBookingCompleted(id) {
    try {
        await api.updateBooking(id, { status: 'completed' });
        renderServiceHistory();
        // Also refresh dashboard if it's visible
        const dashboardSection = document.getElementById('dashboard-section');
        if (dashboardSection.classList.contains('active')) {
            renderSummaryDashboard();
        }
    } catch (error) {
        alert('Error updating booking: ' + error.message);
    }
}

async function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            await api.deleteBooking(id);
            renderServiceHistory();
            // Also refresh dashboard if it's visible
            const dashboardSection = document.getElementById('dashboard-section');
            if (dashboardSection.classList.contains('active')) {
                renderSummaryDashboard();
            }
        } catch (error) {
            alert('Error deleting booking: ' + error.message);
        }
    }
}
