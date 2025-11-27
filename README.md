# Vehicle Service Booking Application

A comprehensive web application for managing vehicles and their service bookings.

## Features

### Dashboard
- Overview statistics (total vehicles, scheduled services, completed services)
- Upcoming services with date alerts
- Vehicle summary with service history

### Vehicle Management
- **GET**: View all vehicles
- **POST**: Add new vehicles
- **DELETE**: Remove vehicles
- Display vehicle details (make, model, year, license plate, mileage)

### Service Booking
- **GET**: View all bookings
- **POST**: Create new service bookings
- **PATCH**: Update existing bookings
- **DELETE**: Remove bookings
- Multiple service types available
- Notes field for special requests

### Service History
- View all past and scheduled services
- Filter by status (scheduled, completed, cancelled)
- Edit upcoming services
- Mark services as completed

## Components

1. **Navbar**: Navigation between different sections
2. **VehicleList**: Display and manage vehicles
3. **BookingForm**: Create and update service bookings
4. **ServiceHistory**: View all service records
5. **SummaryDashboard**: Overview with upcoming services

## How to Run

### Option 1: Using npx serve
```bash
npm start
```

### Option 2: Direct open
Simply open `index.html` in your web browser.

### Option 3: Using Python
```bash
python -m http.server 8000
```

Then navigate to `http://localhost:8000`

## Technologies Used

- HTML5
- CSS3 (Custom styling with CSS variables)
- Vanilla JavaScript (ES6+)
- LocalStorage for data persistence

## API Operations

### Vehicles
- `GET` /vehicles - Get all vehicles
- `GET` /vehicles/:id - Get vehicle by ID
- `POST` /vehicles - Create new vehicle
- `PATCH` /vehicles/:id - Update vehicle
- `DELETE` /vehicles/:id - Delete vehicle

### Bookings
- `GET` /bookings - Get all bookings
- `GET` /bookings/:id - Get booking by ID
- `POST` /bookings - Create new booking
- `PATCH` /bookings/:id - Update booking
- `DELETE` /bookings/:id - Delete booking

## Data Structure

### Vehicle
```javascript
{
  id: number,
  make: string,
  model: string,
  year: number,
  licensePlate: string,
  mileage: number
}
```

### Booking
```javascript
{
  id: number,
  vehicleId: number,
  serviceType: string,
  date: string (YYYY-MM-DD),
  status: 'scheduled' | 'completed' | 'cancelled',
  notes: string
}
```

## Future Enhancements

- Backend API integration
- User authentication
- Email/SMS notifications for upcoming services
- Service cost tracking
- Mechanic assignment
- File uploads for service reports
- Export service history to PDF

## License

MIT
