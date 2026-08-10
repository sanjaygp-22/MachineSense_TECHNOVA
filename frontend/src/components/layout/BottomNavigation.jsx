import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface-container-low/90 backdrop-blur-lg rounded-t-xl border-t border-white/5 shadow-2xl">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-all ${
            isActive
              ? 'text-primary-container font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] scale-95'
              : 'text-on-surface-variant/70 hover:text-primary-fixed'
          }`
        }
      >
        <span className="material-symbols-outlined mb-1">dashboard</span>
        <span className="font-label-caps text-[10px]">Dashboard</span>
      </NavLink>

      <NavLink
        to="/machines"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-all ${
            isActive
              ? 'text-primary-container font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] scale-95'
              : 'text-on-surface-variant/70 hover:text-primary-fixed'
          }`
        }
      >
        <span className="material-symbols-outlined mb-1">precision_manufacturing</span>
        <span className="font-label-caps text-[10px]">Machines</span>
      </NavLink>

      <NavLink
        to="/analyze"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-all ${
            isActive
              ? 'text-primary-container font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] scale-95'
              : 'text-on-surface-variant/70 hover:text-primary-fixed'
          }`
        }
      >
        <span className="material-symbols-outlined mb-1 icon-fill">mic</span>
        <span className="font-label-caps text-[10px]">Analyze</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-all ${
            isActive
              ? 'text-primary-container font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] scale-95'
              : 'text-on-surface-variant/70 hover:text-primary-fixed'
          }`
        }
      >
        <span className="material-symbols-outlined mb-1">history</span>
        <span className="font-label-caps text-[10px]">History</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-all ${
            isActive
              ? 'text-primary-container font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] scale-95'
              : 'text-on-surface-variant/70 hover:text-primary-fixed'
          }`
        }
      >
        <span className="material-symbols-outlined mb-1">person</span>
        <span className="font-label-caps text-[10px]">Profile</span>
      </NavLink>
    </nav>
  );
}
