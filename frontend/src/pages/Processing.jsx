import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import BottomNavigation from '../components/layout/BottomNavigation';
import AmbientShader from '../components/layout/AmbientShader';
import { machinesData } from '../data/mockData';
import { API_URL } from '../config';
import { getActiveAudioFile, clearActiveAudioFile } from '../utils/audioStore';

export default function Processing() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve File object safely from memory store or location.state fallback
  const rawFile = getActiveAudioFile() || location.state?.rawFile;
  const machineId = location.state?.machineId || 'id_00';
  const machine = machinesData.find((m) => m.id === machineId) || machinesData[0];

  const [activeStep, setActiveStep] = useState(0); // 0..4
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout guard

    const executeAnalysis = async () => {
      try {
        if (!rawFile || !(rawFile instanceof Blob || rawFile instanceof File)) {
          console.error("Audio Processing Error: rawFile is invalid or missing:", rawFile);
          throw new Error('No valid audio file selected. Please return to upload and choose a WAV recording.');
        }

        // STEP 2 Verification: Audio Captured
        console.log('STEP 2: audio captured');
        console.log('Selected file name:', rawFile.name);
        console.log('File size:', rawFile.size, 'bytes');
        console.log('File type:', rawFile.type || 'audio/wav');
        if (isMounted) setActiveStep(0); // Audio captured
        await new Promise((r) => setTimeout(r, 150));

        // STEP 3: Starting Noise Filtering
        console.log('STEP 3: starting noise filtering');
        if (isMounted) setActiveStep(1); // Noise filtering
        await new Promise((r) => setTimeout(r, 200));

        // STEP 4: Noise Filtering Complete
        console.log('STEP 4: noise filtering complete');
        if (isMounted) setActiveStep(2); // Frequency analysis / Feature extraction
        await new Promise((r) => setTimeout(r, 150));

        // STEP 5: Starting API Request
        console.log('STEP 5: starting API request');
        console.log('API URL:', `${API_URL}/api/analyze`);
        console.log('Request start');
        if (isMounted) setActiveStep(3); // ML Analysis

        const formData = new FormData();
        formData.append('audio', rawFile, rawFile.name || 'recording.wav');
        formData.append('machine_id', machineId);

        const t_start_fetch = performance.now();
        const response = await fetch(`${API_URL}/api/analyze`, {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });
        const t_end_fetch = performance.now();

        clearTimeout(timeoutId);
        console.log('Response status:', response.status);
        console.log(`HTTP Request duration: ${(t_end_fetch - t_start_fetch).toFixed(2)} ms`);

        if (!response.ok) {
          let detailMsg = `Server returned status ${response.status}.`;
          try {
            const errJson = await response.json();
            if (errJson.detail) {
              detailMsg = errJson.detail;
            }
          } catch (e) {
            // Keep default status message
          }
          throw new Error(detailMsg);
        }

        // STEP 6: API Response Received
        const resultData = await response.json();
        console.log('STEP 6: API response received');
        console.log('Response JSON:', resultData);

        if (isMounted) setActiveStep(4); // AI Anomaly Detection Completed
        await new Promise((r) => setTimeout(r, 150));

        // Clear active memory store upon success
        clearActiveAudioFile();

        if (isMounted) {
          navigate('/results', {
            state: {
              analysisData: resultData,
              machineId
            }
          });
        }
      } catch (err) {
        if (!isMounted) return;
        clearTimeout(timeoutId);

        console.error('Frontend Processing Failure:', err);
        let userFriendlyMsg = err.message || 'An unexpected error occurred during audio processing.';
        if (err.name === 'AbortError') {
          userFriendlyMsg = 'Analysis request timed out after 25 seconds. Please check backend status and retry.';
        } else if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          userFriendlyMsg = `Unable to connect to FastAPI backend at ${API_URL}. Please ensure the backend server is running.`;
        }

        setErrorMessage(userFriendlyMsg);
      }
    };

    executeAnalysis();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [rawFile, machineId, navigate]);

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col overflow-hidden relative pt-16 pb-24 md:pb-8">
      <TopNavigation />

      {/* WebGL Shader Canvas Background */}
      <AmbientShader />

      {/* Main Content Canvas */}
      <main className="flex-grow relative w-full h-full flex flex-col items-center justify-center py-8 z-10">
        <div className="relative z-20 w-full max-w-4xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row gap-gutter">
          {/* Visualization Container */}
          <div className="flex-1 glass-panel rounded-xl p-6 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden scanning-effect">
            {errorMessage ? (
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-error/20 border border-error/40 flex items-center justify-center mx-auto text-error">
                  <span className="material-symbols-outlined text-3xl">error</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-error">Analysis Error</h2>
                <p className="font-body-md text-on-surface-variant text-sm max-w-md mx-auto">
                  {errorMessage}
                </p>
                <button
                  onClick={() => {
                    clearActiveAudioFile();
                    navigate('/analyze');
                  }}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-caps text-label-caps hover:bg-primary-fixed transition-colors shadow-lg cursor-pointer"
                >
                  Return to Upload
                </button>
              </div>
            ) : (
              <>
                <div className="w-32 h-32 rounded-full border border-primary-container/30 flex items-center justify-center relative mb-6">
                  <div
                    className="absolute inset-0 rounded-full border-2 border-t-primary-container border-r-transparent border-b-transparent border-l-transparent animate-spin"
                    style={{ animationDuration: '3s' }}
                  ></div>
                  <div
                    className="absolute inset-2 rounded-full border-2 border-b-secondary-container border-t-transparent border-r-transparent border-l-transparent animate-spin"
                    style={{ animationDuration: '2s', animationDirection: 'reverse' }}
                  ></div>
                  <span className="material-symbols-outlined text-5xl text-primary-container drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]">
                    waves
                  </span>
                </div>

                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary text-center mb-2">
                  Analyzing machine sound...
                </h1>
                <p className="font-data-mono text-data-mono text-primary-fixed-dim text-center drop-shadow-[0_0_4px_rgba(0,218,243,0.5)]">
                  Running machine-invariant ML model inference on {machine.name}...
                </p>

                {/* Animated Waveform Bars */}
                <div className="absolute bottom-4 left-4 right-4 h-12 flex items-end gap-1 justify-between opacity-70">
                  {[4, 8, 12, 6, 16, 10, 4, 8, 12, 6, 16, 10, 12, 6, 16, 10].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary-container transition-all duration-200 animate-pulse"
                      style={{
                        height: `${h * 4}px`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Progress Checklist */}
          {!errorMessage && (
            <div className="w-full md:w-80 glass-panel rounded-xl p-6 flex flex-col justify-center border border-white/10">
              <div className="font-label-caps text-label-caps text-on-surface-variant mb-6 border-b border-white/10 pb-2">
                ANALYSIS PROGRESS
              </div>
              <ul className="space-y-6">
                {[
                  'Audio captured',
                  'Noise filtering',
                  'Frequency analysis',
                  'Acoustic pattern extraction',
                  'AI anomaly detection'
                ].map((stepLabel, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;

                  return (
                    <li key={idx} className="flex items-center gap-4">
                      {isDone ? (
                        <div className="w-6 h-6 rounded-full bg-secondary-container/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px] text-secondary-container">check</span>
                        </div>
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-primary-container/20 flex items-center justify-center pulse-ring">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px] text-outline-variant">schedule</span>
                        </div>
                      )}

                      <span
                        className={`font-body-md ${
                          isDone
                            ? 'text-on-surface opacity-70'
                            : isCurrent
                            ? 'text-primary font-semibold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                            : 'text-outline-variant'
                        }`}
                      >
                        {stepLabel}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
