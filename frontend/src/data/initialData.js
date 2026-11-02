/**
 * Initial demo data matching the existing Core Java Vehicle Rental application.
 * Reference files:
 *  - data/vehicles.txt
 *  - data/customers.txt
 *  - data/rentals.txt
 *  - data/maintenance.txt
 */

export const INITIAL_VEHICLES = [
  {
    id: 'V001',
    type: 'Car',
    brand: 'Toyota',
    model: 'Corolla',
    rentalRatePerDay: 2000.0,
    isAvailable: true,
    specification: 'Seats: 5',
    specValue: 5,
    specLabel: 'Seats',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Refined Executive Sedan',
  },
  {
    id: 'V002',
    type: 'Bike',
    brand: 'Yamaha',
    model: 'R15',
    rentalRatePerDay: 800.0,
    isAvailable: true,
    specification: 'Engine: 155 cc',
    specValue: 155,
    specLabel: 'Engine (cc)',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Track-Inspired Supersport',
  },
  {
    id: 'V003',
    type: 'Bus',
    brand: 'Tata',
    model: 'Starbus',
    rentalRatePerDay: 5000.0,
    isAvailable: false, // Currently rented in R003
    specification: 'Seats: 45',
    specValue: 45,
    specLabel: 'Seats',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Luxury Passenger Transport',
  },
  {
    id: 'V004',
    type: 'Truck',
    brand: 'Tata',
    model: 'Prima 4028',
    rentalRatePerDay: 6000.0,
    isAvailable: true,
    specification: 'Load: 10.0 tons',
    specValue: 10.0,
    specLabel: 'Load (tons)',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Heavy-Duty Commercial Hauler',
  },
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'C001',
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@example.com',
    registeredDate: '2026-08-10',
  },
  {
    id: 'C002',
    name: 'Priya Verma',
    phone: '9123456780',
    email: 'priya.verma@example.com',
    registeredDate: '2026-08-15',
  },
];

export const INITIAL_RENTALS = [
  {
    id: 'R001',
    customerId: 'C001',
    customerName: 'Rahul Sharma',
    vehicleId: 'V001',
    vehicleName: 'Toyota Corolla (Car)',
    vehicleType: 'Car',
    days: 3,
    totalCost: 6000.0,
    rentDate: '2026-09-15',
    returnDate: '2026-09-18',
    isCompleted: true,
    status: 'Returned',
    paymentMethod: 'Card',
  },
  {
    id: 'R002',
    customerId: 'C002',
    customerName: 'Priya Verma',
    vehicleId: 'V002',
    vehicleName: 'Yamaha R15 (Bike)',
    vehicleType: 'Bike',
    days: 5,
    totalCost: 4000.0,
    rentDate: '2026-09-25',
    returnDate: '2026-09-30',
    isCompleted: true,
    status: 'Returned',
    paymentMethod: 'UPI',
  },
  {
    id: 'R003',
    customerId: 'C002',
    customerName: 'Priya Verma',
    vehicleId: 'V003',
    vehicleName: 'Tata Starbus (Bus)',
    vehicleType: 'Bus',
    days: 2,
    totalCost: 11000.0, // (5000 rate + 500 driver allowance) * 2 days = 11000
    rentDate: '2026-10-08',
    returnDate: '-',
    isCompleted: false,
    status: 'Active',
    paymentMethod: 'Cash',
  },
  {
    id: 'R004',
    customerId: 'C001',
    customerName: 'Rahul Sharma',
    vehicleId: 'V004',
    vehicleName: 'Tata Prima 4028 (Truck)',
    vehicleType: 'Truck',
    days: 2,
    totalCost: 13000.0, // (6000 * 2) + 1000 loading charge = 13000
    rentDate: '2026-10-12',
    returnDate: '2026-10-14',
    isCompleted: true,
    status: 'Returned',
    paymentMethod: 'Card',
  },
];

export const INITIAL_MAINTENANCE = [
  {
    id: 'M001',
    vehicleId: 'V001',
    vehicleName: 'Toyota Corolla',
    description: 'Engine oil change & synthetic lube flush',
    date: '2026-10-01',
    cost: 1500.0,
    serviceCenter: 'Authorized Toyota Tech Center',
  },
  {
    id: 'M002',
    vehicleId: 'V003',
    vehicleName: 'Tata Starbus',
    description: 'Pneumatic brake calibration & air system check',
    date: '2026-10-05',
    cost: 3200.0,
    serviceCenter: 'Tata Commercial Fleet Center',
  },
];
