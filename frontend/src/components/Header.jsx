import React, { useState } from 'react';
import {
  Bell,
  Search,
  Plus,
  Shield,
  Sparkles,
  Command,
} from 'lucide-react';

export default function Header({
  title,
  subtitle,
  searchTerm,
  setSearchTerm,
  searchPlaceholder = 'Search fleet...',
  showSearch = true,
  primaryAction,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Active Rental R003',
      desc: 'Tata Starbus (Bus) currently rented to Priya Verma.',
      time: 'Live Booking',
      type: 'info',
    },
    {
      id: 2,
      title: 'Service Completed M001',
      desc: 'Toyota Corolla synthetic oil flush verified.',
      time: 'Logged',
      type: 'success',
    },
    {
      id: 3,
      title: 'Fleet Ready',
      desc: 'Vehicles available for immediate customer reservation.',
      time: 'Fleet Status',
      type: 'info',
    },
  ];

  return (
    <header className="h-20 px-8 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#1A2030] flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-extrabold text-[#F5F5F2] tracking-tight font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#929AAA] font-medium hidden sm:block mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3.5">
        {/* Search */}
        {showSearch && (
          <div className="relative hidden md:block w-64 lg:w-72">
            <Search className="w-3.5 h-3.5 text-[#5E6678] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-[#131722] border border-[#232B40] rounded-xl text-xs text-[#F5F5F2] placeholder-[#5E6678] focus:outline-hidden focus:border-[#4D7CFE] focus:bg-[#161C2A] transition-all"
            />
          </div>
        )}

        {/* Primary Action Button */}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide bg-[#4D7CFE] hover:bg-[#3E6CE5] text-white shadow-[0_0_15px_rgba(77,124,254,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {primaryAction.icon || <Plus className="w-4 h-4" />}
            <span>{primaryAction.label}</span>
          </button>
        )}

        {/* Notifications Icon with Flyout */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-[#131722] border border-[#232B40] flex items-center justify-center text-[#929AAA] hover:text-[#F5F5F2] hover:border-[#333E5A] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#4D7CFE] absolute top-2.5 right-2.5 shadow-[0_0_6px_#4D7CFE]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#131722] rounded-2xl shadow-2xl border border-[#232B40] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2.5 border-b border-[#1E2536] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F2]">
                  Fleet Alerts
                </span>
                <span className="text-[10px] font-mono font-bold text-[#4D7CFE] bg-[#14203D] px-2 py-0.5 rounded-full border border-[#253A6E]">
                  {notifications.length} active
                </span>
              </div>
              <div className="divide-y divide-[#1A2234] max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 hover:bg-[#181F2E] transition-colors"
                  >
                    <p className="text-xs font-bold text-[#F5F5F2]">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-[#929AAA] mt-0.5 leading-snug">
                      {n.desc}
                    </p>
                    <span className="text-[9px] text-[#5E6678] mt-1.5 inline-block font-mono uppercase tracking-widest">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Administrator profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#1A2030]">
          <div className="w-10 h-10 rounded-xl bg-[#1A2030] border border-[#232B40] text-[#F5F5F2] flex items-center justify-center font-bold text-xs tracking-wider shadow-inner font-mono">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#F5F5F2] leading-none">
                Administrator
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
            </div>
            <span className="text-[10px] text-[#5E6678] font-mono uppercase tracking-wider mt-0.5 block">
              Fleet Officer
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
