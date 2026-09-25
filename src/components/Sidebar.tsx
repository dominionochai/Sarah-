import React from 'react';
import { NavigationPath } from '../types/index.ts';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  syncTimeText?: string;
}

interface NavItem {
  id: NavigationPath;
  label: string;
  kicker: string;
  icon: string;
  alertCount?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Executive Overview', kicker: 'Basin Status & Map', icon: 'grid_view' },
  { id: 'eyes', label: 'Eyes (Satellite)', kicker: 'Optical Radiometry', icon: 'satellite_alt' },
  { id: 'brain', label: 'Brain (Forecast)', kicker: 'Bayesian Lead-Time', icon: 'neurology', alertCount: 88 },
  { id: 'voice', label: 'Voice (Dispatch)', kicker: 'Cellular Broadcast', icon: 'podcasts' },
  { id: 'network', label: 'Network (Topology)', kicker: 'Basin Sluice Control', icon: 'hub' },
  { id: 'hands', label: 'Hands (Field Teams)', kicker: 'Bottle Sample Stewards', icon: 'assignment_turned_in' },
  { id: 'verify', label: 'Verify (Validation)', kicker: '365d Empirical Audit', icon: 'verified' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  syncTimeText = '14m ago',
}) => {
  return (
    <aside className="fixed left-0 top-[68px] bottom-0 w-[230px] bg-[#070e14] border-r border-slate-800/80 z-40 flex flex-col justify-between py-4 select-none">
      <div className="flex flex-col">
        <div className="px-4 pb-2 mb-2 border-b border-slate-800/60 flex items-center justify-between">
          <span className="font-mono-micro text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            SURVEILLANCE MODULES
          </span>
          <span className="font-mono-micro text-xs text-slate-400">
            {syncTimeText}
          </span>
        </div>

        <nav className="flex flex-col w-full gap-1 px-2.5">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left w-full cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/80 text-white font-medium border-l-2 border-l-teal-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
                type="button"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[19px] shrink-0 ${
                      isActive ? 'text-teal-400' : 'text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm text-xs font-semibold truncate leading-tight">
                      {item.label}
                    </span>
                    <span className="font-mono-micro text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                      {item.kicker}
                    </span>
                  </div>
                </div>

                {item.alertCount && (
                  <span className="font-mono-data text-[10px] text-rose-400 font-bold">
                    {item.alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="px-4 pt-3 border-t border-slate-800/60 flex flex-col gap-1 text-slate-500 font-mono-micro text-[11px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>OPERATOR:</span>
          <span className="text-slate-300 font-medium">Salima DHO Desk</span>
        </div>
        <div className="flex items-center justify-between">
          <span>COORDINATES:</span>
          <span>13.8°S, 34.4°E</span>
        </div>
      </div>
    </aside>
  );
};
