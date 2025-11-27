// Booking Form Component
async function renderBookingForm() {
    const container = document.getElementById('booking-form');
    
    try {
        const vehicles = await api.getVehicles();
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header">Book a Service</div>
                
                <form id="booking-form-element" onsubmit="handleBookingSubmit(event)">
                    <input type="hidden" name="bookingId" id="booking-id">
                    
                    <div class="form-group">
                        <label>Select Vehicle *</label>
                        <select name="vehicleId" required>
                            <option value="">Choose a vehicle...</option>
                            ${vehicles.map(v => `
                                <option value="${v.id}">${v.year} ${v.make} ${v.model} - ${v.licensePlate}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Service Type *</label>
                        <select name="serviceType" required>
                            <option value="">Choose service type...</option>
                            <option value="Oil Change">Oil Change</option>
                            <option value="Tire Rotation">Tire Rotation</option>
                            <option value="Brake Inspection">Brake Inspection</option>
                            <option value="Engine Diagnostic">Engine Diagnostic</option>
                            <option value="Transmission Service">Transmission Service</option>
                            <option value="Battery Replacement">Battery Replacement</option>
                            <option value="Air Filter Replacement">Air Filter Replacement</option>
                            <option value="Wheel Alignment">Wheel Alignment</option>
                            <option value="General Inspection">General Inspection</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Service Date *</label>
                        <input type="date" name="date" min="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea name="notes" rows="4" placeholder="Any additional information or special requests..."></textarea>
                    </div>
                    
                    <div class="vehicle-actions">
                        <button type="submit" class="btn btn-success" id="submit-booking-btn">
                            Schedule Service
                        </button>
                        <button type="button" class="btn btn-danger" onclick="resetBookingForm()">
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="card"><p style="color: red;">Error loading booking form: ${error.message}</p></div>`;
    }
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookingId = formData.get('bookingId');
    
    const bookingData = {
        vehicleId: parseInt(formData.get('vehicleId')),
        serviceType: formData.get('serviceType'),
        date: formData.get('date'),
        notes: formData.get('notes')
    };
    
    try {
        if (bookingId) {
            // PATCH - Update existing booking
            await api.updateBooking(parseInt(bookingId), bookingData);
            alert('Booking updated successfully!');
        } else {
            // POST - Create new booking
            await api.createBooking(bookingData);
            alert('Service scheduled successfully!');
        }
        resetBookingForm();
    } catch (error) {
        alert('Error saving booking: ' + error.message);
    }
}

function resetBookingForm() {
    const form = document.getElementById('booking-form-element');
    if (form) {
        form.reset();
        document.getElementById('booking-id').value = '';
        document.getElementById('submit-booking-btn').textContent = 'Schedule Service';
    }
}

// Function to edit a booking (called from service history)
async function editBooking(id) {
    try {
        const booking = await api.getBooking(id);
        navigateToSection('booking');
        
        setTimeout(() => {
            document.getElementById('booking-id').value = booking.id;
            document.querySelector('select[name="vehicleId"]').value = booking.vehicleId;
            document.querySelector('select[name="serviceType"]').value = booking.serviceType;
            document.querySelector('input[name="date"]').value = booking.date;
            document.querySelector('textarea[name="notes"]').value = booking.notes || '';
            document.getElementById('submit-booking-btn').textContent = 'Update Service';
        }, 100);
    } catch (error) {
        alert('Error loading booking: ' + error.message);
    }
}
