import { storage } from './storage';
import { vehicleService } from './vehicleService';
import { calculateRentalCost } from '../utils/pricing';

export const rentalService = {
  getAll: () => {
    return storage.getRentals();
  },

  getActive: () => {
    return storage.getRentals().filter((r) => !r.isCompleted);
  },

  getHistory: () => {
    return storage.getRentals();
  },

  bookRental: ({ customerId, vehicleId, days, paymentMethod = 'Cash' }) => {
    const vehicles = storage.getVehicles();
    const customers = storage.getCustomers();
    const rentals = storage.getRentals();

    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle ${vehicleId} not found.`);
    }
    if (!vehicle.isAvailable) {
      throw new Error(`Vehicle ${vehicle.brand} ${vehicle.model} (${vehicle.id}) is already rented!`);
    }

    const customer = customers.find((c) => c.id === customerId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found.`);
    }

    const numDays = parseInt(days, 10);
    if (isNaN(numDays) || numDays <= 0) {
      throw new Error('Rental duration must be at least 1 day.');
    }

    // Pricing calculation
    const pricing = calculateRentalCost(vehicle, numDays);

    // Next Rental ID (R005, etc.)
    const maxNum = rentals.reduce((max, r) => {
      const match = r.id.match(/\d+/);
      return match ? Math.max(max, parseInt(match[0], 10)) : max;
    }, 0);
    const newRentalId = `R${String(maxNum + 1).padStart(3, '0')}`;

    const today = new Date().toISOString().split('T')[0];

    const newRental = {
      id: newRentalId,
      customerId: customer.id,
      customerName: customer.name,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.brand} ${vehicle.model} (${vehicle.type})`,
      vehicleType: vehicle.type,
      days: numDays,
      totalCost: pricing.totalCost,
      rentDate: today,
      returnDate: '-',
      isCompleted: false,
      status: 'Active',
      paymentMethod,
    };

    // Update rentals list
    const updatedRentals = [newRental, ...rentals];
    storage.setRentals(updatedRentals);

    // Update vehicle to rented (isAvailable = false)
    vehicleService.setAvailability(vehicle.id, false);

    return {
      rental: newRental,
      pricing,
    };
  },

  returnRental: (rentalId) => {
    const rentals = storage.getRentals();
    const rentalIndex = rentals.findIndex((r) => r.id === rentalId);

    if (rentalIndex === -1) {
      throw new Error(`Rental ${rentalId} not found.`);
    }

    const rental = rentals[rentalIndex];
    if (rental.isCompleted) {
      throw new Error(`Rental ${rentalId} has already been returned.`);
    }

    const today = new Date().toISOString().split('T')[0];

    const updatedRental = {
      ...rental,
      isCompleted: true,
      status: 'Returned',
      returnDate: today,
    };

    rentals[rentalIndex] = updatedRental;
    storage.setRentals([...rentals]);

    // Mark vehicle available again
    vehicleService.setAvailability(rental.vehicleId, true);

    return updatedRental;
  },
};
