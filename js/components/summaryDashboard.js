// Summary Dashboard Component
async function renderSummaryDashboard() {
    const container = document.getElementById('summary-dashboard');
    
    try {
        const vehicles = await api.getVehicles();
        const bookings = await api.getBookings();
        const upcomingBookings = await api.getUpcomingBookings();
        
        // Calculate statistics
        const totalVehicles = vehicles.length;
        const scheduledServices = bookings.filter(b => b.status === 'scheduled').length;
        const completedServices = bookings.filter(b => b.status === 'completed').length;
        
        // Get vehicle info for upcoming services
        const vehicleMap = {};
        vehicles.forEach(v => {
            vehicleMap[v.id] = v;
        });
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header">Dashboard Overview</div>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-label">Total Vehicles</div>
                        <div class="stat-value">${totalVehicles}</div>
                    </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-label">Scheduled Services</div>
                        <div class="stat-value">${scheduledServices}</div>
                    </div>
                    
                    <div class="stat-card success">
                        <div class="stat-label">Completed Services</div>
                        <div class="stat-value">${completedServices}</div>
                    </div>
                </div>
                
                <div class="upcoming-services">
                    <h3 style="margin-bottom: 1rem; color: var(--text-primary);">
                        Upcoming Services
                    </h3>
                    
                    ${upcomingBookings.length === 0 ? `
                        <div class="service-item">
                            <p style="color: var(--text-secondary);">
                                No upcoming services scheduled. 
                                <a href="#" onclick="navigateToSection('booking'); return false;">Schedule a service</a> now.
                            </p>
                        </div>
                    ` : `
                        ${upcomingBookings.map(booking => {
                            const vehicle = vehicleMap[booking.vehicleId];
                            const vehicleInfo = vehicle 
                                ? `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` 
                                : 'Unknown Vehicle';
                            
                            // Check if service is within 7 days
                            const daysUntil = Math.ceil((new Date(booking.date) - new Date()) / (1000 * 60 * 60 * 24));
                            const isUpcoming = daysUntil <= 7;
                            
                            return `
                                <div class="service-item ${isUpcoming ? 'upcoming' : ''}">
                                    <h4>${booking.serviceType}</h4>
                                    <p><strong>Vehicle:</strong> ${vehicleInfo}</p>
                                    <p><strong>Date:</strong> ${formatDate(booking.date)} 
                                        ${isUpcoming ? `<span style="color: var(--warning-color); font-weight: bold;">(${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} away)</span>` : ''}
                                    </p>
                                    ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
                                    <div style="margin-top: 0.5rem;">
                                        <button class="btn btn-primary btn-small" onclick="editBooking(${booking.id})">
                                            Edit
                                        </button>
                                        <button class="btn btn-success btn-small" onclick="markBookingCompleted(${booking.id})">
                                            Mark Complete
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    `}
                </div>
            </div>
            
            ${vehicles.length > 0 ? `
                <div class="card" style="margin-top: 1.5rem;">
                    <div class="card-header">Vehicle Summary</div>
                    <div class="vehicle-grid">
                        ${vehicles.map(vehicle => {
                            const vehicleBookings = bookings.filter(b => b.vehicleId === vehicle.id);
                            const lastService = vehicleBookings
                                .filter(b => b.status === 'completed')
                                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                            
                            return `
                                <div class="vehicle-card">
                                    <h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
                                    <p><strong>License:</strong> ${vehicle.licensePlate}</p>
                                    <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
                                    <p><strong>Total Services:</strong> ${vehicleBookings.length}</p>
                                    ${lastService ? `
                                        <p><strong>Last Service:</strong> ${lastService.serviceType} on ${formatDate(lastService.date)}</p>
                                    ` : '<p style="color: var(--text-secondary);">No service history</p>'}
                                    <div class="vehicle-actions" style="margin-top: 1rem;">
                                        <button class="btn btn-primary btn-small" onclick="bookServiceForVehicle(${vehicle.id})">
                                            Book Service
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    } catch (error) {
        container.innerHTML = `<div class="card"><p style="color: red;">Error loading dashboard: ${error.message}</p></div>`;
    }
}
