import { storage } from './storage';

export const maintenanceService = {
  getAll: () => {
    return storage.getMaintenance();
  },

  create: (recordData) => {
    const list = storage.getMaintenance();
    const vehicles = storage.getVehicles();

    let newId = recordData.id;
    if (!newId) {
      const maxNum = list.reduce((max, m) => {
        const match = m.id.match(/\d+/);
        return match ? Math.max(max, parseInt(match[0], 10)) : max;
      }, 0);
      newId = `M${String(maxNum + 1).padStart(3, '0')}`;
    }

    const vehicle = vehicles.find((v) => v.id === recordData.vehicleId);
    const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : recordData.vehicleId;

    const today = new Date().toISOString().split('T')[0];

    const newRecord = {
      id: newId,
      vehicleId: recordData.vehicleId,
      vehicleName,
      description: recordData.description.trim(),
      date: recordData.date || today,
      cost: Math.max(0, parseFloat(recordData.cost) || 0),
      serviceCenter: recordData.serviceCenter ? recordData.serviceCenter.trim() : 'Internal Garage',
    };

    const updated = [newRecord, ...list];
    storage.setMaintenance(updated);
    return newRecord;
  },

  getSummary: () => {
    const list = storage.getMaintenance();
    const totalCost = list.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
    const count = list.length;
    const avgCost = count > 0 ? totalCost / count : 0;

    return {
      totalCost,
      count,
      avgCost,
    };
  },
};
