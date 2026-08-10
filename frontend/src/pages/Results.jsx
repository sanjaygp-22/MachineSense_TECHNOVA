import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';
import WaveformVisualizer from '../components/charts/WaveformVisualizer';
import { machinesData } from '../data/mockData';
import { API_URL } from '../config';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysisData = location.state?.analysisData;
  const machineId = location.state?.machineId || analysisData?.machine_id || 'motor-01';
  const machine = machinesData.find((m) => m.id === machineId) || {
    name: analysisData?.machine_id ? `Asset (${analysisData.machine_id})` : 'Target Machine',
    code: 'MAC-001',
    healthScore: 90
  };

  const [showSpectrogramModal, setShowSpectrogramModal] = useState(false);

  // Fallback default values if navigated directly without state
  const prediction = analysisData?.prediction || {
    label: 'normal',
    class: 0,
    abnormal_probability: 0.0267,
    normal_probability: 0.9733
  };

  const audio = analysisData?.audio || { duration: 10.0, sample_rate: 16000 };
  const signal = analysisData?.signal || { rms: 0.12, signal_quality: 'good' };
  const frequency = analysisData?.frequency || { dominant_frequency_hz: 167.7 };
  const spectral = analysisData?.spectral_features || { centroid_hz: 2028.3, flatness: 0.0957 };

  const isNormal = prediction.label === 'normal';
  const abnormalProbPct = (prediction.abnormal_probability * 100).toFixed(1);
  const normalProbPct = (prediction.normal_probability * 100).toFixed(1);
  const confidencePct = (Math.max(prediction.normal_probability, prediction.abnormal_probability) * 100).toFixed(1);

  useEffect(() => {
    console.log("STEP 7: result displayed");
    console.log("Final Machine Prediction Label:", prediction.label.toUpperCase());
    console.log("Abnormal Probability:", abnormalProbPct + "%");
    console.log("Normal Probability:", normalProbPct + "%");
    console.log("AI Confidence:", confidencePct + "%");
  }, [prediction, abnormalProbPct, normalProbPct, confidencePct]);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen selection:bg-primary-container selection:text-on-primary-container pt-16 pb-24 md:pb-8">
      <TopNavigation />

      <main className="pt-8 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-gutter relative">
        {/* Background atmospheric glow */}
        <div className={`absolute top-20 left-1/4 w-96 h-96 ${isNormal ? 'bg-secondary/10' : 'bg-error/15'} rounded-full blur-[120px] pointer-events-none z-0`}></div>

        {/* Back Navigation */}
        <button
          onClick={() => navigate('/analyze')}
          className="flex items-center gap-2 text-primary-fixed-dim hover:text-primary-container transition-colors font-label-caps text-label-caps z-10 relative w-fit group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          BACK TO ACTIVE MONITORING
        </button>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter z-10 relative">
          {/* Main Prediction & Health Card */}
          <section className="col-span-4 md:col-span-8 glass-panel rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className={`absolute -top-24 -right-24 w-64 h-64 ${isNormal ? 'bg-secondary-container/30' : 'bg-error/20'} rounded-full blur-[60px] pointer-events-none`}></div>
            <header className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface mb-1">{machine.name}</h1>
                <p className="font-data-mono text-data-mono text-on-surface-variant">Machine-Invariant RF AI Prediction • Logged Just Now</p>
              </div>

              {/* Status Badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg ${
                isNormal
                  ? 'bg-secondary-container/20 border-secondary/30 text-secondary shadow-[0_0_12px_rgba(2,201,83,0.2)]'
                  : 'bg-error/20 border-error/40 text-error shadow-[0_0_12px_rgba(255,180,171,0.3)]'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isNormal ? 'bg-secondary shadow-[0_0_8px_rgba(64,229,108,0.8)]' : 'bg-error shadow-[0_0_8px_rgba(255,180,171,0.8)]'}`}></div>
                <span className="font-label-caps text-label-caps tracking-widest uppercase font-bold text-sm">
                  {isNormal ? 'NORMAL' : 'ABNORMAL'}
                </span>
              </div>
            </header>

            {/* Model Probabilities & AI Confidence */}
            <div className="relative z-10 mt-auto grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 opacity-70">
                  AI PREDICTION
                </p>
                <p className={`font-headline-md text-headline-md font-bold uppercase ${isNormal ? 'text-secondary' : 'text-error'}`}>
                  {prediction.label}
                </p>
              </div>

              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 opacity-70">
                  AI CONFIDENCE
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-md text-headline-md text-primary-fixed">{confidencePct}</span>
                  <span className="font-data-mono text-sm text-primary">%</span>
                </div>
              </div>

              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 opacity-70">
                  ABNORMAL PROBABILITY
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`font-headline-md text-headline-md ${prediction.abnormal_probability > 0.4 ? 'text-error' : 'text-on-surface'}`}>
                    {abnormalProbPct}
                  </span>
                  <span className="font-data-mono text-sm text-on-surface-variant">%</span>
                </div>
              </div>

              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 opacity-70">
                  NORMAL PROBABILITY
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-md text-headline-md text-secondary">{normalProbPct}</span>
                  <span className="font-data-mono text-sm text-on-surface-variant">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Diagnostic Stats Grid */}
          <section className="col-span-4 md:col-span-4 glass-panel rounded-xl p-6 flex flex-col gap-4">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant border-b border-white/10 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
              ACOUSTIC DIAGNOSTICS
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-surface-container-low/50 border border-white/5">
                <span className="font-body-md text-sm text-on-surface-variant">Dominant Freq</span>
                <span className="font-data-mono text-sm text-primary-container font-bold">
                  {frequency.dominant_frequency_hz} Hz
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-surface-container-low/50 border border-white/5">
                <span className="font-body-md text-sm text-on-surface-variant">Signal Quality</span>
                <span className="font-data-mono text-sm text-secondary uppercase font-semibold">
                  {signal.signal_quality}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-surface-container-low/50 border border-white/5">
                <span className="font-body-md text-sm text-on-surface-variant">Audio Duration</span>
                <span className="font-data-mono text-sm text-on-surface">{audio.duration} s</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-surface-container-low/50 border border-white/5">
                <span className="font-body-md text-sm text-on-surface-variant">Sample Rate</span>
                <span className="font-data-mono text-sm text-on-surface">{audio.sample_rate} Hz</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-surface-container-low/50 border border-white/5">
                <span className="font-body-md text-sm text-on-surface-variant">Spectral Centroid</span>
                <span className="font-data-mono text-sm text-on-surface">{spectral.centroid_hz} Hz</span>
              </div>
            </div>
          </section>

          {/* AI Assessment Panel */}
          <section className="col-span-4 md:col-span-8 glass-panel rounded-xl p-8 border-t-2 border-t-primary-container relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent pointer-events-none"></div>
            <h2 className="font-label-caps text-label-caps text-primary-container mb-4 flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-[18px]">memory</span>
              AI DIAGNOSTIC ASSESSMENT & RECOMMENDATION
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              <div className="flex-1 space-y-3">
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                  {isNormal
                    ? '"Acoustic frequency spectrum matches normal machinery operating baseline. No harmonic distortions or bearing failure frequencies detected."'
                    : '"WARNING: Significant acoustic anomaly detected. Spectral energy shifts indicate potential mechanical fault or bearing degradation."'
                  }
                </p>
                <p className="font-data-mono text-data-mono text-on-surface-variant text-sm border-l-2 border-primary-container pl-3 py-1">
                  <strong>Recommendation:</strong> {isNormal
                    ? 'Continue regular operation. Next scheduled acoustic inspection in 14 days.'
                    : 'Schedule immediate physical inspection. Check motor alignment, bearing lubrication, and mounting stability.'
                  }
                </p>
              </div>

              {/* Waveform Visualizer */}
              <WaveformVisualizer />
            </div>
          </section>

          {/* Actions Panel */}
          <section className="col-span-4 md:col-span-4 flex flex-col gap-4 justify-end">
            {analysisData?.spectrogram?.url && (
              <button
                onClick={() => setShowSpectrogramModal(true)}
                className="w-full bg-surface-container-highest text-primary font-label-caps text-label-caps py-4 px-6 rounded-lg flex items-center justify-center gap-2 border border-primary/30 hover:bg-primary-container/20 transition-all cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                VIEW MEL SPECTROGRAM
              </button>
            )}
            <button
              onClick={() => navigate(`/frequency?machine=${machineId}`)}
              className="w-full bg-primary-container text-on-primary-container font-label-caps text-label-caps py-4 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">stacked_line_chart</span>
              VIEW FREQUENCY ANALYSIS
            </button>
          </section>
        </div>

        {/* Mel Spectrogram Modal View */}
        {showSpectrogramModal && analysisData?.spectrogram?.url && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="glass-panel p-6 rounded-2xl max-w-3xl w-full border border-white/20 relative">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">graphic_eq</span>
                  Generated Log-Mel Spectrogram
                </h3>
                <button
                  onClick={() => setShowSpectrogramModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-on-surface hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center min-h-[250px]">
                <img
                  src={`${API_URL}${analysisData.spectrogram.url}`}
                  alt="Mel Spectrogram"
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowSpectrogramModal(false)}
                  className="px-6 py-2 rounded-lg bg-primary-container text-on-primary-container font-label-caps text-label-caps hover:bg-primary-fixed transition-colors cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
