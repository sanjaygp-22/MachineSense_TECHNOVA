import React from 'react';

export default function AudioFileCard({ fileInfo, onRemove, onAnalyze, isProcessing }) {
  if (!fileInfo) return null;

  const { name, format, sizeFormatted, durationFormatted, audioUrl } = fileInfo;

  return (
    <div className="glass-panel rounded-xl p-6 border border-primary-container/30 relative overflow-hidden transition-all shadow-[0_0_20px_rgba(0,229,255,0.15)] bg-[#151d1e]/90">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-12 h-12 rounded-lg bg-primary-container/10 border border-primary-container/30 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary-container text-2xl">
              graphic_eq
            </span>
          </div>
          <div className="truncate">
            <h4 className="font-headline-md text-body-lg text-on-surface truncate font-semibold">
              {name}
            </h4>
            <p className="font-data-mono text-data-mono text-outline text-xs mt-0.5">
              {format.toUpperCase()} • {sizeFormatted} • {durationFormatted}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="text-on-surface-variant hover:text-error hover:bg-error/10 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-label-caps cursor-pointer"
          title="Remove selected audio file"
        >
          <span className="material-symbols-outlined text-base">delete</span>
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>

      {/* Inline HTML Audio Player */}
      <div className="mt-4">
        <audio
          src={audioUrl}
          controls
          className="w-full rounded-lg bg-surface-container accent-primary-container h-10"
        />
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onAnalyze}
        disabled={isProcessing}
        className="w-full mt-6 bg-primary-container text-on-primary-container font-headline-md text-[16px] py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-bold"
      >
        <span className="material-symbols-outlined icon-fill text-xl">insights</span>
        {isProcessing ? 'Preparing Audio...' : 'Analyze Uploaded Audio'}
      </button>
    </div>
  );
}
