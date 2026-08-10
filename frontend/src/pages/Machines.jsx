import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';
import MachineCard from '../components/cards/MachineCard';
import { machinesData } from '../data/mockData';

export default function Machines() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredMachines = machinesData.filter((m) => {
    const matchesFilter = filter === 'All' || m.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-24 md:pb-8 pt-16">
      <TopNavigation />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              My Machines
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Monitoring {machinesData.length} active assets across 3 sectors.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0D1117] border-none text-on-surface rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-primary-container focus:shadow-[0_4px_12px_rgba(0,229,255,0.2)] transition-all font-body-md text-body-md placeholder:text-outline-variant outline-none"
                placeholder="Search machines..."
                type="text"
              />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Healthy', 'Warning', 'Critical'].map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full font-label-caps text-label-caps uppercase flex items-center gap-2 flex-shrink-0 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-surface-variant text-on-surface border border-primary-container/30 shadow-[0_0_8px_rgba(0,229,255,0.1)]'
                    : 'bg-[#0D1117] border border-outline-variant/30 text-on-surface-variant hover:border-outline-variant'
                }`}
              >
                {f === 'Healthy' && <div className="w-2 h-2 rounded-full bg-secondary"></div>}
                {f === 'Warning' && <div className="w-2 h-2 rounded-full bg-tertiary-container"></div>}
                {f === 'Critical' && <div className="w-2 h-2 rounded-full bg-error"></div>}
                {f}
              </button>
            );
          })}
        </div>

        {/* Machine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredMachines.map((m) => (
            <MachineCard key={m.id} machine={m} />
          ))}
        </div>
      </main>

      {/* Floating Action Button for Analyze */}
      <button
        onClick={() => navigate('/analyze')}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-primary-container text-[#001f24] rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center hover:scale-105 transition-transform z-40 cursor-pointer"
        title="Analyze New Sound"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      <BottomNavigation />
    </div>
  );
}
