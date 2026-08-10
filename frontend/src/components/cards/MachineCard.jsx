import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MachineCard({ machine }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return {
          bg: 'bg-secondary/10',
          border: 'border-secondary/20 group-hover:border-secondary/50',
          text: 'text-secondary',
          dot: 'bg-secondary pulse-dot',
          svg: 'text-secondary'
        };
      case 'warning':
        return {
          bg: 'bg-tertiary-container/10',
          border: 'border-tertiary-container/30 group-hover:border-tertiary-container/60',
          text: 'text-tertiary-container',
          dot: 'bg-tertiary-container',
          svg: 'text-tertiary-container'
        };
      case 'critical':
        return {
          bg: 'bg-error/10',
          border: 'border-error/30 group-hover:border-error/60',
          text: 'text-error',
          dot: 'bg-error pulse-dot',
          svg: 'text-error'
        };
      default:
        return {
          bg: 'bg-surface-container',
          border: 'border-white/5',
          text: 'text-on-surface-variant',
          dot: 'bg-outline',
          svg: 'text-on-surface'
        };
    }
  };

  const style = getStatusColor(machine.status);

  return (
    <div
      onClick={() => navigate(`/health?id=${machine.id}`)}
      className="glass-card rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center border ${style.border} transition-colors`}>
            <span className={`material-symbols-outlined ${style.text}`}>
              {machine.icon || 'precision_manufacturing'}
            </span>
          </div>
          <div>
            <h3 className="font-headline-md text-[20px] leading-tight text-on-surface group-hover:text-primary transition-colors">
              {machine.name}
            </h3>
            <p className="font-data-mono text-[12px] text-outline">{machine.code}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0D1117] px-3 py-1 rounded-full border border-white/5">
          <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
          <span className={`font-data-mono text-label-caps ${style.text}`}>
            {machine.healthScore}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <p className="font-label-caps text-label-caps text-outline-variant uppercase mb-1">Location</p>
          <p className="font-body-md text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {machine.location}
          </p>
        </div>
        <div>
          <p className="font-label-caps text-label-caps text-outline-variant uppercase mb-1">Last Analyzed</p>
          <p className="font-body-md text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            {machine.lastAnalyzed}
          </p>
        </div>
      </div>

      <div className="mt-4 h-12 w-full bg-[#0D1117]/50 rounded-lg border border-white/5 relative overflow-hidden flex items-end">
        <svg className={`w-full h-full ${style.svg} opacity-70`} preserveAspectRatio="none" viewBox="0 0 100 20">
          {machine.status === 'Critical' ? (
            <path d="M0,10 Q5,5 10,10 T20,10 T30,15 T40,2 T50,18 T60,5 T70,12 T80,1 T90,15 T100,10" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
          ) : machine.status === 'Warning' ? (
            <path d="M0,10 Q5,15 10,10 T20,10 T30,5 T40,15 T50,10 T60,10 T70,12 T80,8 T90,10 T100,10" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
          ) : (
            <path d="M0,10 Q10,10 20,9 T40,11 T60,10 T80,10 T100,10" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
          )}
        </svg>
      </div>
    </div>
  );
}
