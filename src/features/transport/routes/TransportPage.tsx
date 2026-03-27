import React, { useState } from 'react';
import { Drivers } from '../components/Drivers';
import { Vehicles } from '../components/Vehicles';
import { User, Truck, LayoutDashboard, Activity, MapPin } from 'lucide-react';

interface FleetStatusProps {
  onManage: () => void;
}

const FleetRealtimeDashboard: React.FC<FleetStatusProps> = ({ onManage }) => (
  <div className="flex flex-col items-center justify-center p-24 bg-white rounded-2xl border-2 border-dashed border-border-light text-secondary shadow-inner animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-primary-bg p-2 rounded-full mb-6 ring-4 ring-primary-bg ring-opacity-50">
      <MapPin size={48} className="text-primary opacity-60 animate-pulse" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-primary">Fleet Real-time Dashboard</h3>
    <p className="max-w-md text-center text-secondary leading-relaxed mb-6 font-medium">
      Visualizing active delivery routes and truck positions. This module integrates with live dispatch GPS tracking for end-to-end operational awareness.
    </p>
    <button className="btn btn-primary px-8 shadow-lg shadow-primary-bg hover:shadow-xl transition-all" onClick={onManage}>
      Manage Registries
    </button>
  </div>
);

export const TransportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drivers' | 'vehicles' | 'fleet'>('fleet');

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="page-header mb-8 flex justify-between items-end">
        <div>
          <h1 className="page-title text-3xl font-extrabold tracking-tight text-primary">Logistics & Transportation</h1>
          <p className="page-subtitle text-secondary font-medium">Operational control across fleet assets and personnel registry</p>
        </div>
      </div>

      {/* KPI Summary for aesthetics */}
      <div className="kpi-grid mb-8">
        <div className="kpi-card shadow-sm border border-border-light p-5 rounded-2xl flex items-center justify-between bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div>
            <p className="kpi-label text-xs uppercase tracking-widest text-muted font-bold mb-1">Active Fleet</p>
            <p className="kpi-value text-3xl font-black text-primary">24</p>
          </div>
          <div className="kpi-icon bg-primary-bg text-primary p-4 rounded-xl ring-2 ring-primary-bg"><Truck size={24} /></div>
        </div>
        <div className="kpi-card shadow-sm border border-border-light p-5 rounded-2xl flex items-center justify-between bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div>
            <p className="kpi-label text-xs uppercase tracking-widest text-muted font-bold mb-1">Drivers Ready</p>
            <p className="kpi-value text-3xl font-black text-success">18</p>
          </div>
          <div className="kpi-icon bg-success-bg text-success p-4 rounded-xl ring-2 ring-success-bg"><User size={24} /></div>
        </div>
        <div className="kpi-card shadow-sm border border-border-light p-5 rounded-2xl flex items-center justify-between bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div>
            <p className="kpi-label text-xs uppercase tracking-widest text-muted font-bold mb-1">In Transit</p>
            <p className="kpi-value text-3xl font-black text-info">12</p>
          </div>
          <div className="kpi-icon bg-info-bg text-info p-4 rounded-xl ring-2 ring-info-bg"><Activity size={24} /></div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="tabs-container mb-8 flex gap-2 border-b-2 border-border-light overflow-x-auto scrollbar-hide">
        {(['fleet', 'drivers', 'vehicles'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const labels = {
            fleet: { label: 'Fleet Status', icon: LayoutDashboard },
            drivers: { label: 'Drivers Master', icon: User },
            vehicles: { label: 'Vehicles Registry', icon: Truck }
          };
          const { label, icon: Icon } = labels[tab];

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-item pb-4 px-6 transition-all duration-300 flex items-center gap-2 font-bold whitespace-nowrap border-b-4 ${isActive ? 'text-primary border-primary' : 'text-muted border-transparent hover:text-primary hover:border-primary-bg'}`}
              style={{ marginBottom: '-2px' }}
            >
              <Icon size={18} /> {label}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'fleet' ? (
          <FleetRealtimeDashboard onManage={() => setActiveTab('drivers')} />
        ) : activeTab === 'drivers' ? (
          <Drivers />
        ) : activeTab === 'vehicles' ? (
          <Vehicles />
        ) : null}
      </div>
    </div>
  );
};
