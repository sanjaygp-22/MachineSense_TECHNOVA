import React from 'react';

export default function WaveformVisualizer() {
  const bars = [30, 60, 100, 40, 80, 50, 90, 40, 70, 30, 50, 20];

  return (
    <div className="h-24 w-full md:w-48 flex items-center justify-center gap-1.5 p-4 rounded-lg bg-surface-container-lowest/80 border border-white/5">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 bg-primary-container rounded-sm animate-pulse"
          style={{
            height: `${h}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}
