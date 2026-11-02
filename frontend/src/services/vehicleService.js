import { storage } from './storage';

const DEFAULT_TYPE_IMAGES = {
  Car: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
  Bike: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
  Bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  Truck: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
};

export const vehicleService = {
  getAll: () => {
    return storage.getVehicles();
  },

  getById: (id) => {
    const list = storage.getVehicles();
    return list.find((v) => v.id === id) || null;
  },

  create: (vehicleData) => {
    const list = storage.getVehicles();

    // Generate next ID if not provided
    let newId = vehicleData.id;
    if (!newId) {
      const maxNum = list.reduce((max, v) => {
        const match = v.id.match(/\d+/);
        return match ? Math.max(max, parseInt(match[0], 10)) : max;
      }, 0);
      newId = `V${String(maxNum + 1).padStart(3, '0')}`;
    }

    // Build specification label and text matching Java specs
    let specification = '';
    let specLabel = '';
    const type = vehicleData.type;
    const specVal = vehicleData.specValue;

    if (type === 'Car' || type === 'Bus') {
      specLabel = 'Seats';
      specification = `Seats: ${specVal}`;
    } else if (type === 'Bike') {
      specLabel = 'Engine (cc)';
      specification = `Engine: ${specVal} cc`;
    } else if (type === 'Truck') {
      specLabel = 'Load (tons)';
      specification = `Load: ${specVal} tons`;
    }

    const newVehicle = {
      id: newId,
      type: vehicleData.type,
      brand: vehicleData.brand.trim(),
      model: vehicleData.model.trim(),
      rentalRatePerDay: parseFloat(vehicleData.rentalRatePerDay),
      isAvailable: true,
      specification,
      specValue: specVal,
      specLabel,
      imageUrl: vehicleData.imageUrl || DEFAULT_TYPE_IMAGES[type] || DEFAULT_TYPE_IMAGES.Car,
      tagline: `${type} Fleet Unit`,
    };

    const updated = [newVehicle, ...list];
    storage.setVehicles(updated);
    return newVehicle;
  },

  setAvailability: (id, isAvailable) => {
    const list = storage.getVehicles();
    const updated = list.map((v) => (v.id === id ? { ...v, isAvailable } : v));
    storage.setVehicles(updated);
    return updated.find((v) => v.id === id);
  },
};
