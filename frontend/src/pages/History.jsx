import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';
import TrendChart from '../components/charts/TrendChart';
import { historyLogs } from '../data/mockData';

export default function History() {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const filteredLogs = historyLogs.filter((log) => {
    if (filter === 'All') return true;
    return log.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="bg-[#0A0E14] text-on-surface min-h-screen flex flex-col font-body-md pt-16 pb-24 md:pb-8">
      <TopNavigation />

      <main className="flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
        {/* Header */}
        <div className="mb-gutter flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              Analysis History
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Review temporal anomaly detection and diagnostic logs.
            </p>
          </div>
        </div>

        {/* Health Trend Chart Widget */}
        <section className="glass-panel rounded-xl p-4 md:p-6 mb-gutter relative overflow-hidden">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-[50px] pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-label-caps text-label-caps text-outline flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">show_chart</span>
              SYSTEM HEALTH TREND (7D)
            </h3>
            <span className="font-data-mono text-data-mono text-secondary drop-shadow-[0_0_4px_rgba(64,229,108,0.5)] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 92% Avg
            </span>
          </div>

          <TrendChart height={140} />
        </section>

        {/* Filtering Chips */}
        <div className="flex items-center gap-3 mb-gutter overflow-x-auto pb-2 scrollbar-hide w-full">
          {['All', 'Healthy', 'Warning', 'Critical'].map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container drop-shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                    : 'bg-surface-container-high border border-white/10 text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {f === 'Healthy' && <span className="w-2 h-2 rounded-full bg-secondary"></span>}
                {f === 'Warning' && <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>}
                {f === 'Critical' && <span className="w-2 h-2 rounded-full bg-error"></span>}
                {f}
              </button>
            );
          })}
        </div>

        {/* Timeline List */}
        <div className="space-y-8">
          <div>
            <h4 className="font-label-caps text-label-caps text-outline-variant mb-4 sticky top-16 bg-[#0A0E14]/90 backdrop-blur py-2 z-10 border-b border-white/5">
              TIMELINE LOGS
            </h4>

            <div className="flex flex-col gap-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => navigate(`/results?machine=${log.machineId}`)}
                  className="glass-panel rounded-lg p-3 md:p-4 flex items-center justify-between glass-card-hover group cursor-pointer"
                >
                  <div className="flex items-center gap-4 w-2/3">
                    <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          log.status === 'Healthy'
                            ? 'text-secondary'
                            : log.status === 'Warning'
                            ? 'text-tertiary-container'
                            : 'text-error'
                        }`}
                      >
                        {log.status === 'Healthy' ? 'check_circle' : log.status === 'Warning' ? 'water_pump' : 'warning'}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-data-mono text-data-mono text-on-surface mb-0.5 group-hover:text-primary transition-colors">
                        {log.machineName}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-label-caps text-label-caps ${
                            log.status === 'Healthy'
                              ? 'text-secondary'
                              : log.status === 'Warning'
                              ? 'text-tertiary-container'
                              : 'text-error'
                          }`}
                        >
                          {log.status}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="font-body-md text-[12px] text-on-surface-variant">{log.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Waveform Visual Preview */}
                  <div className="hidden md:flex w-24 h-6 items-end gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="w-full h-1/3 bg-primary/40 rounded-t"></div>
                    <div className="w-full h-2/3 bg-primary/60 rounded-t"></div>
                    <div className="w-full h-1/2 bg-primary/40 rounded-t"></div>
                    <div className="w-full h-full bg-primary rounded-t"></div>
                    <div className="w-full h-3/4 bg-primary/80 rounded-t"></div>
                    <div className="w-full h-1/4 bg-primary/30 rounded-t"></div>
                  </div>

                  <div className="flex items-center gap-3 text-right flex-shrink-0">
                    <span className="font-data-mono text-data-mono text-on-surface group-hover:text-primary transition-all">
                      {log.health}%
                    </span>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px]">
                      chevron_right
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
