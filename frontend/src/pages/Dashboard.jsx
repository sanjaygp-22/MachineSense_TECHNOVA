import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';
import TrendChart from '../components/charts/TrendChart';
import { machinesData } from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-24 md:pb-8 pt-16">
      <TopNavigation />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
        {/* Welcome Header */}
        <div className="mb-gutter">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Good morning, <span className="text-primary">Engineer</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            System health is stable. 1 active alert requires attention.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
          {/* Overall Health Card */}
          <div className="col-span-4 md:col-span-5 glass-panel rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128] to-[#161B22] opacity-50 z-0"></div>

            <div className="relative z-10 flex justify-between items-start">
              <h3 className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-wider">
                Overall Machine Health
              </h3>
              <span className="flex items-center gap-2 bg-surface-container py-1 px-3 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-secondary pulse-dot"></span>
                <span className="font-label-caps text-label-caps text-secondary">LIVE</span>
              </span>
            </div>

            <div className="relative z-10 flex items-center justify-center my-8">
              {/* Circular Indicator SVG */}
              <div className="relative w-48 h-48 flex items-center justify-center glow-accent rounded-full">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle cx="50" cy="50" fill="transparent" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="6"></circle>
                  {/* Progress ring */}
                  <circle
                    className="transition-all duration-1000 ease-out"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="45"
                    stroke="#00e5ff"
                    strokeDasharray="282.7"
                    strokeDashoffset="17"
                    strokeWidth="6"
                  ></circle>
                </svg>
                <div className="text-center">
                  <span className="block font-headline-lg text-headline-lg text-primary tracking-tighter">94%</span>
                  <span className="block font-data-mono text-data-mono text-on-surface-variant text-xs mt-1">OPTIMAL</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/analyze')}
              className="relative z-10 w-full bg-primary-container text-on-primary-container font-headline-md text-[18px] py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
            >
              <span className="material-symbols-outlined icon-fill">mic</span>
              Analyze Machine
            </button>
          </div>

          {/* Right Column Stack */}
          <div className="col-span-4 md:col-span-7 flex flex-col gap-gutter">
            {/* Alert Banner */}
            <div className="glass-panel rounded-xl p-4 border-l-4 border-l-tertiary-container flex items-start gap-4 glow-warning bg-[#1C2128]/40">
              <span className="material-symbols-outlined text-tertiary-container mt-1 icon-fill">warning</span>
              <div className="flex-1">
                <h4 className="font-headline-md text-body-lg text-tertiary-container">Vibration Anomaly Detected</h4>
                <p className="font-body-md text-on-surface-variant mt-1">
                  Pump-02 (Plant B) is showing irregular sub-harmonic frequencies. Recommend acoustic analysis.
                </p>
              </div>
              <button
                onClick={() => navigate('/health?id=pump-02')}
                className="text-primary hover:text-primary-container font-label-caps text-label-caps uppercase underline-offset-4 hover:underline self-center cursor-pointer"
              >
                View
              </button>
            </div>

            {/* Active Machines List */}
            <div className="glass-panel rounded-xl p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-wider">
                  Active Fleet ({machinesData.length})
                </h3>
                <button onClick={() => navigate('/machines')} className="text-outline hover:text-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: '300px' }}>
                {machinesData.slice(0, 3).map((machine) => (
                  <div
                    key={machine.id}
                    onClick={() => navigate(`/health?id=${machine.id}`)}
                    className="bg-surface-container-high/50 hover:bg-surface-container-highest transition-colors rounded-lg p-4 border border-white/5 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          machine.status === 'Healthy'
                            ? 'bg-secondary/10 border-secondary/20 group-hover:border-secondary/50'
                            : 'bg-tertiary-container/10 border-tertiary-container/30 group-hover:border-tertiary-container/60'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined ${
                            machine.status === 'Healthy' ? 'text-secondary' : 'text-tertiary-container'
                          }`}
                        >
                          {machine.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-headline-md text-body-lg text-on-surface group-hover:text-primary transition-colors">
                          {machine.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              machine.status === 'Healthy' ? 'bg-secondary pulse-dot' : 'bg-tertiary-container'
                            }`}
                          ></span>
                          <span
                            className={`font-data-mono text-[10px] uppercase tracking-wider ${
                              machine.status === 'Healthy' ? 'text-on-surface-variant' : 'text-tertiary-container'
                            }`}
                          >
                            {machine.status}
                          </span>
                          <span className="text-outline text-[10px]">•</span>
                          <span className="font-data-mono text-[10px] text-outline uppercase">{machine.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span
                          className={`block font-data-mono text-data-mono ${
                            machine.status === 'Healthy' ? 'text-secondary' : 'text-tertiary-container'
                          }`}
                        >
                          {machine.healthScore}%
                        </span>
                        <span className="block font-data-mono text-[10px] text-outline">CONFIDENCE</span>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                        chevron_right
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Width Trend Chart Area */}
          <div className="col-span-4 md:col-span-12 glass-panel rounded-xl p-6 relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent opacity-50 z-0"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-wider">
                Fleet Health Trend (7 Days)
              </h3>
              <div className="flex gap-2">
                <button className="font-label-caps text-[10px] px-2 py-1 rounded bg-white/5 text-on-surface border border-white/10 hover:bg-white/10 cursor-pointer">
                  1D
                </button>
                <button className="font-label-caps text-[10px] px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30 glow-accent cursor-pointer">
                  7D
                </button>
                <button className="font-label-caps text-[10px] px-2 py-1 rounded bg-white/5 text-on-surface border border-white/10 hover:bg-white/10 cursor-pointer">
                  30D
                </button>
              </div>
            </div>

            <TrendChart height={200} />
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
