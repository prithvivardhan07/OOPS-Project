import React from 'react';
import {
  Car,
  KeyRound,
  Users,
  CheckCircle2,
  Wrench,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/pricing';

export default function Dashboard({
  vehicles = [],
  customers = [],
  rentals = [],
  maintenance = [],
  onNavigate,
  onOpenNewRental,
}) {
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.isAvailable).length;
  const rentedVehicles = totalVehicles - availableVehicles;
  const registeredCustomers = customers.length;
  const activeRentals = rentals.filter((r) => !r.isCompleted);

  const totalMaintenanceCost = maintenance.reduce(
    (sum, m) => sum + (Number(m.cost) || 0),
    0
  );

  const vehicleTypeCounts = {
    Car: vehicles.filter((v) => v.type === 'Car').length,
    Bike: vehicles.filter((v) => v.type === 'Bike').length,
    Bus: vehicles.filter((v) => v.type === 'Bus').length,
    Truck: vehicles.filter((v) => v.type === 'Truck').length,
  };

  const availableByType = {
    Car: vehicles.filter((v) => v.type === 'Car' && v.isAvailable).length,
    Bike: vehicles.filter((v) => v.type === 'Bike' && v.isAvailable).length,
    Bus: vehicles.filter((v) => v.type === 'Bus' && v.isAvailable).length,
    Truck: vehicles.filter((v) => v.type === 'Truck' && v.isAvailable).length,
  };

  const recentRentals = rentals.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cinematic Automotive Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-[#232B40] shadow-2xl bg-[#0B0D12] min-h-[260px] flex items-center">
        {/* Background Automotive Photograph */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65 transform scale-100 hover:scale-102 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />

        {/* Cinematic Atmospheric Multi-stop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D12] via-[#0B0D12]/85 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-[#0B0D12]/40 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 px-8 py-8 sm:px-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16223D]/90 border border-[#2B437C] text-[#4D7CFE] text-[11px] font-semibold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4D7CFE] animate-pulse" />
            <span>DriveDesk Fleet Intelligence</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F5F5F2] leading-tight font-sans">
            Command your fleet with editorial precision.
          </h2>

          <p className="text-xs sm:text-sm text-[#929AAA] mt-2.5 leading-relaxed max-w-xl font-medium">
            Real-time fleet telemetry, polymorphic pricing calculations, client
            reservations, and preventative vehicle maintenance.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewRental}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(77,124,254,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Dispatch Vehicle</span>
            </button>
            <button
              onClick={() => onNavigate('vehicles')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#131722]/80 hover:bg-[#1A2030] text-[#F5F5F2] font-semibold text-xs border border-[#232B40] hover:border-[#333E5A] transition-colors"
            >
              <span>Explore Fleet</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#929AAA]" />
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fleet Size"
          value={totalVehicles}
          subtext="Cars, Bikes, Coaches, Haulers"
          icon={Car}
          badge="Active Inventory"
          badgeColor="blue"
          onClick={() => onNavigate('vehicles')}
        />
        <StatCard
          title="Available Units"
          value={availableVehicles}
          subtext={`${Math.round((availableVehicles / (totalVehicles || 1)) * 100)}% of fleet ready for dispatch`}
          icon={CheckCircle2}
          badge="Ready"
          badgeColor="emerald"
          onClick={() => onNavigate('vehicles')}
        />
        <StatCard
          title="Active Hires"
          value={rentedVehicles}
          subtext={`${activeRentals.length} active rental contracts`}
          icon={KeyRound}
          badge={rentedVehicles > 0 ? 'On Road' : 'No Hires'}
          badgeColor="amber"
          onClick={() => onNavigate('rentals')}
        />
        <StatCard
          title="Verified Clients"
          value={registeredCustomers}
          subtext="Active customer accounts"
          icon={Users}
          badge="Verified"
          badgeColor="purple"
          onClick={() => onNavigate('customers')}
        />
      </div>

      {/* Visual Centerpiece: Vehicle Inventory Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#F5F5F2] tracking-tight uppercase tracking-wider text-xs">
              Fleet Showcase & Active Inventory
            </h3>
            <p className="text-xs text-[#929AAA] mt-0.5">
              High-resolution vehicle fleet profiles and live dispatch readiness
            </p>
          </div>
          <button
            onClick={() => onNavigate('vehicles')}
            className="text-xs font-semibold text-[#4D7CFE] hover:text-[#7097FF] flex items-center gap-1 transition-colors"
          >
            <span>View Full Fleet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Beautiful Vehicle Cards with high-res automotive imagery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {vehicles.slice(0, 4).map((v) => (
            <div
              key={v.id}
              onClick={() => onNavigate('vehicles')}
              className="automotive-card group bg-[#131722] rounded-2xl border border-[#232B40] hover:border-[#333E5A] overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-xl"
            >
              {/* Image Container with 16:10 aspect ratio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B0D12]">
                <img
                  src={v.imageUrl}
                  alt={`${v.brand} ${v.model}`}
                  className="vehicle-img w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback if network blocked
                    e.target.src =
                      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                {/* Gradient vignette for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-[#131722]/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <span className="font-mono text-[10px] font-bold text-[#F5F5F2] bg-[#0B0D12]/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#232B40]">
                    {v.id}
                  </span>
                  <StatusBadge status={v.isAvailable ? 'Available' : 'Rented'} />
                </div>

                {/* Vehicle Type Pill on image */}
                <div className="absolute bottom-2 left-3 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#929AAA] bg-[#0B0D12]/70 backdrop-blur-sm px-2 py-0.5 rounded border border-[#232B40]/70">
                    {v.type}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F5F5F2] group-hover:text-[#4D7CFE] transition-colors tracking-tight">
                    {v.brand} {v.model}
                  </h4>
                  <p className="text-[11px] text-[#929AAA] mt-0.5 font-medium">
                    {v.specification}
                  </p>
                </div>

                {/* Price & Action row */}
                <div className="mt-4 pt-3 border-t border-[#1E2536] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#5E6678] block">
                      Daily Rate
                    </span>
                    <span className="text-sm font-extrabold text-[#F5F5F2] font-mono">
                      {formatCurrency(v.rentalRatePerDay)}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-[#4D7CFE] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Utilization & Operations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-[#131722] rounded-2xl p-6 border border-[#232B40] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E2536]">
              <h3 className="font-bold text-[#F5F5F2] text-xs uppercase tracking-wider">
                Category Fleet Status
              </h3>
              <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-4">
              {[
                { type: 'Car', total: vehicleTypeCounts.Car, avail: availableByType.Car, color: 'bg-[#4D7CFE]', text: 'text-[#4D7CFE]' },
                { type: 'Bike', total: vehicleTypeCounts.Bike, avail: availableByType.Bike, color: 'bg-[#A78BFA]', text: 'text-[#A78BFA]' },
                { type: 'Bus', total: vehicleTypeCounts.Bus, avail: availableByType.Bus, color: 'bg-[#38BDF8]', text: 'text-[#38BDF8]' },
                { type: 'Truck', total: vehicleTypeCounts.Truck, avail: availableByType.Truck, color: 'bg-[#FB923C]', text: 'text-[#FB923C]' },
              ].map((cat) => {
                const pct = cat.total > 0 ? (cat.avail / cat.total) * 100 : 0;
                return (
                  <div key={cat.type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F5F5F2] flex items-center gap-2">
                        <StatusBadge status={cat.type} />
                      </span>
                      <span className="text-[#929AAA] font-mono text-[11px]">
                        <strong className={cat.text}>{cat.avail}</strong> / {cat.total} Ready
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0B0D12] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E2536] flex items-center justify-between text-xs text-[#929AAA]">
            <span className="text-[11px]">Subclasses extend `Vehicle.java`</span>
            <button
              onClick={() => onNavigate('settings')}
              className="text-[11px] font-semibold text-[#4D7CFE] hover:underline"
            >
              OOP Docs
            </button>
          </div>
        </div>

        {/* Recent Rentals Activity */}
        <div className="lg:col-span-2 bg-[#131722] rounded-2xl p-6 border border-[#232B40] shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E2536]">
            <div>
              <h3 className="font-bold text-[#F5F5F2] text-xs uppercase tracking-wider">
                Recent Rental Operations
              </h3>
              <p className="text-[11px] text-[#929AAA] mt-0.5">
                Audit trail of latest customer reservations and returns
              </p>
            </div>
            <button
              onClick={() => onNavigate('rental-history')}
              className="text-xs font-semibold text-[#4D7CFE] hover:text-[#7097FF] flex items-center gap-1 transition-colors"
            >
              All History <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2536] text-[#5E6678] font-bold uppercase text-[10px] tracking-widest">
                  <th className="pb-3">Rental ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2234] text-[#F5F5F2]">
                {recentRentals.map((r) => (
                  <tr key={r.id} className="hover:bg-[#181F2E] transition-colors">
                    <td className="py-3 font-mono font-bold text-[#4D7CFE]">
                      {r.id}
                    </td>
                    <td className="py-3 font-semibold text-[#F5F5F2]">
                      {r.customerName}
                    </td>
                    <td className="py-3 text-[#929AAA]">
                      {r.vehicleName}
                    </td>
                    <td className="py-3 text-[#929AAA] font-mono">
                      {r.days}d
                    </td>
                    <td className="py-3 font-bold font-mono text-[#F5F5F2]">
                      {formatCurrency(r.totalCost)}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
