import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Code2,
  Database,
  Download,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { storage } from '../services/storage';

export default function Settings({ onResetData, onNotify }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportData = () => {
    const data = {
      vehicles: storage.getVehicles(),
      customers: storage.getCustomers(),
      rentals: storage.getRentals(),
      maintenance: storage.getMaintenance(),
      exportTimestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drivedesk_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    if (onNotify) {
      onNotify({
        type: 'success',
        title: 'Export Complete',
        message: 'Fleet records downloaded as JSON.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-[#131722] rounded-2xl p-6 border border-[#232B40] shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#14203D] border border-[#233A6C] flex items-center justify-center text-[#4D7CFE] shrink-0">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#F5F5F2] tracking-tight">
              System Architecture & Core Java OOPS Integration
            </h2>
            <p className="text-xs text-[#929AAA] mt-1 leading-relaxed">
              DriveDesk operates as the frontend presentation layer for the Core
              Java Vehicle Rental Management System. Current environment uses
              local persistent browser memory matching the project's data schema.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="bg-[#2A1D0D]/60 rounded-2xl p-5 border border-[#664618]/60 text-xs text-[#D8A66A] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#D8A66A] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-[#F5F5F2] mb-1">
            Backend Integration Boundary
          </h4>
          <p className="text-[#D8A66A] leading-relaxed">
            This React dashboard is currently operating with a local demo-data layer.
            The companion Core Java project runs as a standalone console application
            with file-based persistence (`vehicles.txt`, `customers.txt`, `rentals.txt`,
            `maintenance.txt`). Service functions have been created with clean signatures
            so the frontend can seamlessly bind to REST endpoints in future phases.
          </p>
        </div>
      </div>

      {/* OOPS Concept Mapping */}
      <div className="bg-[#131722] rounded-2xl p-6 border border-[#232B40] shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1E2536]">
          <Code2 className="w-4 h-4 text-[#4D7CFE]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F2]">
            OOP Concepts & Class Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#232B40]">
            <div className="font-bold text-[#F5F5F2] flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#4D7CFE]" />
              <span>Inheritance & Abstraction</span>
            </div>
            <p className="text-[#929AAA] text-[11px] leading-relaxed">
              `Vehicle.java` acts as the abstract base class extending to `Car`,
              `Bike`, `Bus`, and `Truck`.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#232B40]">
            <div className="font-bold text-[#F5F5F2] flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
              <span>Polymorphism</span>
            </div>
            <p className="text-[#929AAA] text-[11px] leading-relaxed">
              `calculateRent(days)` overridden across each vehicle subclass for
              driver allowances, discounts, and loading charges.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#232B40]">
            <div className="font-bold text-[#F5F5F2] flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              <span>Encapsulation</span>
            </div>
            <p className="text-[#929AAA] text-[11px] leading-relaxed">
              Strict private fields with validated getters and setters across
              `Customer.java`, `Payment.java`, and `Maintenance.java`.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#232B40]">
            <div className="font-bold text-[#F5F5F2] flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#D8A66A]" />
              <span>Composition & Association</span>
            </div>
            <p className="text-[#929AAA] text-[11px] leading-relaxed">
              `Rental.java` HAS-A Customer and HAS-A Vehicle reference, while
              `Payment.java` associates with Rental.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-[#131722] rounded-2xl p-6 border border-[#232B40] shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1E2536]">
          <Database className="w-4 h-4 text-[#4D7CFE]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F2]">
            Demo Data Management
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B0D12] border border-[#232B40]">
          <div>
            <h4 className="text-xs font-bold text-[#F5F5F2]">
              Reset Demo Records
            </h4>
            <p className="text-[11px] text-[#5E6678] mt-0.5">
              Restores initial vehicles (V001–V004), customers (C001–C002),
              rentals (R001–R004), and maintenance logs (M001–M002).
            </p>
          </div>
          <button
            onClick={onResetData}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#2A1515] text-[#F87171] hover:bg-[#F87171] hover:text-[#0B0D12] font-semibold text-xs border border-[#522424] transition-all shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B0D12] border border-[#232B40]">
          <div>
            <h4 className="text-xs font-bold text-[#F5F5F2]">
              Export Fleet Telemetry (JSON)
            </h4>
            <p className="text-[11px] text-[#5E6678] mt-0.5">
              Download the current fleet, customers, and transactions to a JSON file.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1A2030] hover:bg-[#232B40] text-[#F5F5F2] font-semibold text-xs border border-[#232B40] transition-all shrink-0"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
