import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Calendar,
  Settings,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/pricing';

export default function Maintenance({
  maintenance = [],
  vehicles = [],
  onAddMaintenance,
  searchTerm = '',
  setSearchTerm,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    vehicleId: vehicles[0]?.id || 'V001',
    description: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    serviceCenter: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleOpenAddModal = () => {
    const maxNum = maintenance.reduce((max, m) => {
      const match = m.id.match(/\d+/);
      return match ? Math.max(max, parseInt(match[0], 10)) : max;
    }, 0);
    const nextId = `M${String(maxNum + 1).padStart(3, '0')}`;

    setFormData({
      id: nextId,
      vehicleId: vehicles[0]?.id || 'V001',
      description: '',
      date: new Date().toISOString().split('T')[0],
      cost: '1500',
      serviceCenter: 'Authorized Toyota Tech Care',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const filteredMaintenance = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    return maintenance.filter((m) => {
      return (
        m.id.toLowerCase().includes(q) ||
        m.vehicleId.toLowerCase().includes(q) ||
        m.vehicleName.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    });
  }, [maintenance, searchTerm]);

  const totalCost = maintenance.reduce(
    (sum, m) => sum + (Number(m.cost) || 0),
    0
  );
  const totalCount = maintenance.length;
  const avgCost = totalCount > 0 ? totalCost / totalCount : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.vehicleId) {
      errors.vehicleId = 'Please select a vehicle';
    }
    if (!formData.description.trim()) {
      errors.description = 'Maintenance description is required';
    }
    const cost = parseFloat(formData.cost);
    if (isNaN(cost) || cost < 0) {
      errors.cost = 'Cost must be a non-negative number';
    }
    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onAddMaintenance(formData);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Record ID',
      accessor: 'id',
      render: (m) => (
        <span className="font-mono font-bold text-xs text-[#F5F5F2] bg-[#1A2030] px-2.5 py-1 rounded-md border border-[#232B40]">
          {m.id}
        </span>
      ),
      width: '110px',
    },
    {
      header: 'Vehicle',
      render: (m) => (
        <div>
          <div className="font-bold text-[#F5F5F2] text-xs sm:text-sm">
            {m.vehicleName}
          </div>
          <div className="text-[11px] text-[#5E6678] font-mono">
            ID: {m.vehicleId}
          </div>
        </div>
      ),
    },
    {
      header: 'Service Description',
      render: (m) => (
        <div>
          <div className="font-medium text-[#F5F5F2] text-xs">
            {m.description}
          </div>
          {m.serviceCenter && (
            <div className="text-[11px] text-[#5E6678]">
              Center: {m.serviceCenter}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Service Date',
      render: (m) => (
        <span className="text-xs font-mono text-[#929AAA]">
          {m.date}
        </span>
      ),
      width: '130px',
    },
    {
      header: 'Cost',
      cellClassName: 'text-right',
      render: (m) => (
        <div className="font-bold text-[#F5F5F2] text-xs font-mono">
          {formatCurrency(m.cost)}
        </div>
      ),
      width: '140px',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131722] rounded-2xl p-5 border border-[#232B40] shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6678]">
              Fleet Maintenance Spend
            </span>
            <div className="text-2xl font-extrabold text-[#F5F5F2] mt-1 font-mono">
              {formatCurrency(totalCost)}
            </div>
            <span className="text-xs text-[#929AAA]">Cumulative repair expenditure</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2A1D0D] border border-[#664618] flex items-center justify-center text-[#D8A66A]">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#131722] rounded-2xl p-5 border border-[#232B40] shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6678]">
              Service Operations
            </span>
            <div className="text-2xl font-extrabold text-[#4D7CFE] mt-1 font-mono">
              {totalCount}
            </div>
            <span className="text-xs text-[#929AAA]">Total maintenance events</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#14203D] border border-[#233A6C] flex items-center justify-center text-[#4D7CFE]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#131722] rounded-2xl p-5 border border-[#232B40] shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6678]">
              Average Service Cost
            </span>
            <div className="text-2xl font-extrabold text-[#34D399] mt-1 font-mono">
              {formatCurrency(avgCost)}
            </div>
            <span className="text-xs text-[#929AAA]">Per maintenance operation</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0A2619] border border-[#134E35] flex items-center justify-center text-[#34D399]">
            <Settings className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action and Search Bar */}
      <div className="bg-[#131722] rounded-2xl p-4 sm:p-5 border border-[#232B40] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#5E6678] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search record ID, vehicle, description..."
            className="w-full pl-9 pr-4 py-2 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs text-[#F5F5F2] placeholder-[#5E6678] focus:outline-hidden focus:border-[#4D7CFE]"
          />
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white font-bold text-xs shadow-[0_0_15px_rgba(77,124,254,0.3)] transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>Log Service Event</span>
        </button>
      </div>

      {/* Maintenance Table */}
      <DataTable
        columns={columns}
        data={filteredMaintenance}
        emptyMessage="No maintenance logs found"
        emptySubtext="Click 'Log Service Event' to record a vehicle repair."
      />

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Vehicle Maintenance"
        subtitle="Create a Maintenance instance associated with a Vehicle"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              Record ID
            </label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full px-3 py-2 text-xs bg-[#0B0D12] border border-[#232B40] rounded-xl font-mono text-[#5E6678]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              Target Vehicle *
            </label>
            <select
              value={formData.vehicleId}
              onChange={(e) =>
                setFormData({ ...formData, vehicleId: e.target.value })
              }
              className="w-full py-2 px-3 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs font-semibold text-[#F5F5F2] focus:outline-hidden focus:border-[#4D7CFE]"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} — {v.brand} {v.model} ({v.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              Service Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g. Engine oil change & synthetic lube flush"
              className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl text-[#F5F5F2] focus:outline-hidden ${
                formErrors.description ? 'border-rose-500' : 'border-[#232B40] focus:border-[#4D7CFE]'
              }`}
            />
            {formErrors.description && (
              <p className="text-[10px] text-rose-400 mt-1">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#929AAA] mb-1">
                Service Cost (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                placeholder="1500"
                className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl font-mono text-[#F5F5F2] focus:outline-hidden ${
                  formErrors.cost ? 'border-rose-500' : 'border-[#232B40] focus:border-[#4D7CFE]'
                }`}
              />
              {formErrors.cost && (
                <p className="text-[10px] text-rose-400 mt-1">{formErrors.cost}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#929AAA] mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-[#0B0D12] border border-[#232B40] rounded-xl text-[#F5F5F2] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              Authorized Service Center
            </label>
            <input
              type="text"
              value={formData.serviceCenter}
              onChange={(e) =>
                setFormData({ ...formData, serviceCenter: e.target.value })
              }
              placeholder="e.g. Authorized Tech Center"
              className="w-full px-3 py-2 text-xs bg-[#0B0D12] border border-[#232B40] rounded-xl text-[#F5F5F2] focus:outline-hidden"
            />
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
              Save Service Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
