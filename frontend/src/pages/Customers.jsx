import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  History,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/pricing';

export default function Customers({
  customers = [],
  rentals = [],
  onAddCustomer,
  onViewCustomerRentals,
  searchTerm = '',
  setSearchTerm,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleOpenAddModal = () => {
    const maxNum = customers.reduce((max, c) => {
      const match = c.id.match(/\d+/);
      return match ? Math.max(max, parseInt(match[0], 10)) : max;
    }, 0);
    const nextId = `C${String(maxNum + 1).padStart(3, '0')}`;

    setFormData({
      id: nextId,
      name: '',
      phone: '',
      email: '',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const filteredCustomers = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    return customers.filter((c) => {
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    });
  }, [customers, searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim().replace(/\D/g, ''))) {
      errors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onAddCustomer(formData);
    setIsAddModalOpen(false);
  };

  const getCustomerRentals = (customerId) => {
    return rentals.filter((r) => r.customerId === customerId);
  };

  const columns = [
    {
      header: 'Customer ID',
      accessor: 'id',
      render: (c) => (
        <span className="font-mono font-bold text-xs text-[#F5F5F2] bg-[#1A2030] px-2.5 py-1 rounded-md border border-[#232B40]">
          {c.id}
        </span>
      ),
      width: '120px',
    },
    {
      header: 'Customer Name',
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#18233C] border border-[#2B437C] text-[#4D7CFE] font-bold text-xs flex items-center justify-center shrink-0 font-mono">
            {c.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-[#F5F5F2] text-xs sm:text-sm">
              {c.name}
            </div>
            <div className="text-[11px] text-[#5E6678] font-medium font-mono">
              Joined {c.registeredDate || '2026-08-10'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (c) => (
        <div className="flex items-center gap-1.5 text-xs text-[#F5F5F2] font-mono">
          <Phone className="w-3.5 h-3.5 text-[#5E6678]" />
          <span>{c.phone}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (c) => (
        <div className="flex items-center gap-1.5 text-xs text-[#929AAA]">
          <Mail className="w-3.5 h-3.5 text-[#5E6678]" />
          <span>{c.email}</span>
        </div>
      ),
    },
    {
      header: 'Bookings',
      render: (c) => {
        const count = getCustomerRentals(c.id).length;
        return (
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#1A2030] text-[#929AAA] border border-[#232B40]">
            {count} {count === 1 ? 'hire' : 'hires'}
          </span>
        );
      },
      width: '120px',
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (c) => (
        <button
          onClick={() => setSelectedCustomer(c)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#232B40] text-[#929AAA] hover:text-[#4D7CFE] hover:bg-[#1A2030] hover:border-[#333E5A] font-semibold text-xs transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>
      ),
      width: '110px',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-[#131722] rounded-2xl p-4 sm:p-5 border border-[#232B40] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#5E6678] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, phone, email, ID..."
            className="w-full pl-9 pr-4 py-2 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs text-[#F5F5F2] placeholder-[#5E6678] focus:outline-hidden focus:border-[#4D7CFE]"
          />
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white font-bold text-xs shadow-[0_0_15px_rgba(77,124,254,0.3)] transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>Register Customer</span>
        </button>
      </div>

      {/* Main Customers Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        emptyMessage="No customer records match your query"
        emptySubtext="Try adjusting the search query or register a new customer."
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Customer"
        subtitle="Create a verified Customer instance in the system"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              Customer ID
            </label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full px-3 py-2 text-xs bg-[#0B0D12] border border-[#232B40] rounded-xl font-mono text-[#5E6678]"
            />
            <p className="text-[10px] text-[#5E6678] mt-1 font-mono">
              Auto-generated sequential ID
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Rahul Sharma"
              className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl text-[#F5F5F2] focus:outline-hidden ${
                formErrors.name ? 'border-rose-500' : 'border-[#232B40] focus:border-[#4D7CFE]'
              }`}
            />
            {formErrors.name && (
              <p className="text-[10px] text-rose-400 mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              Phone Number (10 digits) *
            </label>
            <input
              type="tel"
              maxLength={10}
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, ''),
                })
              }
              placeholder="9876543210"
              className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl font-mono text-[#F5F5F2] focus:outline-hidden ${
                formErrors.phone ? 'border-rose-500' : 'border-[#232B40] focus:border-[#4D7CFE]'
              }`}
            />
            {formErrors.phone && (
              <p className="text-[10px] text-rose-400 mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="rahul.sharma@example.com"
              className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl text-[#F5F5F2] focus:outline-hidden ${
                formErrors.email ? 'border-rose-500' : 'border-[#232B40] focus:border-[#4D7CFE]'
              }`}
            />
            {formErrors.email && (
              <p className="text-[10px] text-rose-400 mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="pt-4 border-t border-[#1E2536] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#929AAA] hover:bg-[#1A2030] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white shadow-xs transition-colors"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          subtitle={`Client Account Profile • ID: ${selectedCustomer.id}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#232B40] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#5E6678] font-bold block text-[9px] uppercase tracking-wider">
                  Contact Phone
                </span>
                <span className="font-mono font-bold text-[#F5F5F2] mt-0.5 block">
                  {selectedCustomer.phone}
                </span>
              </div>
              <div>
                <span className="text-[#5E6678] font-bold block text-[9px] uppercase tracking-wider">
                  Email Address
                </span>
                <span className="font-medium text-[#F5F5F2] mt-0.5 block truncate">
                  {selectedCustomer.email}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#929AAA] mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#4D7CFE]" />
                <span>Customer Rental Record</span>
              </h4>

              {(() => {
                const history = getCustomerRentals(selectedCustomer.id);
                if (history.length === 0) {
                  return (
                    <div className="p-6 text-center bg-[#0B0D12] rounded-xl border border-dashed border-[#232B40] text-xs text-[#5E6678]">
                      No vehicle hires on record for this customer.
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-[#1A2234] border border-[#232B40] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                    {history.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 text-xs bg-[#0B0D12] hover:bg-[#151C2C] transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#4D7CFE]">
                              {r.id}
                            </span>
                            <span className="font-semibold text-[#F5F5F2]">
                              {r.vehicleName}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#5E6678] mt-0.5 font-mono">
                            {r.days} days • Booked on {r.rentDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#F5F5F2] font-mono">
                            {formatCurrency(r.totalCost)}
                          </div>
                          <StatusBadge status={r.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="pt-3 border-t border-[#1E2536] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#929AAA] hover:bg-[#1A2030] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
