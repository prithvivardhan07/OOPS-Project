import React from 'react';
import { Inbox } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your filters or adding a new record.',
  keyExtractor = (item, idx) => item.id || idx,
}) {
  return (
    <div className="w-full bg-[#131722] rounded-2xl border border-[#232B40] shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0E121B] border-b border-[#232B40] text-[10px] font-bold uppercase tracking-widest text-[#929AAA]">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`py-3.5 px-4 sm:px-6 ${col.className || ''}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2234] text-xs text-[#F5F5F2]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 px-6 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A2030] border border-[#232B40] flex items-center justify-center text-[#5E6678] mb-3">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-[#F5F5F2]">
                      {emptyMessage}
                    </p>
                    <p className="text-xs text-[#929AAA] mt-1">
                      {emptySubtext}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={keyExtractor(item, rowIndex)}
                  className="hover:bg-[#181F2E] transition-colors duration-150 group"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-3.5 px-4 sm:px-6 align-middle ${
                        col.cellClassName || ''
                      }`}
                    >
                      {col.render
                        ? col.render(item, rowIndex)
                        : item[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="px-6 py-3 bg-[#0E121B]/80 border-t border-[#1E2536] text-[11px] text-[#929AAA] flex items-center justify-between">
          <span>
            Displaying <strong className="text-[#F5F5F2] font-semibold">{data.length}</strong> {data.length === 1 ? 'record' : 'records'}
          </span>
          <span className="font-mono text-[10px] text-[#929AAA] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>DriveDesk Live Sync</span>
          </span>
        </div>
      )}
    </div>
  );
}
