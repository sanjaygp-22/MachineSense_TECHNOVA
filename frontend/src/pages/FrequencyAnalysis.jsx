import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';
import { machinesData } from '../data/mockData';

export default function FrequencyAnalysis() {
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get('machine') || 'motor-01';
  const machine = machinesData.find((m) => m.id === machineId) || machinesData[0];

  const [activeTab, setActiveTab] = useState('Frequency');

  // Generate 60 FFT spectrum bars with specific peak highlights
  const fftBars = Array.from({ length: 60 }).map((_, i) => {
    let height = Math.floor(Math.sin(i * 0.3) * 20 + Math.cos(i * 0.7) * 15 + 35);
    let isPeak = false;
    let label = '';

    if (i === 15) {
      height = 85;
      isPeak = true;
      label = '800Hz';
    } else if (i === 30) {
      height = 95;
      isPeak = true;
      label = machine.dominantFreq || '1.62kHz';
    } else if (i === 50) {
      height = 75;
      isPeak = true;
      label = '3.24kHz';
    }

    return { id: i, height: Math.max(8, height), isPeak, label };
  });

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col pt-16 pb-24 md:pb-8 font-body-md text-body-md">
      <TopNavigation />

      <main className="flex-grow flex flex-col w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter gap-gutter">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Acoustic Analysis
            </h2>
            <p className="font-data-mono text-data-mono text-on-surface-variant mt-2">
              MACHINE ID: {machine.code} | SENSOR: VIB-4A
            </p>
          </div>

          {/* View Mode Tabs */}
          <div className="flex bg-surface-container-highest rounded-lg p-1 glass-panel">
            {['Waveform', 'Frequency', 'Spectrogram'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-label-caps text-label-caps transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'text-primary-container bg-surface-container-lowest shadow-sm glow-accent'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter flex-grow">
          {/* Main Graph Area */}
          <section className="glass-panel rounded-xl p-6 md:col-span-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1C2128]/20 to-[#161B22]/20 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-label-caps text-label-caps text-on-surface flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                LIVE FFT SPECTRUM
              </h3>
              <div className="flex items-center gap-4 font-data-mono text-data-mono text-on-surface-variant text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary-container opacity-20 border border-primary-container"></div>
                  <span>Background Noise</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary-container glow-accent"></div>
                  <span className="text-primary-container">Dominant Frequency</span>
                </div>
              </div>
            </div>

            {/* FFT Graph Visualizer */}
            <div className="flex-grow flex items-end justify-between gap-1 relative z-10 h-64 border-l border-b border-outline-variant/30 pb-2 pl-2 mt-4">
              {/* Y Axis Labels */}
              <div className="absolute -left-8 top-0 h-full flex flex-col justify-between font-data-mono text-data-mono text-on-surface-variant text-[10px] pointer-events-none">
                <span>-10dB</span>
                <span>-30dB</span>
                <span>-50dB</span>
                <span>-70dB</span>
              </div>

              {/* Bars */}
              {fftBars.map((bar) => (
                <div key={bar.id} className="relative w-full flex flex-col justify-end group h-full">
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      bar.isPeak
                        ? 'bg-primary-container/80 border-t-2 border-primary-container glow-accent'
                        : 'bg-primary-fixed-dim/20 hover:bg-primary-fixed-dim/40'
                    }`}
                    style={{ height: `${bar.height}%`, minHeight: '2px' }}
                  />
                  {bar.isPeak && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-data-mono text-[10px] text-primary-container whitespace-nowrap glow-accent font-bold">
                      {bar.label}
                    </div>
                  )}
                </div>
              ))}

              {/* X Axis Labels */}
              <div className="absolute -bottom-6 left-0 w-full flex justify-between font-data-mono text-data-mono text-on-surface-variant text-[10px]">
                <span>0Hz</span>
                <span>1kHz</span>
                <span>2kHz</span>
                <span>4kHz</span>
                <span>8kHz</span>
              </div>
            </div>
          </section>

          {/* Stats & Diagnostics Sidebar */}
          <section className="flex flex-col gap-gutter md:col-span-4">
            {/* Signal Quality Card */}
            <div className="glass-panel rounded-xl p-6 relative">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">SIGNAL METRICS</h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-body-md text-on-surface">Signal-to-Noise (SNR)</span>
                  <span className="font-data-mono text-secondary-container glow-accent font-bold">Good (28dB)</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-body-md text-on-surface">Signal Stability</span>
                  <span className="font-data-mono text-secondary-container glow-accent font-bold">{machine.stability}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-body-md text-on-surface">Clipping Events</span>
                  <span className="font-data-mono text-on-surface-variant">0 (Last 1hr)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-on-surface">Sample Rate</span>
                  <span className="font-data-mono text-on-surface-variant">44.1 kHz</span>
                </div>
              </div>
            </div>

            {/* Harmonic Analysis Card */}
            <div className="glass-panel rounded-xl p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">HARMONIC DIAGNOSTIC</h3>
                <div className="flex flex-col items-center text-center gap-4 my-2">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border border-primary-container/30 glow-accent">
                    <span className="material-symbols-outlined text-3xl text-primary-container">troubleshoot</span>
                  </div>
                  <div>
                    <p className="font-headline-md text-headline-md text-on-surface mb-1">
                      {machine.status === 'Healthy' ? 'Optimal Acoustic Balance' : 'Bearing Wear Detected'}
                    </p>
                    <p className="font-body-md text-on-surface-variant text-sm">
                      Peak at {machine.dominantFreq} aligns with expected motor signature for model SKF-6204.
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full py-3 bg-outline-variant/20 hover:bg-outline-variant/40 border border-primary-container/50 text-primary-container font-label-caps rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-sm">summarize</span>
                GENERATE FULL REPORT
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
