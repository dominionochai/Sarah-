import React from 'react';

interface HeaderProps {
  language: 'EN' | 'SW';
  onToggleLanguage: () => void;
  onOpenHelp: () => void;
  onOpenInvestorDeck: () => void;
  syncTimeText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenHelp,
  onOpenInvestorDeck,
  syncTimeText = '14m ago',
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-[#070e14] border-b border-slate-800/80 px-6 flex items-center justify-between">
      {/* Brand & Mission Anchor */}
      <div className="flex items-center gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
          <span className="material-symbols-outlined text-[20px]">water_ec</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="font-headline-sm text-base sm:text-lg text-white font-medium tracking-tight">
              Freshwater Sentinel
            </span>
            <span className="text-xs text-slate-500 font-mono-data hidden sm:inline">
              IEEE OneAquaHealth
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-micro">
            <span>Lake Malawi Basin</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Salima Sector</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">14 Buoys Online</span>
          </div>
        </div>
      </div>

      {/* Center Environmental Context */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono-data text-slate-400">
        <span>Sentinel-2B Pass: Today 07:40 UTC</span>
        <span aria-hidden="true" className="text-slate-700">|</span>
        <span>Rainy Season Risk: Nov–Apr Active Window</span>
        <span aria-hidden="true" className="text-slate-700">|</span>
        <span className="text-rose-400 font-medium">Demo Lake: Class 1 Alert</span>
      </div>

      {/* Executive Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenInvestorDeck}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono-data text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">business_center</span>
          <span>Investor Briefing</span>
        </button>

        <button
          onClick={onToggleLanguage}
          className="text-xs font-mono-data text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer bg-slate-900/60"
          type="button"
          title="Toggle English / Kiswahili"
        >
          {language === 'EN' ? 'EN / SW' : 'SW / EN'}
        </button>

        <button
          onClick={onOpenHelp}
          aria-label="Documentation"
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer bg-slate-900/60"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px]">help_outline</span>
        </button>
      </div>
    </header>
  );
};
