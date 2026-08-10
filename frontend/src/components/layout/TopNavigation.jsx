import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function TopNavigation() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <button className="text-primary hover:bg-white/5 transition-colors p-2 rounded-full hidden md:block">
          <span className="material-symbols-outlined icon-fill">hearing</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold tracking-tighter text-primary dark:text-primary">
          MachineSense
        </h1>
      </div>

      {/* Web Nav (Hidden on Mobile) */}
      <nav className="hidden md:flex items-center gap-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all px-3 py-1.5 rounded-lg font-label-caps text-label-caps uppercase ${
              isActive
                ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] bg-white/5'
                : 'text-on-surface-variant hover:text-primary-fixed hover:bg-white/5'
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/machines"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all px-3 py-1.5 rounded-lg font-label-caps text-label-caps uppercase ${
              isActive
                ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] bg-white/5'
                : 'text-on-surface-variant hover:text-primary-fixed hover:bg-white/5'
            }`
          }
        >
          Machines
        </NavLink>

        <NavLink
          to="/analyze"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all px-3 py-1.5 rounded-lg font-label-caps text-label-caps uppercase ${
              isActive
                ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] bg-white/5'
                : 'text-on-surface-variant hover:text-primary-fixed hover:bg-white/5'
            }`
          }
        >
          Analyze
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all px-3 py-1.5 rounded-lg font-label-caps text-label-caps uppercase ${
              isActive
                ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] bg-white/5'
                : 'text-on-surface-variant hover:text-primary-fixed hover:bg-white/5'
            }`
          }
        >
          History
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all px-3 py-1.5 rounded-lg font-label-caps text-label-caps uppercase ${
              isActive
                ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] bg-white/5'
                : 'text-on-surface-variant hover:text-primary-fixed hover:bg-white/5'
            }`
          }
        >
          Profile
        </NavLink>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/history')}
          className="text-primary hover:bg-white/5 transition-colors p-2 rounded-full relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full pulse-dot"></span>
        </button>
      </div>
    </header>
  );
}
