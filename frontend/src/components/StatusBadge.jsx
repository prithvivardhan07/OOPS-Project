import React from 'react';

export default function StatusBadge({ status, type = 'status' }) {
  const normalized = (status || '').toString().toLowerCase();

  let styles = 'bg-[#151B28] text-[#929AAA] border-[#232B40]';
  let dotColor = 'bg-[#5E6678]';
  let label = status;

  if (normalized === 'available' || normalized === 'true') {
    styles = 'bg-[#0A2619] text-[#34D399] border-[#134E35]/60';
    dotColor = 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    label = 'Available';
  } else if (normalized === 'rented' || normalized === 'false') {
    styles = 'bg-[#2A1D0D] text-[#D8A66A] border-[#664618]/60';
    dotColor = 'bg-[#D8A66A] shadow-[0_0_8px_rgba(216,166,106,0.4)]';
    label = 'Rented';
  } else if (normalized === 'active') {
    styles = 'bg-[#0E1B38] text-[#4D7CFE] border-[#1D3B7A]/60';
    dotColor = 'bg-[#4D7CFE] shadow-[0_0_8px_rgba(77,124,254,0.5)] animate-pulse';
    label = 'Active';
  } else if (normalized === 'returned' || normalized === 'completed') {
    styles = 'bg-[#131722] text-[#929AAA] border-[#232B40]';
    dotColor = 'bg-[#5E6678]';
    label = 'Returned';
  } else if (normalized === 'car') {
    styles = 'bg-[#131722] text-[#4D7CFE] border-[#2A3756]';
    dotColor = 'bg-[#4D7CFE]';
  } else if (normalized === 'bike') {
    styles = 'bg-[#131722] text-[#A78BFA] border-[#3B2E60]';
    dotColor = 'bg-[#A78BFA]';
  } else if (normalized === 'bus') {
    styles = 'bg-[#131722] text-[#38BDF8] border-[#1E3E5C]';
    dotColor = 'bg-[#38BDF8]';
  } else if (normalized === 'truck') {
    styles = 'bg-[#131722] text-[#FB923C] border-[#532E16]';
    dotColor = 'bg-[#FB923C]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide border ${styles} select-none transition-colors duration-150`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="font-sans leading-none">{label}</span>
    </span>
  );
}
