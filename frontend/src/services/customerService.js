import { storage } from './storage';

export const customerService = {
  getAll: () => {
    return storage.getCustomers();
  },

  getById: (id) => {
    const list = storage.getCustomers();
    return list.find((c) => c.id === id) || null;
  },

  create: (customerData) => {
    const list = storage.getCustomers();

    let newId = customerData.id;
    if (!newId) {
      const maxNum = list.reduce((max, c) => {
        const match = c.id.match(/\d+/);
        return match ? Math.max(max, parseInt(match[0], 10)) : max;
      }, 0);
      newId = `C${String(maxNum + 1).padStart(3, '0')}`;
    }

    const today = new Date().toISOString().split('T')[0];

    const newCustomer = {
      id: newId,
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      email: customerData.email.trim(),
      registeredDate: customerData.registeredDate || today,
    };

    const updated = [newCustomer, ...list];
    storage.setCustomers(updated);
    return newCustomer;
  },
};
