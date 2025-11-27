// Navbar Component
function renderNavbar() {
    const navbar = document.getElementById('navbar');
    
    navbar.innerHTML = `
        <div class="navbar">
            <div class="navbar-content">
                <div class="navbar-brand">🚗 Vehicle Service Booking</div>
                <ul class="navbar-menu">
                    <li><a href="#" data-section="dashboard" class="nav-link active">Dashboard</a></li>
                    <li><a href="#" data-section="vehicles" class="nav-link">Vehicles</a></li>
                    <li><a href="#" data-section="booking" class="nav-link">Book Service</a></li>
                    <li><a href="#" data-section="history" class="nav-link">Service History</a></li>
                </ul>
            </div>
        </div>
    `;
    
    // Add click event listeners
    const navLinks = navbar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            navigateToSection(section);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function navigateToSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    const sectionMap = {
        'dashboard': 'dashboard-section',
        'vehicles': 'vehicles-section',
        'booking': 'booking-section',
        'history': 'history-section'
    };
    
    const sectionId = sectionMap[section];
    if (sectionId) {
        document.getElementById(sectionId).classList.add('active');
    }
    
    // Refresh content based on section
    if (section === 'dashboard') {
        renderSummaryDashboard();
    } else if (section === 'vehicles') {
        renderVehicleList();
    } else if (section === 'booking') {
        renderBookingForm();
    } else if (section === 'history') {
        renderServiceHistory();
    }
}
