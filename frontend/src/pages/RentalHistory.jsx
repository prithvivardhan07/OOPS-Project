import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  RotateCcw,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/pricing';

export default function RentalHistory({
  rentals = [],
  onReturnRental,
  searchTerm = '',
  setSearchTerm,
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRentalDetails, setSelectedRentalDetails] = useState(null);
  const [rentalToReturn, setRentalToReturn] = useState(null);

  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      const q = (searchTerm || '').toLowerCase();
      const matchesSearch =
        r.id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.vehicleName.toLowerCase().includes(q) ||
        r.vehicleId.toLowerCase().includes(q) ||
        r.customerId.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && !r.isCompleted) ||
        (statusFilter === 'Returned' && r.isCompleted);

      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchTerm, statusFilter]);

  const totalRevenue = rentals.reduce(
    (sum, r) => sum + (Number(r.totalCost) || 0),
    0
  );
  const activeCount = rentals.filter((r) => !r.isCompleted).length;
  const returnedCount = rentals.filter((r) => r.isCompleted).length;

  const handleConfirmReturn = () => {
    if (!rentalToReturn) return;
    onReturnRental(rentalToReturn.id);
    setRentalToReturn(null);
  };

  const columns = [
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
            {r.vehicleId} • {r.vehicleType}
          </div>
        </div>
      ),
    },
    {
      header: 'Duration',
      render: (r) => (
        <span className="text-xs font-semibold text-[#F5F5F2] font-mono">
          {r.days} {r.days === 1 ? 'day' : 'days'}
        </span>
      ),
      width: '100px',
    },
    {
      header: 'Amount',
      render: (r) => (
        <div>
          <div className="font-bold text-[#F5F5F2] text-xs font-mono">
            {formatCurrency(r.totalCost)}
          </div>
          <div className="text-[10px] text-[#5E6678] uppercase tracking-wider font-mono">
            {r.paymentMethod || 'Cash'}
          </div>
        </div>
      ),
      width: '130px',
    },
    {
      header: 'Timeline',
      render: (r) => (
        <div className="text-[11px] font-mono text-[#929AAA]">
          <div>Start: {r.rentDate}</div>
          <div className="text-[#5E6678]">
            End: {r.returnDate !== '-' ? r.returnDate : 'Active'}
          </div>
        </div>
      ),
      width: '140px',
    },
    {
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
      width: '120px',
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          {!r.isCompleted && (
            <button
              onClick={() => setRentalToReturn(r)}
              className="px-2.5 py-1 rounded-lg bg-[#0A2619] text-[#34D399] hover:bg-[#10B981] hover:text-[#0B0D12] font-bold text-xs border border-[#134E35] transition-all"
            >
              Return
            </button>
          )}
          <button
            onClick={() => setSelectedRentalDetails(r)}
            className="p-1.5 rounded-lg border border-[#232B40] text-[#929AAA] hover:text-[#F5F5F2] hover:bg-[#1A2030] transition-colors"
            title="Receipt"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      ),
      width: '130px',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131722] rounded-2xl p-5 border border-[#232B40] shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6678]">
              Total Rental Volume
            </span>
            <div className="text-2xl font-extrabold text-[#F5F5F2] mt-1 font-mono">
              {formatCurrency(totalRevenue)}
            </div>
            <span className="text-xs text-[#929AAA]">
              Across {rentals.length} logged bookings
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#14203D] border border-[#233A6C] flex items-center justify-center text-[#4D7CFE]">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#131722] rounded-2xl p-5 border border-[#232B40] shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6678]">
              Active Hires
            </span>
            <div className="text-2xl font-extrabold text-[#D8A66A] mt-1 font-mono">
              {activeCount}
            </div>
            <span className="text-xs text-[#929AAA]">
              Currently on road
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2A1D0D] border border-[#664618] flex items-center justify-center text-[#D8A66A]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#131722] rounded-2xl p-5 border border-[#232B40] shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6678]">
              Completed Hires
            </span>
            <div className="text-2xl font-extrabold text-[#34D399] mt-1 font-mono">
              {returnedCount}
            </div>
            <span className="text-xs text-[#929AAA]">
              Vehicles checked in
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0A2619] border border-[#134E35] flex items-center justify-center text-[#34D399]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131722] rounded-2xl p-4 sm:p-5 border border-[#232B40] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#5E6678] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Rental ID, customer, vehicle..."
            className="w-full pl-9 pr-4 py-2 bg-[#0B0D12] border border-[#232B40] rounded-xl text-xs text-[#F5F5F2] placeholder-[#5E6678] focus:outline-hidden focus:border-[#4D7CFE]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0B0D12] rounded-xl border border-[#232B40] self-start sm:self-auto">
          {['All', 'Active', 'Returned'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-[#1A2030] text-[#F5F5F2] shadow-xs'
                  : 'text-[#929AAA] hover:text-[#F5F5F2]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <DataTable
        columns={columns}
        data={filteredRentals}
        emptyMessage="No rental audit records found"
        emptySubtext="Try selecting 'All' or clearing your search term."
      />

      {/* Digital Receipt Modal */}
      {selectedRentalDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRentalDetails(null)}
          title={`Digital Rental Receipt #${selectedRentalDetails.id}`}
          subtitle="Full booking transaction audit"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B0D12] border border-[#232B40]">
              <span className="font-mono font-bold text-sm text-[#4D7CFE]">
                {selectedRentalDetails.id}
              </span>
              <StatusBadge status={selectedRentalDetails.status} />
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#232B40] space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Client:</span>
                <span className="font-bold text-[#F5F5F2]">
                  {selectedRentalDetails.customerName} ({selectedRentalDetails.customerId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Vehicle:</span>
                <span className="font-semibold text-[#F5F5F2]">
                  {selectedRentalDetails.vehicleName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Duration:</span>
                <span className="font-mono font-semibold text-[#F5F5F2]">
                  {selectedRentalDetails.days} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Start Date:</span>
                <span className="font-mono text-[#F5F5F2]">
                  {selectedRentalDetails.rentDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Return Date:</span>
                <span className="font-mono text-[#F5F5F2]">
                  {selectedRentalDetails.returnDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929AAA]">Payment Method:</span>
                <span className="font-semibold text-[#F5F5F2]">
                  {selectedRentalDetails.paymentMethod || 'Cash'}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#1E2536] flex justify-between font-bold text-sm">
                <span className="text-[#F5F5F2]">Total Paid:</span>
                <span className="font-mono text-[#4D7CFE]">
                  {formatCurrency(selectedRentalDetails.totalCost)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2536] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRentalDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#929AAA] hover:bg-[#1A2030] transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Return Vehicle Modal */}
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
                Confirm receiving this vehicle back to fleet?
              </p>
              <div className="text-[#F5F5F2] pt-1 space-y-1">
                <div><strong>Rental ID:</strong> <span className="font-mono">{rentalToReturn.id}</span></div>
                <div><strong>Vehicle:</strong> {rentalToReturn.vehicleName}</div>
                <div><strong>Customer:</strong> {rentalToReturn.customerName}</div>
                <div><strong>Amount:</strong> <span className="font-mono">{formatCurrency(rentalToReturn.totalCost)}</span></div>
              </div>
            </div>

            <p className="text-[11px] text-[#5E6678]">
              The vehicle will immediately be marked as <strong>Available</strong> for new rentals.
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
    </div>
  );
}
