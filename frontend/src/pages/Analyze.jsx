import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';
import AudioUploader from '../components/audio/AudioUploader';
import { machinesData } from '../data/mockData';

export default function Analyze() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMachineId = searchParams.get('machine') || 'motor-01';

  const [selectedMachine, setSelectedMachine] = useState(
    machinesData.find((m) => m.id === initialMachineId) || machinesData[0]
  );
  const [showSelector, setShowSelector] = useState(false);

  const startLiveAnalysis = () => {
    navigate('/processing', {
      state: { source: 'live', machineId: selectedMachine.id }
    });
  };

  const handleUploadedAudioAnalyze = (fileInfo) => {
    navigate('/processing', {
      state: {
        source: 'file',
        machineId: selectedMachine.id,
        rawFile: fileInfo.rawFile,
        fileInfo
      }
    });
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-24 md:pb-8 pt-16 overflow-x-hidden">
      <TopNavigation />

      <main className="pt-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[calc(100vh-120px)] flex flex-col justify-between">
        {/* Header & Target Asset Selector */}
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-start mb-4">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">Analyze Machine</h2>
            <p className="font-body-md text-on-surface-variant">Real-time acoustic diagnostic analysis & file evaluation.</p>
          </div>

          <div className="relative">
            <div
              onClick={() => setShowSelector(!showSelector)}
              className="glass-panel p-4 rounded-xl flex items-center justify-between min-w-[260px] cursor-pointer hover:bg-surface-bright/50 transition-colors border border-white/10"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-fixed-dim">precision_manufacturing</span>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant">TARGET ASSET</div>
                  <div className="font-data-mono text-data-mono text-primary font-bold">{selectedMachine.name}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">
                {showSelector ? 'expand_less' : 'expand_more'}
              </span>
            </div>

            {showSelector && (
              <div className="absolute right-0 top-full mt-2 w-full glass-panel rounded-xl p-2 z-50 shadow-2xl border border-white/10 flex flex-col gap-1 bg-[#151d1e]">
                {machinesData.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMachine(m);
                      setShowSelector(false);
                    }}
                    className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      selectedMachine.id === m.id ? 'bg-primary-container/20 text-primary' : 'hover:bg-white/5 text-on-surface'
                    }`}
                  >
                    <div>
                      <div className="font-data-mono text-sm font-bold">{m.name}</div>
                      <div className="font-data-mono text-[10px] text-outline">{m.code} • {m.location}</div>
                    </div>
                    <span className="font-data-mono text-xs text-secondary">{m.healthScore}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Central Live Analysis UI */}
        <div className="flex-grow flex flex-col items-center justify-center relative my-4">
          {/* Environment Noise Indicator */}
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-6 border border-white/10 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="font-data-mono text-data-mono text-secondary">ENV NOISE: LOW (32 dB)</span>
          </div>

          {/* Main Glowing Microphone Button */}
          <div onClick={startLiveAnalysis} className="relative flex items-center justify-center my-6 group cursor-pointer">
            {/* Outer Rings */}
            <div className="absolute w-64 h-64 rounded-full border border-primary-container/20 pulse-ring"></div>
            <div className="absolute w-56 h-56 rounded-full border border-primary-container/40 animate-[spin_10s_linear_infinite] border-dashed"></div>

            {/* Core Button */}
            <button className="relative w-40 h-40 rounded-full bg-surface-container-highest border-2 border-primary-container flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.3)] group-hover:shadow-[0_0_50px_rgba(0,229,255,0.6)] group-hover:scale-105 transition-all duration-300 z-10 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-primary-container/10 group-hover:bg-primary-container/25 transition-colors"></div>
              <span className="material-symbols-outlined text-primary-container text-[64px] icon-fill">mic</span>
            </button>
          </div>

          {/* Status Text */}
          <div className="text-center mt-6">
            <h3 className="font-headline-md text-headline-md text-primary mb-2">Tap mic to start live analysis</h3>
            <p className="font-body-md text-on-surface-variant max-w-sm mx-auto">
              Place device near target machinery ({selectedMachine.name}). Maintain a distance of 10-15cm for optimal acoustic capture.
            </p>
          </div>
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-4 my-8 max-w-2xl mx-auto w-full">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="font-data-mono text-data-mono text-outline text-xs uppercase px-2 py-1 bg-surface-container-low rounded border border-white/5">
            OR
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Audio Uploader Component */}
        <AudioUploader onAnalyzeFile={handleUploadedAudioAnalyze} />

        {/* Instruction Card */}
        <div className="glass-panel p-6 rounded-xl mt-6 mb-4 border-l-4 border-primary-container">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-primary-container mt-1">info</span>
            <div>
              <h4 className="font-label-caps text-label-caps text-primary-container mb-1">RECORDING INSTRUCTIONS</h4>
              <p className="font-data-mono text-data-mono text-on-surface-variant">
                Ensure safety protocols are active. Do not place device directly on hot or moving parts. Audio files (WAV, MP3, FLAC, M4A up to 50MB) are processed locally in memory.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
