import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  Calendar,
  CreditCard,
  User,
  Car,
  AlertCircle,
  CheckCircle2,
  Receipt,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { calculateRentalCost, formatCurrency } from '../utils/pricing';

export default function Rentals({
  vehicles = [],
  customers = [],
  rentals = [],
  onBookRental,
  onReturnRental,
  preselectedVehicleId = null,
  onClearPreselectedVehicle,
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id || ''
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    preselectedVehicleId || vehicles.find((v) => v.isAvailable)?.id || ''
  );
  const [rentalDays, setRentalDays] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [rentalToReturn, setRentalToReturn] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.isAvailable),
    [vehicles]
  );

  const activeVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId),
    [vehicles, selectedVehicleId]
  );

  const activeCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  const livePricing = useMemo(() => {
    if (!activeVehicle) return null;
    return calculateRentalCost(activeVehicle, rentalDays);
  }, [activeVehicle, rentalDays]);

  const activeRentals = useMemo(
    () => rentals.filter((r) => !r.isCompleted),
    [rentals]
  );

  const handleProceedToConfirmation = (e) => {
    e.preventDefault();
    if (!activeVehicle || !activeVehicle.isAvailable) {
      alert('Please select an available vehicle.');
      return;
    }
    if (!activeCustomer) {
      alert('Please select a customer.');
      return;
    }
    if (rentalDays < 1) {
      alert('Duration must be at least 1 day.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    try {
      const result = onBookRental({
        customerId: selectedCustomerId,
        vehicleId: selectedVehicleId,
        days: rentalDays,
        paymentMethod,
      });

      setIsConfirmModalOpen(false);
      setBookingResult(result);

      const remainingAvailable = vehicles.filter(
        (v) => v.isAvailable && v.id !== selectedVehicleId
      );
      if (remainingAvailable.length > 0) {
        setSelectedVehicleId(remainingAvailable[0].id);
      } else {
        setSelectedVehicleId('');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmReturn = () => {
    if (!rentalToReturn) return;
    onReturnRental(rentalToReturn.id);
    setRentalToReturn(null);
  };

  const activeColumns = [
    {
      header: 'Rental ID',
      accessor: 'id',
      render: (r) => (
        <span className="font-mono font-bold text-xs text-[#4D7CFE] bg-[#14203D] px-2.5 py-1 rounded-md border border-[#233A6C]">
          {r.id}
        </span>
      ),
      width: '110px',
    },
    {
      header: 'Customer',
      render: (r) => (
        <div>
          <div className="font-bold text-[#F5F5F2] text-xs sm:text-sm">
            {r.customerName}
          </div>
          <div className="text-[11px] text-[#5E6678] font-mono">
            ID: {r.customerId}
          </div>
        </div>
      ),
    },
    {
      header: 'Vehicle',
      render: (r) => (
        <div>
          <div className="font-semibold text-[#F5F5F2] text-xs">
            {r.vehicleName}
          </div>
          <div className="text-[11px] text-[#5E6678] font-mono">
            {r.vehicleId}
          </div>
        </div>
      ),
    },
    {
      header: 'Dispatch Date',
      render: (r) => (
        <span className="text-xs text-[#929AAA] font-mono">
          {r.rentDate}
        </span>
      ),
      width: '120px',
    },
    {
      header: 'Duration',
      render: (r) => (
        <span className="text-xs font-semibold text-[#F5F5F2] font-mono">
          {r.days} {r.days === 1 ? 'day' : 'days'}
        </span>
      ),
      width: '110px',
    },
    {
      header: 'Cost Preview',
      render: (r) => (
        <div>
          <div className="font-bold text-[#F5F5F2] text-xs font-mono">
            {formatCurrency(r.totalCost)}
          </div>
          <div className="text-[10px] text-[#5E6678] uppercase tracking-wider font-mono">
            Via {r.paymentMethod || 'Cash'}
          </div>
        </div>
      ),
      width: '130px',
    },
    {
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
      width: '110px',
    },
    {
      header: 'Action',
      cellClassName: 'text-right',
      render: (r) => (
        <button
          onClick={() => setRentalToReturn(r)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A2619] text-[#34D399] hover:bg-[#10B981] hover:text-[#0B0D12] font-bold text-xs border border-[#134E35] transition-all ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Return Vehicle</span>
        </button>
      ),
      width: '150px',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Booking Dispatch Module */}
      <div className="bg-[#131722] rounded-3xl p-6 sm:p-8 border border-[#232B40] shadow-2xl relative overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4D7CFE]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#1E2536] gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#16223D] text-[#4D7CFE] text-xs font-semibold mb-1 border border-[#2B437C]">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Rental Dispatch Counter</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#F5F5F2] tracking-tight">
              Create New Vehicle Rental
            </h2>
          </div>
          <div className="text-xs text-[#929AAA] font-mono">
            <strong className="text-[#34D399]">{availableVehicles.length}</strong> of {vehicles.length} units ready
          </div>
        </div>

        <form onSubmit={handleProceedToConfirmation}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Customer Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#929AAA] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#4D7CFE]" />
                    <span>Select Client *</span>
                  </span>
                  <span className="text-[#5E6678] font-mono">
                    {customers.length} verified
                  </span>
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs font-semibold text-[#F5F5F2] focus:outline-hidden focus:border-[#4D7CFE]"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) — {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#929AAA] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#4D7CFE]" />
                    <span>Select Available Vehicle *</span>
                  </span>
                  <span className="text-[#34D399] font-mono">
                    {availableVehicles.length} available
                  </span>
                </label>
                {availableVehicles.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-[#2A1D0D] border border-[#664618] text-xs text-[#D8A66A] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      All fleet vehicles are currently rented! Complete a return before booking.
                    </span>
                  </div>
                ) : (
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full py-2.5 px-3 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs font-semibold text-[#F5F5F2] focus:outline-hidden focus:border-[#4D7CFE]"
                  >
                    {availableVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.id} — {v.brand} {v.model} ({v.type}) — {formatCurrency(v.rentalRatePerDay)}/day ({v.specification})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Duration and Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#929AAA] mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#4D7CFE]" />
                    <span>Rental Duration (Days) *</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#232B40] font-bold text-[#F5F5F2] hover:bg-[#1A2030] transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={rentalDays}
                      onChange={(e) =>
                        setRentalDays(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      className="w-full text-center py-2 bg-[#0B0D12] border border-[#232B40] rounded-xl font-bold font-mono text-sm text-[#F5F5F2] focus:outline-hidden focus:border-[#4D7CFE]"
                    />
                    <button
                      type="button"
                      onClick={() => setRentalDays(rentalDays + 1)}
                      className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#232B40] font-bold text-[#F5F5F2] hover:bg-[#1A2030] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#929AAA] mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#4D7CFE]" />
                    <span>Payment Method *</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Cash', 'Card', 'UPI'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          paymentMethod === m
                            ? 'bg-[#16223D] text-[#4D7CFE] border-[#2B437C] shadow-xs'
                            : 'bg-[#0B0D12] text-[#929AAA] border-[#232B40] hover:bg-[#1A2030]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live Cost Preview Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-[#0B0D12] rounded-2xl border border-[#232B40] shadow-inner">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2536] mb-4">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#4D7CFE]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#929AAA]">
                      Live Cost Calculation
                    </span>
                  </div>
                  {activeVehicle && <StatusBadge status={activeVehicle.type} />}
                </div>

                {activeVehicle ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-[#131722] rounded-xl border border-[#232B40] text-xs">
                      <div className="font-bold text-[#F5F5F2]">
                        {activeVehicle.brand} {activeVehicle.model}
                      </div>
                      <div className="text-[11px] text-[#5E6678] font-mono mt-0.5">
                        ID: {activeVehicle.id} • {activeVehicle.specification}
                      </div>
                    </div>

                    {/* Breakdown lines */}
                    <div className="space-y-2 pt-2">
                      {livePricing?.breakdownLines.map((line, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs"
                        >
                          <span
                            className={
                              line.type === 'discount'
                                ? 'text-[#34D399] font-medium'
                                : 'text-[#929AAA] font-medium'
                            }
                          >
                            {line.label}
                          </span>
                          <span
                            className={`font-mono font-semibold ${
                              line.type === 'discount'
                                ? 'text-[#34D399]'
                                : 'text-[#F5F5F2]'
                            }`}
                          >
                            {line.amount < 0 ? '-' : ''}
                            {formatCurrency(Math.abs(line.amount))}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1E2536] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F5F5F2]">
                        Total Rental Cost
                      </span>
                      <span className="text-2xl font-extrabold text-[#4D7CFE] font-mono">
                        {livePricing?.formattedTotal}
                      </span>
                    </div>

                    <div className="mt-3 p-2.5 rounded-xl bg-[#131722] text-[11px] text-[#929AAA] leading-snug border border-[#232B40] flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#4D7CFE]" />
                      <div>
                        {activeVehicle.type === 'Car' && (
                          <span>Standard rate per day applied.</span>
                        )}
                        {activeVehicle.type === 'Bike' && (
                          <span>5% discount applied for bookings ≥7 days.</span>
                        )}
                        {activeVehicle.type === 'Bus' && (
                          <span>Mandatory ₹500/day driver allowance included.</span>
                        )}
                        {activeVehicle.type === 'Truck' && (
                          <span>Flat ₹1,000 loading/unloading charge added.</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#5E6678] py-8 text-center font-mono">
                    Select an available vehicle to calculate rental cost.
                  </p>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-[#1E2536]">
                <button
                  type="submit"
                  disabled={availableVehicles.length === 0 || !activeVehicle}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm ${
                    availableVehicles.length === 0 || !activeVehicle
                      ? 'bg-[#1A2030] text-[#5E6678] cursor-not-allowed'
                      : 'bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white shadow-[0_0_15px_rgba(77,124,254,0.35)] hover:scale-[1.01]'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Review & Dispatch Rental</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Currently Active Hires Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#F5F5F2] tracking-wider uppercase">
              Active Fleet Hires
            </h3>
            <p className="text-xs text-[#929AAA]">
              Vehicles currently deployed with customers
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#16223D] text-[#4D7CFE] border border-[#2B437C]">
            {activeRentals.length} Active Hires
          </span>
        </div>

        <DataTable
          columns={activeColumns}
          data={activeRentals}
          emptyMessage="No vehicles currently rented"
          emptySubtext="Dispatch a vehicle using the rental counter above."
        />
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && activeVehicle && activeCustomer && livePricing && (
        <Modal
          isOpen={true}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm Rental Dispatch"
          subtitle="Review booking details before committing transaction"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#232B40] space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Customer:</span>
                <span className="font-bold text-[#F5F5F2]">
                  {activeCustomer.name} ({activeCustomer.id})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Vehicle:</span>
                <span className="font-bold text-[#F5F5F2]">
                  {activeVehicle.brand} {activeVehicle.model} ({activeVehicle.id})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Category:</span>
                <StatusBadge status={activeVehicle.type} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Duration:</span>
                <span className="font-mono font-bold text-[#F5F5F2]">
                  {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Payment Method:</span>
                <span className="font-semibold text-[#F5F5F2]">
                  {paymentMethod}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#1E2536] flex justify-between text-sm">
                <span className="font-bold text-[#F5F5F2]">Total Charge:</span>
                <span className="font-mono font-extrabold text-[#4D7CFE]">
                  {livePricing.formattedTotal}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#5E6678] italic">
              * The vehicle status will be updated to Rented across the system.
            </p>

            <div className="pt-3 border-t border-[#1E2536] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#929AAA] hover:bg-[#1A2030] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Dispatch</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Return Confirmation Modal */}
      {rentalToReturn && (
        <Modal
          isOpen={true}
          onClose={() => setRentalToReturn(null)}
          title="Confirm Vehicle Return"
          subtitle={`Process return for Rental #${rentalToReturn.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#2A1D0D]/60 border border-[#664618]/60 text-xs space-y-2">
              <p className="font-medium text-[#D8A66A]">
                Confirm receiving vehicle back to the rental facility?
              </p>
              <div className="text-[#F5F5F2] pt-1 space-y-1">
                <div><strong>Rental ID:</strong> <span className="font-mono">{rentalToReturn.id}</span></div>
                <div><strong>Vehicle:</strong> {rentalToReturn.vehicleName}</div>
                <div><strong>Customer:</strong> {rentalToReturn.customerName}</div>
                <div><strong>Paid:</strong> <span className="font-mono">{formatCurrency(rentalToReturn.totalCost)}</span></div>
              </div>
            </div>

            <p className="text-[11px] text-[#5E6678]">
              The vehicle will automatically be restored to <strong>Available</strong> status in the fleet inventory.
            </p>

            <div className="pt-3 border-t border-[#1E2536] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRentalToReturn(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#929AAA] hover:bg-[#1A2030] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#10B981] hover:bg-[#059669] text-[#0B0D12] shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Return</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Booking Success Modal */}
      {bookingResult && (
        <Modal
          isOpen={true}
          onClose={() => setBookingResult(null)}
          title="Rental Dispatched Successfully"
          subtitle="Transaction recorded in persistent storage"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#0A2619] border border-[#134E35] text-[#34D399] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#F5F5F2] font-mono">
                Rental #{bookingResult.rental.id}
              </h4>
              <p className="text-xs text-[#929AAA]">
                Issued to {bookingResult.rental.customerName}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#232B40] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5E6678]">Vehicle:</span>
                <span className="font-semibold text-[#F5F5F2]">
                  {bookingResult.rental.vehicleName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6678]">Duration:</span>
                <span className="font-mono text-[#F5F5F2]">
                  {bookingResult.rental.days} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6678]">Payment:</span>
                <span className="font-semibold text-[#F5F5F2]">
                  {bookingResult.rental.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#1E2536] pt-2 font-bold">
                <span>Total Billed:</span>
                <span className="text-[#4D7CFE] font-mono text-sm">
                  {formatCurrency(bookingResult.rental.totalCost)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2536] flex justify-end">
              <button
                type="button"
                onClick={() => setBookingResult(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white shadow-xs transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
