import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Customers from './pages/Customers';
import Rentals from './pages/Rentals';
import RentalHistory from './pages/RentalHistory';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';

import { vehicleService } from './services/vehicleService';
import { customerService } from './services/customerService';
import { rentalService } from './services/rentalService';
import { maintenanceService } from './services/maintenanceService';
import { storage } from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  // Core application data with lazy initializers for instant zero-latency load
  const [vehicles, setVehicles] = useState(() => vehicleService.getAll());
  const [customers, setCustomers] = useState(() => customerService.getAll());
  const [rentals, setRentals] = useState(() => rentalService.getAll());
  const [maintenance, setMaintenance] = useState(() => maintenanceService.getAll());

  // For passing a vehicle directly to Rentals page
  const [preselectedVehicleId, setPreselectedVehicleId] = useState(null);

  // Sync on mount
  useEffect(() => {
    setVehicles(vehicleService.getAll());
    setCustomers(customerService.getAll());
    setRentals(rentalService.getAll());
    setMaintenance(maintenanceService.getAll());
  }, []);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  // Add Vehicle handler
  const handleAddVehicle = (vehicleData) => {
    try {
      const newV = vehicleService.create(vehicleData);
      setVehicles(vehicleService.getAll());
      showToast(
        'success',
        'Vehicle Registered',
        `${newV.brand} ${newV.model} (${newV.id}) added to fleet.`
      );
    } catch (err) {
      showToast('error', 'Error', err.message);
    }
  };

  // Add Customer handler
  const handleAddCustomer = (customerData) => {
    try {
      const newC = customerService.create(customerData);
      setCustomers(customerService.getAll());
      showToast(
        'success',
        'Client Registered',
        `${newC.name} (${newC.id}) verified in database.`
      );
    } catch (err) {
      showToast('error', 'Error', err.message);
    }
  };

  // Book Rental handler
  const handleBookRental = (bookingData) => {
    try {
      const result = rentalService.bookRental(bookingData);
      setVehicles(vehicleService.getAll());
      setRentals(rentalService.getAll());
      showToast(
        'success',
        'Rental Dispatched',
        `Rental #${result.rental.id} issued for ${result.rental.customerName}.`
      );
      return result;
    } catch (err) {
      showToast('error', 'Booking Failed', err.message);
      throw err;
    }
  };

  // Return Rental handler
  const handleReturnRental = (rentalId) => {
    try {
      const returned = rentalService.returnRental(rentalId);
      setVehicles(vehicleService.getAll());
      setRentals(rentalService.getAll());
      showToast(
        'success',
        'Vehicle Checked In',
        `Vehicle from Rental #${returned.id} is now available in fleet.`
      );
    } catch (err) {
      showToast('error', 'Return Failed', err.message);
    }
  };

  // Add Maintenance handler
  const handleAddMaintenance = (recordData) => {
    try {
      const newM = maintenanceService.create(recordData);
      setMaintenance(maintenanceService.getAll());
      showToast(
        'success',
        'Service Logged',
        `Record #${newM.id} saved for ${newM.vehicleName}.`
      );
    } catch (err) {
      showToast('error', 'Error', err.message);
    }
  };

  // Reset Demo Data
  const handleResetData = () => {
    if (
      window.confirm(
        'Reset all demo data back to factory state? This will restore initial vehicles, customers, and rentals.'
      )
    ) {
      const fresh = storage.resetAll();
      setVehicles(fresh.vehicles);
      setCustomers(fresh.customers);
      setRentals(fresh.rentals);
      setMaintenance(fresh.maintenance);
      showToast(
        'info',
        'Demo State Restored',
        'All records restored to original sample data.'
      );
    }
  };

  // Quick Rent navigation from Vehicles page
  const handleRentVehicleFromList = (vehicleId) => {
    setPreselectedVehicleId(vehicleId);
    setActiveTab('rentals');
  };

  // Active rentals count for badge
  const activeRentalsCount = rentals.filter((r) => !r.isCompleted).length;

  // Page header configuration
  const pageConfigs = {
    dashboard: {
      title: 'Fleet Intelligence Dashboard',
      subtitle: 'Real-time telemetry, rental throughput & maintenance monitoring',
      searchPlaceholder: 'Search anything across DriveDesk...',
      showSearch: false,
    },
    vehicles: {
      title: 'Fleet Inventory & Assets',
      subtitle: 'Catalog of cars, sports motorcycles, executive coaches & commercial haulers',
      searchPlaceholder: 'Filter fleet by ID, brand, model...',
      showSearch: true,
    },
    customers: {
      title: 'Client Directory',
      subtitle: 'Verified customer accounts, contact dossiers & hire histories',
      searchPlaceholder: 'Search customer name, phone, email...',
      showSearch: true,
    },
    rentals: {
      title: 'Rental Dispatch & Returns',
      subtitle: 'Issue new vehicle agreements and monitor active road hires',
      searchPlaceholder: 'Search active rentals...',
      showSearch: false,
    },
    'rental-history': {
      title: 'Rental Audit & History',
      subtitle: 'Permanent transaction ledger of completed and ongoing rentals',
      searchPlaceholder: 'Search rental history records...',
      showSearch: true,
    },
    maintenance: {
      title: 'Fleet Maintenance & Service',
      subtitle: 'Scheduled servicing, preventative inspections & repair expenditure',
      searchPlaceholder: 'Search maintenance logs...',
      showSearch: true,
    },
    settings: {
      title: 'System & OOP Architecture',
      subtitle: 'Core Java object model mapping, polymorphic pricing rules & demo telemetry controls',
      searchPlaceholder: '',
      showSearch: false,
    },
  };

  const currentConfig = pageConfigs[activeTab] || pageConfigs.dashboard;

  return (
    <div className="flex h-screen bg-[#0B0D12] text-[#F5F5F2] font-sans overflow-hidden">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSearchTerm('');
          setActiveTab(tab);
        }}
        activeRentalsCount={activeRentalsCount}
        onResetData={handleResetData}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0B0D12]">
        {/* Top Header */}
        <Header
          title={currentConfig.title}
          subtitle={currentConfig.subtitle}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder={currentConfig.searchPlaceholder}
          showSearch={currentConfig.showSearch}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#0B0D12]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                vehicles={vehicles}
                customers={customers}
                rentals={rentals}
                maintenance={maintenance}
                onNavigate={(tab) => {
                  setSearchTerm('');
                  setActiveTab(tab);
                }}
                onOpenNewRental={() => {
                  setSearchTerm('');
                  setActiveTab('rentals');
                }}
              />
            )}

            {activeTab === 'vehicles' && (
              <Vehicles
                vehicles={vehicles}
                onAddVehicle={handleAddVehicle}
                onRentVehicle={handleRentVehicleFromList}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            {activeTab === 'customers' && (
              <Customers
                customers={customers}
                rentals={rentals}
                onAddCustomer={handleAddCustomer}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            {activeTab === 'rentals' && (
              <Rentals
                vehicles={vehicles}
                customers={customers}
                rentals={rentals}
                onBookRental={handleBookRental}
                onReturnRental={handleReturnRental}
                preselectedVehicleId={preselectedVehicleId}
                onClearPreselectedVehicle={() => setPreselectedVehicleId(null)}
              />
            )}

            {activeTab === 'rental-history' && (
              <RentalHistory
                rentals={rentals}
                onReturnRental={handleReturnRental}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            {activeTab === 'maintenance' && (
              <Maintenance
                maintenance={maintenance}
                vehicles={vehicles}
                onAddMaintenance={handleAddMaintenance}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            {activeTab === 'settings' && (
              <Settings
                onResetData={handleResetData}
                onNotify={setToast}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
