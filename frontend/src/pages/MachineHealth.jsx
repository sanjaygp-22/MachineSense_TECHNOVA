import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';
import { machinesData, historyLogs } from '../data/mockData';

export default function MachineHealth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const machineId = searchParams.get('id') || 'motor-01';

  const machine = machinesData.find((m) => m.id === machineId) || machinesData[0];

  return (
    <div className="bg-background text-on-surface min-h-screen font-body-md overflow-x-hidden pt-16 pb-24 md:pb-8">
      <TopNavigation />

      <main className="pt-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        {/* Mobile Back Button */}
        <div
          onClick={() => navigate('/machines')}
          className="md:hidden mb-6 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer w-max"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label-caps text-label-caps">Back to Machines</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-gutter">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-data-mono text-data-mono text-primary-fixed">{machine.code}</span>
              <span className="px-2 py-1 bg-surface-variant text-on-surface-variant font-label-caps text-label-caps rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">factory</span>
                {machine.location}
              </span>
              <span className="px-2 py-1 bg-secondary/10 border border-secondary/20 text-secondary font-label-caps text-label-caps rounded flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full pulse-dot"></div>
                {machine.status}
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
              {machine.name} <span className="text-on-surface-variant text-headline-md font-normal">{machine.type}</span>
            </h1>
          </div>

          <button
            onClick={() => navigate(`/analyze?machine=${machine.id}`)}
            className="bg-primary-container text-on-primary-container font-headline-md text-headline-md px-8 py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-primary-fixed transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
          >
            <span className="material-symbols-outlined icon-fill">mic</span>
            Analyze Now
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-gutter">
          {/* Health Score Card */}
          <div className="md:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between min-h-[200px]">
            <div className="font-data-mono text-data-mono text-on-surface-variant flex items-center justify-between">
              <span>CURRENT HEALTH</span>
              <span className="material-symbols-outlined">monitor_heart</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-secondary">{machine.healthScore}</span>
              <span className="font-headline-md text-headline-md text-on-surface-variant">%</span>
            </div>
            <div className="mt-4 w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: `${machine.healthScore}%` }}></div>
            </div>
            <div className="mt-2 text-right font-data-mono text-data-mono text-on-surface-variant text-[10px]">
              LAST UPDATED: {machine.lastAnalyzed.toUpperCase()}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="md:col-span-8 glass-card rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col justify-center">
              <div className="font-data-mono text-data-mono text-on-surface-variant mb-2">TOTAL ANALYSES</div>
              <div className="font-headline-md text-headline-md">{machine.totalAnalyses || 1248}</div>
              <div className="text-secondary flex items-center gap-1 font-data-mono text-data-mono text-[12px] mt-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +12 this week
              </div>
            </div>
            <div className="flex flex-col justify-center pt-4 md:pt-0 md:pl-6">
              <div className="font-data-mono text-data-mono text-on-surface-variant mb-2">AVERAGE HEALTH (30D)</div>
              <div className="font-headline-md text-headline-md">{machine.avgHealth || '94.2%'}</div>
              <div className="text-on-surface-variant font-data-mono text-data-mono text-[12px] mt-1">Stable</div>
            </div>
            <div className="flex flex-col justify-center pt-4 md:pt-0 md:pl-6">
              <div className="font-data-mono text-data-mono text-on-surface-variant mb-2">ANOMALIES DETECTED</div>
              <div className="font-headline-md text-headline-md text-tertiary-container">{machine.anomalies || 0}</div>
              <div className="text-tertiary-container flex items-center gap-1 font-data-mono text-data-mono text-[12px] mt-1">
                <span className="material-symbols-outlined text-[14px]">warning</span> Requires review
              </div>
            </div>
          </div>

          {/* Health Trend Graph */}
          <div className="md:col-span-12 glass-card rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="font-data-mono text-data-mono text-on-surface-variant">HEALTH TREND (LAST 30 DAYS)</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-surface-container rounded font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                  7D
                </button>
                <button className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded font-label-caps text-label-caps cursor-pointer">
                  30D
                </button>
                <button className="px-3 py-1 bg-surface-container rounded font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                  90D
                </button>
              </div>
            </div>

            <div className="w-full h-64 relative rounded-lg border border-white/5 overflow-hidden flex items-end bg-[#0A0E14]">
              <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 1000 200">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0, 229, 255, 0.2)"></stop>
                    <stop offset="100%" stopColor="rgba(0, 229, 255, 0)"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,150 L100,140 L200,160 L300,120 L400,130 L500,80 L600,90 L700,50 L800,70 L900,40 L1000,20 L1000,200 L0,200 Z" fill="url(#chartGradient)"></path>
                <path className="drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" d="M0,150 L100,140 L200,160 L300,120 L400,130 L500,80 L600,90 L700,50 L800,70 L900,40 L1000,20" fill="none" stroke="#00e5ff" strokeWidth="2"></path>
                <circle cx="500" cy="80" fill="#0d1516" r="4" stroke="#00e5ff" strokeWidth="2"></circle>
                <circle cx="700" cy="50" fill="#0d1516" r="4" stroke="#fec931" strokeWidth="2"></circle>
                <circle cx="1000" cy="20" fill="#00e5ff" r="6"></circle>
              </svg>
              <div className="absolute left-2 top-2 bottom-6 flex flex-col justify-between font-data-mono text-data-mono text-[10px] text-on-surface-variant/50 pointer-events-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          {/* Analysis History List */}
          <div className="md:col-span-12 glass-card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container/50">
              <h2 className="font-headline-md text-headline-md">Analysis History</h2>
              <button
                onClick={() => navigate('/history')}
                className="text-primary font-label-caps text-label-caps flex items-center gap-1 hover:text-primary-fixed cursor-pointer"
              >
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {historyLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => navigate('/results')}
                  className="p-4 md:px-6 hover:bg-white/5 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        log.status === 'Healthy'
                          ? 'bg-secondary/10 border border-secondary/20 text-secondary'
                          : 'bg-tertiary-container/10 border border-tertiary-container/30 text-tertiary-container'
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        {log.status === 'Healthy' ? 'check_circle' : 'warning'}
                      </span>
                    </div>
                    <div>
                      <div className="font-body-md text-body-md font-semibold">{log.type}</div>
                      <div className="font-data-mono text-data-mono text-on-surface-variant text-[12px] mt-1">{log.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/2">
                    <div className="flex flex-col">
                      <span className="font-data-mono text-data-mono text-on-surface-variant text-[10px]">HEALTH</span>
                      <span className={`font-data-mono text-data-mono ${log.status === 'Healthy' ? 'text-secondary' : 'text-tertiary-container'}`}>
                        {log.health}%
                      </span>
                    </div>
                    <div className="hidden md:flex flex-col">
                      <span className="font-data-mono text-data-mono text-on-surface-variant text-[10px]">DURATION</span>
                      <span className="font-data-mono text-data-mono">{log.duration}</span>
                    </div>
                    <button className="px-3 py-1.5 border border-outline-variant rounded font-label-caps text-label-caps text-on-surface hover:border-primary hover:text-primary transition-colors cursor-pointer">
                      Details
                    </button>
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
