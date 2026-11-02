import React from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  KeyRound,
  History,
  Wrench,
  Settings,
  ShieldCheck,
  RotateCcw,
  Compass,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeRentalsCount = 0,
  onResetData,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Fleet Inventory', icon: Car },
    { id: 'customers', label: 'Customers', icon: Users },
    {
      id: 'rentals',
      label: 'Rental Dispatch',
      icon: KeyRound,
      badge: activeRentalsCount > 0 ? activeRentalsCount : null,
    },
    { id: 'rental-history', label: 'Rental History', icon: History },
    { id: 'maintenance', label: 'Maintenance Logs', icon: Wrench },
    { id: 'settings', label: 'System & OOPS', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B0D12] border-r border-[#1A2030] flex flex-col shrink-0 select-none min-h-screen text-[#929AAA]">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center gap-3 border-b border-[#1A2030]/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4D7CFE] to-[#254DB3] flex items-center justify-center text-white shadow-[0_0_15px_rgba(77,124,254,0.35)]">
          <Car className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-[#F5F5F2] font-sans">
              DriveDesk
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#16223D] text-[#4D7CFE] border border-[#2B437C]">
              FLEET
            </span>
          </div>
          <p className="text-[10px] text-[#5E6678] font-medium tracking-wide">
            Automotive SaaS
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3.5 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#5E6678]">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#151F38] text-[#F5F5F2] border border-[#2B427B]/60 shadow-[0_0_15px_rgba(77,124,254,0.15)]'
                  : 'text-[#929AAA] hover:text-[#F5F5F2] hover:bg-[#131722]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-[#4D7CFE]'
                      : 'text-[#5E6678] group-hover:text-[#929AAA]'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight ${
                    isActive
                      ? 'bg-[#4D7CFE] text-white shadow-xs'
                      : 'bg-[#2A1D0D] text-[#D8A66A] border border-[#664618]/70'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System info & Reset Box */}
      <div className="p-4 border-t border-[#1A2030] bg-[#0E121B]/60">
        <div className="p-3.5 rounded-xl bg-[#131722] border border-[#232B40] text-xs">
          <div className="flex items-center gap-2 text-[#F5F5F2] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-mono tracking-wide">OOPS Engine Ready</span>
          </div>
          <p className="text-[10px] text-[#5E6678] leading-relaxed">
            Local browser persistence. Real-time fleet sync.
          </p>
          {onResetData && (
            <button
              onClick={onResetData}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-semibold bg-[#1A2030] hover:bg-[#232B40] text-[#929AAA] hover:text-[#F5F5F2] transition-colors border border-[#2A344C]"
              title="Reset records to default sample data"
            >
              <RotateCcw className="w-3 h-3 text-[#5E6678]" />
              <span>Reset Demo State</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
