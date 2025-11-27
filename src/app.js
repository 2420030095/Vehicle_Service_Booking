// Main Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initializeApp();
});

function initializeApp() {
    // Render navbar
    renderNavbar();
    
    // Render initial dashboard
    renderSummaryDashboard();
    
    console.log('Vehicle Service Booking App initialized successfully!');
}
