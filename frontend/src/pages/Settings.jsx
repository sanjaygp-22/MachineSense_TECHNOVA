import React, { useState } from 'react';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';

export default function Settings() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [sampleRate, setSampleRate] = useState(75);
  const [noiseGate, setNoiseGate] = useState(40);

  return (
    <div className="bg-background min-h-screen flex flex-col font-body-md text-body-md pt-16 pb-24 md:pb-8">
      <TopNavigation />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Profile Header */}
        <div className="col-span-1 md:col-span-12 flex items-center gap-6 mb-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary-container overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.2)] bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container text-5xl">engineering</span>
          </div>
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">
              Dr. Alan Turing
            </h2>
            <p className="font-data-mono text-data-mono text-primary-fixed">Lead Acoustics Engineer // Sector 7G</p>
          </div>
        </div>

        {/* Left Column: Preferences & Audio Settings */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-gutter">
          {/* Quick Settings */}
          <section className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-outline mb-6">PREFERENCES</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-primary-container">dark_mode</span>
                  <span className="font-body-md text-body-md">Dark Theme</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkTheme}
                    onChange={() => setDarkTheme(!darkTheme)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-primary-container">notifications_active</span>
                  <span className="font-body-md text-body-md">Push Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotifs}
                    onChange={() => setPushNotifs(!pushNotifs)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-primary-container">email</span>
                  <span className="font-body-md text-body-md">Email Reports (Weekly)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailReports}
                    onChange={() => setEmailReports(!emailReports)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Audio Processing */}
          <section className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-outline mb-6">AUDIO PROCESSING</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-body-md text-body-md text-on-surface">Sample Rate</label>
                  <span className="font-data-mono text-data-mono text-primary">48 kHz</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={sampleRate}
                  onChange={(e) => setSampleRate(e.target.value)}
                  className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary-container"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-body-md text-body-md text-on-surface">Noise Floor Gate</label>
                  <span className="font-data-mono text-data-mono text-primary">-40 dB</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={noiseGate}
                  onChange={(e) => setNoiseGate(e.target.value)}
                  className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary-container"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Algorithms & Architecture Workflow */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-gutter">
          {/* Analysis Preferences */}
          <section className="glass-panel rounded-xl p-6 border-t-2 border-primary-container">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-label-caps text-label-caps text-primary">ANOMALY DETECTION ALGORITHM</h3>
              <button className="border border-white/10 text-primary-container px-4 py-2 rounded font-label-caps text-label-caps flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                Configure
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container-high p-4 rounded-lg border border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-data-mono text-data-mono text-on-surface font-bold">Bearing Wear</span>
                  <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(2,201,83,0.5)] animate-pulse"></span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">High-frequency friction analysis.</p>
              </div>

              <div className="bg-surface-container-high p-4 rounded-lg border border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-data-mono text-data-mono text-on-surface font-bold">Cavitation</span>
                  <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(2,201,83,0.5)] animate-pulse"></span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Fluid dynamic acoustic mapping.</p>
              </div>

              <div className="bg-surface-container-high p-4 rounded-lg border border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-data-mono text-data-mono text-on-surface font-bold">Rotor Imbalance</span>
                  <span className="w-2 h-2 rounded-full bg-surface-variant"></span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Low-frequency harmonic distortion.</p>
              </div>
            </div>
          </section>

          {/* Diagram Card: How MachineSense Works */}
          <section className="glass-panel rounded-xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-8 text-center tracking-tight">
                How MachineSense Works
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 relative">
                {/* Connection Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-8 right-8 h-[2px] bg-outline-variant -translate-y-1/2 z-0"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center gap-3 z-10 bg-surface-container p-4 rounded-lg border border-white/10 w-full md:w-32">
                  <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center border border-primary-container/30">
                    <span className="material-symbols-outlined text-primary">mic</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-center text-sm text-on-surface">Record</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-3 z-10 bg-surface-container p-4 rounded-lg border border-white/10 w-full md:w-32">
                  <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center border border-primary-container/30">
                    <span className="material-symbols-outlined text-primary">filter_alt</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-center text-sm text-on-surface">Filter</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-3 z-10 bg-surface-container p-4 rounded-lg border border-white/10 w-full md:w-32">
                  <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center border border-primary-container/30">
                    <span className="material-symbols-outlined text-primary">query_stats</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-center text-sm text-on-surface">Analyze</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center gap-3 z-10 bg-surface-container p-4 rounded-lg border border-primary-container/50 w-full md:w-32 relative">
                  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-error animate-pulse shadow-[0_0_10px_rgba(255,180,171,0.5)]"></div>
                  <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center border border-primary-container/30">
                    <span className="material-symbols-outlined text-primary">warning</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-center text-sm text-primary">Detect</span>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col items-center gap-3 z-10 bg-surface-container p-4 rounded-lg border border-white/10 w-full md:w-32">
                  <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center border border-primary-container/30">
                    <span className="material-symbols-outlined text-primary">build</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-center text-sm text-on-surface">Recommend</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
