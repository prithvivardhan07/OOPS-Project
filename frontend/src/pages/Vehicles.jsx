import React, { useState, useMemo } from 'react';
import {
  Car,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  KeyRound,
  Eye,
  Info,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/pricing';

export default function Vehicles({
  vehicles = [],
  onAddVehicle,
  onRentVehicle,
  searchTerm = '',
  setSearchTerm,
}) {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    type: 'Car',
    brand: '',
    model: '',
    rentalRatePerDay: '',
    specValue: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const resetForm = () => {
    const maxNum = vehicles.reduce((max, v) => {
      const match = v.id.match(/\d+/);
      return match ? Math.max(max, parseInt(match[0], 10)) : max;
    }, 0);
    const nextId = `V${String(maxNum + 1).padStart(3, '0')}`;

    setFormData({
      id: nextId,
      type: 'Car',
      brand: '',
      model: '',
      rentalRatePerDay: '2000',
      specValue: '5',
    });
    setFormErrors({});
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleTypeChange = (newType) => {
    let defaultRate = '2000';
    let defaultSpec = '5';
    if (newType === 'Bike') {
      defaultRate = '800';
      defaultSpec = '155';
    } else if (newType === 'Bus') {
      defaultRate = '5000';
      defaultSpec = '45';
    } else if (newType === 'Truck') {
      defaultRate = '6000';
      defaultSpec = '10';
    }
    setFormData((prev) => ({
      ...prev,
      type: newType,
      rentalRatePerDay: defaultRate,
      specValue: defaultSpec,
    }));
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = (searchTerm || '').toLowerCase();
      const matchesSearch =
        v.id.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q);

      const matchesType =
        selectedType === 'All' || v.type.toLowerCase() === selectedType.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Available' && v.isAvailable) ||
        (selectedStatus === 'Rented' && !v.isAvailable);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, searchTerm, selectedType, selectedStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.id.trim()) {
      errors.id = 'Vehicle ID is required';
    }
    if (!formData.brand.trim()) {
      errors.brand = 'Brand is required';
    }
    if (!formData.model.trim()) {
      errors.model = 'Model is required';
    }
    const rate = parseFloat(formData.rentalRatePerDay);
    if (isNaN(rate) || rate <= 0) {
      errors.rentalRatePerDay = 'Rental rate must be a positive number';
    }
    const spec = parseFloat(formData.specValue);
    if (isNaN(spec) || spec <= 0) {
      errors.specValue = 'Specification value must be positive';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onAddVehicle(formData);
    setIsAddModalOpen(false);
  };

  // Table columns
  const columns = [
    {
      header: 'Vehicle',
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 rounded-lg overflow-hidden bg-[#0B0D12] shrink-0 border border-[#232B40]">
            <img
              src={v.imageUrl}
              alt={v.model}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
          <div>
            <div className="font-bold text-[#F5F5F2] text-xs sm:text-sm">
              {v.brand} {v.model}
            </div>
            <div className="text-[11px] text-[#929AAA]">
              {v.specification}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'ID',
      accessor: 'id',
      render: (v) => (
        <span className="font-mono font-bold text-xs text-[#F5F5F2] bg-[#1A2030] px-2.5 py-1 rounded-md border border-[#232B40]">
          {v.id}
        </span>
      ),
      width: '100px',
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (v) => <StatusBadge status={v.type} />,
      width: '110px',
    },
    {
      header: 'Daily Rate',
      render: (v) => (
        <div className="font-mono font-bold text-[#F5F5F2] text-xs">
          {formatCurrency(v.rentalRatePerDay)}
          <span className="text-[10px] text-[#5E6678] font-normal"> / day</span>
        </div>
      ),
      width: '140px',
    },
    {
      header: 'Availability',
      render: (v) => <StatusBadge status={v.isAvailable ? 'Available' : 'Rented'} />,
      width: '130px',
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (v) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedVehicleDetails(v)}
            className="p-1.5 rounded-lg border border-[#232B40] text-[#929AAA] hover:text-[#F5F5F2] hover:bg-[#1A2030] transition-colors"
            title="Inspect"
          >
            <Eye className="w-4 h-4" />
          </button>
          {v.isAvailable ? (
            <button
              onClick={() => onRentVehicle && onRentVehicle(v.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white font-bold text-xs shadow-xs transition-all"
            >
              <KeyRound className="w-3 h-3" />
              <span>Rent</span>
            </button>
          ) : (
            <span className="text-[10px] text-[#5E6678] font-mono px-2 py-1 uppercase tracking-wider">
              On Road
            </span>
          )}
        </div>
      ),
      width: '140px',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Toolbar */}
      <div className="bg-[#131722] rounded-2xl p-4 sm:p-5 border border-[#232B40] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#5E6678] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, brand, model..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs text-[#F5F5F2] placeholder-[#5E6678] focus:outline-hidden focus:border-[#4D7CFE]"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5E6678] font-medium hidden sm:inline">
              Type:
            </span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-2 px-3 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs font-semibold text-[#F5F5F2] focus:outline-hidden focus:border-[#4D7CFE]"
            >
              <option value="All">All Types</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Bus">Bus</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5E6678] font-medium hidden sm:inline">
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs font-semibold text-[#F5F5F2] focus:outline-hidden focus:border-[#4D7CFE]"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
            </select>
          </div>
        </div>

        {/* View Toggle & Add Vehicle Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-[#0B0D12] rounded-xl border border-[#232B40]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#1A2030] text-[#4D7CFE]'
                  : 'text-[#5E6678] hover:text-[#F5F5F2]'
              }`}
              title="Showcase Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#1A2030] text-[#4D7CFE]'
                  : 'text-[#5E6678] hover:text-[#F5F5F2]'
              }`}
              title="Fleet Table"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white font-bold text-xs shadow-[0_0_15px_rgba(77,124,254,0.3)] transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Grid or Table Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="automotive-card group bg-[#131722] rounded-2xl border border-[#232B40] hover:border-[#333E5A] overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300"
            >
              {/* Image with 16:10 aspect */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B0D12]">
                <img
                  src={v.imageUrl}
                  alt={`${v.brand} ${v.model}`}
                  className="vehicle-img w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-[#131722]/30 to-transparent" />

                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <span className="font-mono text-[10px] font-bold text-[#F5F5F2] bg-[#0B0D12]/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#232B40]">
                    {v.id}
                  </span>
                  <StatusBadge status={v.isAvailable ? 'Available' : 'Rented'} />
                </div>

                <div className="absolute bottom-2 left-3 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#929AAA] bg-[#0B0D12]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-[#232B40]">
                    {v.type}
                  </span>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F5F5F2] group-hover:text-[#4D7CFE] transition-colors tracking-tight">
                    {v.brand} {v.model}
                  </h4>
                  <p className="text-[11px] text-[#929AAA] mt-0.5 font-medium">
                    {v.specification}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E2536] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#5E6678] block">
                      Daily Rate
                    </span>
                    <span className="text-sm font-bold text-[#F5F5F2] font-mono">
                      {formatCurrency(v.rentalRatePerDay)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVehicleDetails(v)}
                      className="p-1.5 rounded-lg border border-[#232B40] text-[#929AAA] hover:text-[#F5F5F2] hover:bg-[#1A2030] transition-colors"
                      title="Inspect Specs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {v.isAvailable && (
                      <button
                        onClick={() => onRentVehicle && onRentVehicle(v.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Rent</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredVehicles}
          emptyMessage="No vehicles match your filters"
          emptySubtext="Try adjusting the vehicle type or status filter."
        />
      )}

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Vehicle to Fleet"
        subtitle="Instantiate a new Car, Bike, Bus, or Truck subclass object"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#929AAA] mb-1.5">
              Select Vehicle Subclass
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Car', 'Bike', 'Bus', 'Truck'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    formData.type === t
                      ? 'bg-[#16223D] text-[#4D7CFE] border-[#2B437C] shadow-xs'
                      : 'bg-[#0B0D12] text-[#929AAA] border-[#232B40] hover:bg-[#1A2030]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#929AAA] mb-1">
                Vehicle ID *
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value.toUpperCase() })
                }
                placeholder="V005"
                className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl font-mono text-[#F5F5F2] focus:outline-hidden ${
                  formErrors.id ? 'border-rose-500' : 'border-[#232B40] focus:border-[#4D7CFE]'
                }`}
              />
              {formErrors.id && (
                <p className="text-[10px] text-rose-400 mt-1">{formErrors.id}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#929AAA] mb-1">
                Daily Rate (₹) *
              </label>
              <input
                type="number"
                step="50"
                min="100"
                value={formData.rentalRatePerDay}
                onChange={(e) =>
                  setFormData({ ...formData, rentalRatePerDay: e.target.value })
                }
                placeholder="2000"
                className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl font-mono text-[#F5F5F2] focus:outline-hidden ${
                  formErrors.rentalRatePerDay
                    ? 'border-rose-500'
                    : 'border-[#232B40] focus:border-[#4D7CFE]'
                }`}
              />
              {formErrors.rentalRatePerDay && (
                <p className="text-[10px] text-rose-400 mt-1">
                  {formErrors.rentalRatePerDay}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#929AAA] mb-1">
                Brand / Make *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="Toyota, Yamaha, Tata"
                className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl text-[#F5F5F2] focus:outline-hidden ${
                  formErrors.brand
                    ? 'border-rose-500'
                    : 'border-[#232B40] focus:border-[#4D7CFE]'
                }`}
              />
              {formErrors.brand && (
                <p className="text-[10px] text-rose-400 mt-1">{formErrors.brand}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#929AAA] mb-1">
                Model Name *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="Corolla, R15, Prima"
                className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl text-[#F5F5F2] focus:outline-hidden ${
                  formErrors.model
                    ? 'border-rose-500'
                    : 'border-[#232B40] focus:border-[#4D7CFE]'
                }`}
              />
              {formErrors.model && (
                <p className="text-[10px] text-rose-400 mt-1">{formErrors.model}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#929AAA] mb-1">
              {formData.type === 'Car' && 'Seating Capacity (e.g. 5 seats)'}
              {formData.type === 'Bike' && 'Engine Capacity (e.g. 155 cc)'}
              {formData.type === 'Bus' && 'Passenger Capacity (e.g. 45 seats)'}
              {formData.type === 'Truck' && 'Payload Capacity (e.g. 10.0 tons)'} *
            </label>
            <input
              type="number"
              step={formData.type === 'Truck' ? '0.5' : '1'}
              min="1"
              value={formData.specValue}
              onChange={(e) =>
                setFormData({ ...formData, specValue: e.target.value })
              }
              placeholder="5"
              className={`w-full px-3 py-2 text-xs bg-[#0B0D12] border rounded-xl font-mono text-[#F5F5F2] focus:outline-hidden ${
                formErrors.specValue
                  ? 'border-rose-500'
                  : 'border-[#232B40] focus:border-[#4D7CFE]'
              }`}
            />
            {formErrors.specValue && (
              <p className="text-[10px] text-rose-400 mt-1">
                {formErrors.specValue}
              </p>
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
              Save Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* Vehicle Details Modal */}
      {selectedVehicleDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedVehicleDetails(null)}
          title={`${selectedVehicleDetails.brand} ${selectedVehicleDetails.model}`}
          subtitle={`Fleet Asset Profile • ID: ${selectedVehicleDetails.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            {/* Header image preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#232B40] bg-[#0B0D12]">
              <img
                src={selectedVehicleDetails.imageUrl}
                alt={selectedVehicleDetails.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <StatusBadge status={selectedVehicleDetails.type} />
                <span className="font-mono text-xs font-bold text-[#F5F5F2] bg-[#0B0D12]/80 px-2 py-0.5 rounded border border-[#232B40]">
                  {selectedVehicleDetails.id}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <StatusBadge
                  status={selectedVehicleDetails.isAvailable ? 'Available' : 'Rented'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#232B40]">
                <span className="text-[#5E6678] font-bold block uppercase text-[9px] tracking-wider">
                  Daily Rental Rate
                </span>
                <span className="text-base font-extrabold text-[#F5F5F2] mt-0.5 block font-mono">
                  {formatCurrency(selectedVehicleDetails.rentalRatePerDay)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#232B40]">
                <span className="text-[#5E6678] font-bold block uppercase text-[9px] tracking-wider">
                  Specification
                </span>
                <span className="text-base font-bold text-[#F5F5F2] mt-0.5 block">
                  {selectedVehicleDetails.specification}
                </span>
              </div>
            </div>

            {/* OOP Pricing breakdown note */}
            <div className="p-3.5 rounded-xl bg-[#0E1729] border border-[#1E335C] text-xs text-[#929AAA]">
              <div className="flex items-center gap-1.5 font-bold text-[#4D7CFE] mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>Polymorphic Pricing Logic (`calculateRent`)</span>
              </div>
              {selectedVehicleDetails.type === 'Car' && (
                <p className="text-[11px] leading-relaxed">
                  Car.java: Charged straight daily rate (₹{selectedVehicleDetails.rentalRatePerDay}/day). No surcharge.
                </p>
              )}
              {selectedVehicleDetails.type === 'Bike' && (
                <p className="text-[11px] leading-relaxed">
                  Bike.java: ₹{selectedVehicleDetails.rentalRatePerDay}/day. 5% discount automatically applied for bookings ≥7 days.
                </p>
              )}
              {selectedVehicleDetails.type === 'Bus' && (
                <p className="text-[11px] leading-relaxed">
                  Bus.java: ₹{selectedVehicleDetails.rentalRatePerDay}/day + mandatory ₹500/day driver allowance.
                </p>
              )}
              {selectedVehicleDetails.type === 'Truck' && (
                <p className="text-[11px] leading-relaxed">
                  Truck.java: ₹{selectedVehicleDetails.rentalRatePerDay}/day + fixed ₹1,000 one-time loading charge.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#1E2536] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedVehicleDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#929AAA] hover:bg-[#1A2030] transition-colors"
              >
                Close
              </button>
              {selectedVehicleDetails.isAvailable && (
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedVehicleDetails.id;
                    setSelectedVehicleDetails(null);
                    onRentVehicle && onRentVehicle(id);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Dispatch Rental</span>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
