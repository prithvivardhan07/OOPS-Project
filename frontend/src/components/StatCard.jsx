import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  badgeColor = 'blue',
  onClick,
}) {
  const badgeStyles = {
    blue: 'bg-[#0E1B38] text-[#4D7CFE] border-[#1D3B7A]/70',
    emerald: 'bg-[#0A2619] text-[#34D399] border-[#134E35]/70',
    amber: 'bg-[#2A1D0D] text-[#D8A66A] border-[#664618]/70',
    purple: 'bg-[#22163B] text-[#C084FC] border-[#442777]/70',
    slate: 'bg-[#151B28] text-[#929AAA] border-[#232B40]',
  }[badgeColor] || 'bg-[#151B28] text-[#929AAA] border-[#232B40]';

  return (
    <div
      onClick={onClick}
      className={`relative bg-[#131722] rounded-2xl p-5 border border-[#232B40] hover:border-[#333E5A] transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
        onClick ? 'cursor-pointer hover:bg-[#161B28]' : ''
      }`}
    >
      {/* Subtle top ambient sheen */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#4D7CFE]/20 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#929AAA] mb-1.5 font-sans">
            {title}
          </p>
          <div className="text-3xl font-extrabold text-[#F5F5F2] tracking-tight font-mono">
            {value}
          </div>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#1A2030] border border-[#232B40] flex items-center justify-center text-[#929AAA] group-hover:text-[#4D7CFE] group-hover:border-[#333E5A] transition-colors shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1E2536] flex items-center justify-between text-xs">
        <span className="text-[#929AAA] text-[11px] font-medium truncate pr-2">
          {subtext}
        </span>
        {badge && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border shrink-0 ${badgeStyles}`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
