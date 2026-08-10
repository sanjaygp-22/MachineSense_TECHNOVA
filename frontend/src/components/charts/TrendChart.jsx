import React from 'react';

export default function TrendChart({ height = 200 }) {
  return (
    <div className={`relative w-full h-[${height}px] z-10 flex items-end`}>
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
        <div className="w-full h-px bg-outline"></div>
        <div className="w-full h-px bg-outline"></div>
        <div className="w-full h-px bg-outline"></div>
        <div className="w-full h-px bg-outline"></div>
      </div>

      {/* SVG Trend Line */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="trendGrad" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.4"></stop>
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0"></stop>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur result="coloredBlur" stdDeviation="2"></feGaussianBlur>
            <feMerge>
              <feMergeNode in="coloredBlur"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>
        {/* Area Fill */}
        <path d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,30 T100,40 L100,100 L0,100 Z" fill="url(#trendGrad)"></path>
        {/* Line */}
        <path className="waveform-path" d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,30 T100,40" fill="none" filter="url(#glow)" stroke="#00e5ff" strokeWidth="1.5"></path>
        {/* Data Points */}
        <circle cx="20" cy="75" fill="#0d1516" r="2" stroke="#00e5ff" strokeWidth="1"></circle>
        <circle cx="40" cy="60" fill="#0d1516" r="2" stroke="#00e5ff" strokeWidth="1"></circle>
        <circle cx="60" cy="65" fill="#0d1516" r="2" stroke="#00e5ff" strokeWidth="1"></circle>
        <circle cx="80" cy="30" fill="#0d1516" r="2" stroke="#00e5ff" strokeWidth="1"></circle>
      </svg>

      {/* X-Axis Labels */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between transform translate-y-6 px-2">
        <span className="font-data-mono text-[10px] text-outline">Mon</span>
        <span className="font-data-mono text-[10px] text-outline">Tue</span>
        <span className="font-data-mono text-[10px] text-outline">Wed</span>
        <span className="font-data-mono text-[10px] text-outline">Thu</span>
        <span className="font-data-mono text-[10px] text-outline">Fri</span>
        <span className="font-data-mono text-[10px] text-outline">Sat</span>
        <span className="font-data-mono text-[10px] text-outline">Sun</span>
      </div>
    </div>
  );
}
