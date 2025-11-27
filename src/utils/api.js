// API Service Layer for managing vehicles and bookings
class ApiService {
    constructor() {
        // Mock data storage (in real app, this would be API endpoints)
        this.vehicles = this.loadFromStorage('vehicles') || [
            { id: 1, make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC-123', mileage: 45000 },
            { id: 2, make: 'Honda', model: 'Civic', year: 2021, licensePlate: 'XYZ-789', mileage: 23000 },
            { id: 3, make: 'Ford', model: 'F-150', year: 2019, licensePlate: 'DEF-456', mileage: 67000 }
        ];
        
        this.bookings = this.loadFromStorage('bookings') || [
            { id: 1, vehicleId: 1, serviceType: 'Oil Change', date: '2025-12-05', status: 'scheduled', notes: 'Regular maintenance' },
            { id: 2, vehicleId: 2, serviceType: 'Tire Rotation', date: '2025-11-28', status: 'scheduled', notes: 'Check tire pressure' },
            { id: 3, vehicleId: 1, serviceType: 'Brake Inspection', date: '2025-10-15', status: 'completed', notes: 'All good' },
            { id: 4, vehicleId: 3, serviceType: 'Oil Change', date: '2025-09-20', status: 'completed', notes: 'Synthetic oil used' }
        ];
        
        this.nextVehicleId = Math.max(...this.vehicles.map(v => v.id), 0) + 1;
        this.nextBookingId = Math.max(...this.bookings.map(b => b.id), 0) + 1;
    }
    
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }
    
    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    // VEHICLE OPERATIONS
    
    // GET all vehicles
    getVehicles() {
        return Promise.resolve([...this.vehicles]);
    }
    
    // GET vehicle by ID
    getVehicle(id) {
        const vehicle = this.vehicles.find(v => v.id === id);
        return Promise.resolve(vehicle);
    }
    
    // POST - Create new vehicle
    createVehicle(vehicleData) {
        const newVehicle = {
            id: this.nextVehicleId++,
            ...vehicleData
        };
        this.vehicles.push(newVehicle);
        this.saveToStorage('vehicles', this.vehicles);
        return Promise.resolve(newVehicle);
    }
    
    // PATCH - Update vehicle
    updateVehicle(id, updates) {
        const index = this.vehicles.findIndex(v => v.id === id);
        if (index !== -1) {
            this.vehicles[index] = { ...this.vehicles[index], ...updates };
            this.saveToStorage('vehicles', this.vehicles);
            return Promise.resolve(this.vehicles[index]);
        }
        return Promise.reject(new Error('Vehicle not found'));
    }
    
    // DELETE vehicle
    deleteVehicle(id) {
        const index = this.vehicles.findIndex(v => v.id === id);
        if (index !== -1) {
            this.vehicles.splice(index, 1);
            this.saveToStorage('vehicles', this.vehicles);
            return Promise.resolve({ success: true });
        }
        return Promise.reject(new Error('Vehicle not found'));
    }
    
    // BOOKING OPERATIONS
    
    // GET all bookings
    getBookings() {
        return Promise.resolve([...this.bookings]);
    }
    
    // GET booking by ID
    getBooking(id) {
        const booking = this.bookings.find(b => b.id === id);
        return Promise.resolve(booking);
    }
    
    // GET bookings by vehicle ID
    getBookingsByVehicle(vehicleId) {
        const vehicleBookings = this.bookings.filter(b => b.vehicleId === vehicleId);
        return Promise.resolve(vehicleBookings);
    }
    
    // GET upcoming bookings
    getUpcomingBookings() {
        const today = new Date().toISOString().split('T')[0];
        const upcoming = this.bookings.filter(b => 
            b.status === 'scheduled' && b.date >= today
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
        return Promise.resolve(upcoming);
    }
    
    // POST - Create new booking
    createBooking(bookingData) {
        const newBooking = {
            id: this.nextBookingId++,
            status: 'scheduled',
            ...bookingData
        };
        this.bookings.push(newBooking);
        this.saveToStorage('bookings', this.bookings);
        return Promise.resolve(newBooking);
    }
    
    // PATCH - Update booking
    updateBooking(id, updates) {
        const index = this.bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            this.bookings[index] = { ...this.bookings[index], ...updates };
            this.saveToStorage('bookings', this.bookings);
            return Promise.resolve(this.bookings[index]);
        }
        return Promise.reject(new Error('Booking not found'));
    }
    
    // DELETE booking
    deleteBooking(id) {
        const index = this.bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            this.bookings.splice(index, 1);
            this.saveToStorage('bookings', this.bookings);
            return Promise.resolve({ success: true });
        }
        return Promise.reject(new Error('Booking not found'));
    }
}

// Create a global instance
const api = new ApiService();
