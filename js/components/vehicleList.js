// Vehicle List Component
async function renderVehicleList() {
    const container = document.getElementById('vehicle-list');
    
    try {
        const vehicles = await api.getVehicles();
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    My Vehicles
                    <button class="btn btn-primary btn-small" style="float: right;" onclick="showAddVehicleForm()">
                        + Add Vehicle
                    </button>
                </div>
                
                <div id="add-vehicle-form" style="display: none; margin-bottom: 2rem; padding: 1rem; background-color: var(--bg-color); border-radius: 4px;">
                    <h3 style="margin-bottom: 1rem;">Add New Vehicle</h3>
                    <form id="vehicle-form" onsubmit="handleVehicleSubmit(event)">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label>Make</label>
                                <input type="text" name="make" required>
                            </div>
                            <div class="form-group">
                                <label>Model</label>
                                <input type="text" name="model" required>
                            </div>
                            <div class="form-group">
                                <label>Year</label>
                                <input type="number" name="year" min="1900" max="2099" required>
                            </div>
                            <div class="form-group">
                                <label>License Plate</label>
                                <input type="text" name="licensePlate" required>
                            </div>
                            <div class="form-group">
                                <label>Mileage</label>
                                <input type="number" name="mileage" min="0" required>
                            </div>
                        </div>
                        <div class="vehicle-actions">
                            <button type="submit" class="btn btn-success">Save Vehicle</button>
                            <button type="button" class="btn btn-danger" onclick="hideAddVehicleForm()">Cancel</button>
                        </div>
                    </form>
                </div>
                
                <div class="vehicle-grid" id="vehicles-container">
                    ${vehicles.map(vehicle => `
                        <div class="vehicle-card" id="vehicle-${vehicle.id}">
                            <h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
                            <p><strong>License Plate:</strong> ${vehicle.licensePlate}</p>
                            <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
                            <div class="vehicle-actions">
                                <button class="btn btn-primary btn-small" onclick="bookServiceForVehicle(${vehicle.id})">
                                    Book Service
                                </button>
                                <button class="btn btn-danger btn-small" onclick="deleteVehicle(${vehicle.id})">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="card"><p style="color: red;">Error loading vehicles: ${error.message}</p></div>`;
    }
}

function showAddVehicleForm() {
    document.getElementById('add-vehicle-form').style.display = 'block';
}

function hideAddVehicleForm() {
    document.getElementById('add-vehicle-form').style.display = 'none';
    document.getElementById('vehicle-form').reset();
}

async function handleVehicleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const vehicleData = {
        make: formData.get('make'),
        model: formData.get('model'),
        year: parseInt(formData.get('year')),
        licensePlate: formData.get('licensePlate'),
        mileage: parseInt(formData.get('mileage'))
    };
    
    try {
        await api.createVehicle(vehicleData);
        hideAddVehicleForm();
        renderVehicleList();
    } catch (error) {
        alert('Error adding vehicle: ' + error.message);
    }
}

async function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        try {
            await api.deleteVehicle(id);
            renderVehicleList();
        } catch (error) {
            alert('Error deleting vehicle: ' + error.message);
        }
    }
}

function bookServiceForVehicle(vehicleId) {
    navigateToSection('booking');
    setTimeout(() => {
        const vehicleSelect = document.querySelector('select[name="vehicleId"]');
        if (vehicleSelect) {
            vehicleSelect.value = vehicleId;
        }
    }, 100);
}
