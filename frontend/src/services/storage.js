import {
  INITIAL_VEHICLES,
  INITIAL_CUSTOMERS,
  INITIAL_RENTALS,
  INITIAL_MAINTENANCE,
} from '../data/initialData';

const KEYS = {
  VEHICLES: 'drivedesk_vehicles_v2',
  CUSTOMERS: 'drivedesk_customers_v2',
  RENTALS: 'drivedesk_rentals_v2',
  MAINTENANCE: 'drivedesk_maintenance_v2',
};

const DEFAULT_IMAGES = {
  Car: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
  Bike: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
  Bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  Truck: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
};

function getItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const data = JSON.parse(raw);
    // Enrich with images if missing
    if (key === KEYS.VEHICLES && Array.isArray(data)) {
      return data.map((v) => ({
        ...v,
        imageUrl: v.imageUrl || DEFAULT_IMAGES[v.type] || DEFAULT_IMAGES.Car,
      }));
    }
    return data;
  } catch (err) {
    console.error(`Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}

function setItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage:`, err);
  }
}

export const storage = {
  getVehicles: () => getItem(KEYS.VEHICLES, INITIAL_VEHICLES),
  setVehicles: (data) => setItem(KEYS.VEHICLES, data),

  getCustomers: () => getItem(KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  setCustomers: (data) => setItem(KEYS.CUSTOMERS, data),

  getRentals: () => getItem(KEYS.RENTALS, INITIAL_RENTALS),
  setRentals: (data) => setItem(KEYS.RENTALS, data),

  getMaintenance: () => getItem(KEYS.MAINTENANCE, INITIAL_MAINTENANCE),
  setMaintenance: (data) => setItem(KEYS.MAINTENANCE, data),

  resetAll: () => {
    localStorage.setItem(KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(KEYS.RENTALS, JSON.stringify(INITIAL_RENTALS));
    localStorage.setItem(KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE));
    return {
      vehicles: INITIAL_VEHICLES,
      customers: INITIAL_CUSTOMERS,
      rentals: INITIAL_RENTALS,
      maintenance: INITIAL_MAINTENANCE,
    };
  },
};
