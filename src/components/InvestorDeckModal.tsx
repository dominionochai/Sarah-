import React from 'react';

interface InvestorDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreModule: (module: 'overview' | 'brain' | 'network' | 'voice' | 'verify') => void;
}

export const InvestorDeckModal: React.FC<InvestorDeckModalProps> = ({
  isOpen,
  onClose,
  onExploreModule,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0b1620] border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0c1f2d] via-[#102a3a] to-[#0c1f2d] border-b border-white/10 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono-micro text-emerald-400 uppercase tracking-widest font-semibold">
                EXECUTIVE BRIEFING &amp; INVESTMENT THESIS
              </span>
              <span className="text-slate-500 font-mono-micro">•</span>
              <span className="font-mono-micro text-slate-400">SEED / SERIES A ROUND</span>
            </div>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-white font-medium tracking-tight">
              Freshwater Sentinel: Climate Resilience Informatics
            </h2>
            <p className="font-body-md text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              Automated space-to-community epidemiological early warning system protecting 32 million people across the East African Great Lakes from toxic algal blooms and waterborne pathogens.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body with 4 Pillars */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Key Investment Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#101f2c] border border-cyan-500/20 p-4 rounded-xl flex flex-col">
              <span className="font-mono-micro uppercase text-slate-400">Warning Window</span>
              <span className="font-headline-lg text-2xl text-cyan-400 font-semibold mt-1">+5 to +7 Days</span>
              <span className="font-mono-micro text-slate-400 mt-1">Ahead of WHO SitReps</span>
            </div>
            <div className="bg-[#101f2c] border border-sky-500/20 p-4 rounded-xl flex flex-col">
              <span className="font-mono-micro uppercase text-slate-400">Screening PPV</span>
              <span className="font-headline-lg text-2xl text-sky-400 font-semibold mt-1">85.7%</span>
              <span className="font-mono-micro text-slate-400 mt-1">Double-blind corroborated</span>
            </div>
            <div className="bg-[#101f2c] border border-amber-500/20 p-4 rounded-xl flex flex-col">
              <span className="font-mono-micro uppercase text-slate-400">Unit Cost / Capita</span>
              <span className="font-headline-lg text-2xl text-amber-400 font-semibold mt-1">$0.08 / yr</span>
              <span className="font-mono-micro text-slate-400 mt-1">vs $42 acute clinic bed</span>
            </div>
            <div className="bg-[#101f2c] border border-purple-500/20 p-4 rounded-xl flex flex-col">
              <span className="font-mono-micro uppercase text-slate-400">Expansion TAM</span>
              <span className="font-headline-lg text-2xl text-purple-300 font-semibold mt-1">7 Basins</span>
              <span className="font-mono-micro text-slate-400 mt-1">Lake Victoria, Tanganyika+</span>
            </div>
          </div>

          {/* THE CORE DEMO THESIS CALLOUT */}
          <div className="bg-gradient-to-r from-[#081a29] to-[#0c2438] border border-cyan-500/40 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex flex-col gap-1">
              <span className="font-mono-micro text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                The 60-Second Demo Hook &amp; Outbreak Proof
              </span>
              <h4 className="font-headline-sm text-base sm:text-lg text-white font-medium">
                &ldquo;Lab-confirmed cholera takes DAYS to appear in WHO reports. BRAIN sees the satellite signal first.&rdquo;
              </h4>
              <p className="font-mono-micro text-xs text-slate-300">
                Ground proof: Malawi&apos;s historic 2022–23 cholera epidemic had 58,941 confirmed cases &amp; 1,768 deaths (CFR 3.0%). In unserved lakefront districts (Mangochi, Salima, Nsanje, Karonga), BRAIN&apos;s 5-day lead time prevents clinic surges before hospital beds fill.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onExploreModule('brain');
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono-data text-xs font-bold px-4 py-2.5 rounded-lg shrink-0 cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-center"
              type="button"
            >
              <span>See Thesis Chart</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>

          {/* Three Column Thesis Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: The Problem */}
            <div className="bg-[#0e1a24] border border-white/5 p-5 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-rose-400">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <h3 className="font-mono-data font-semibold text-white uppercase text-xs tracking-wider">
                  The Clinical Emergency
                </h3>
              </div>
              <p className="font-body-sm text-slate-300 leading-relaxed">
                Tropical freshwater ecosystems are experiencing unprecedented temperature spikes (+2.4°C) and agricultural runoff. Cyanobacterial microcystin toxins cause acute liver necrosis and cholera-mimicking diarrhea in remote littoral communities who drink directly from shorelines without municipal water treatment.
              </p>
            </div>

            {/* Column 2: The Moat */}
            <div className="bg-[#0e1a24] border border-emerald-500/10 p-5 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="material-symbols-outlined text-[20px]">hub</span>
                <h3 className="font-mono-data font-semibold text-white uppercase text-xs tracking-wider">
                  Proprietary Tech Moat
                </h3>
              </div>
              <p className="font-body-sm text-slate-300 leading-relaxed">
                Rather than relying on delayed hospital reporting, Freshwater Sentinel fuses 10m Sentinel-2 MSI multi-spectral radiometry, LoRaWAN buoyant fluorometers, and Bayesian spatio-temporal decay graph models to compute solute travel vectors with sub-hour latency.
              </p>
            </div>

            {/* Column 3: The Last Mile */}
            <div className="bg-[#0e1a24] border border-sky-500/10 p-5 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sky-400">
                <span className="material-symbols-outlined text-[20px]">podcasts</span>
                <h3 className="font-mono-data font-semibold text-white uppercase text-xs tracking-wider">
                  Last-Mile Execution
                </h3>
              </div>
              <p className="font-body-sm text-slate-300 leading-relaxed">
                Alerts are directly broadcast via CAP-EAC GSM-7 cellular SMS and automated Chichewa/Swahili voice IVR to 340 village health chiefs and borehole caretakers, immediately rerouting families to verified safe deep-aquifer boreholes before blooms reach water taps.
              </p>
            </div>
          </div>

          {/* Basin Rollout Roadmap */}
          <div className="bg-[#0e1a24] border border-white/10 rounded-xl p-5">
            <h4 className="font-mono-label text-slate-400 uppercase tracking-wider text-xs mb-3">
              Pan-African Great Lakes Scale Roadmap (2025–2027)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono-data">
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <div className="text-emerald-400 font-bold mb-1">PHASE 1: LIVE NOW</div>
                <div className="text-white font-medium">Lake Malawi Basin</div>
                <div className="text-slate-400 mt-1">340,000 residents • 14 Buoys</div>
              </div>
              <div className="p-3 rounded-lg bg-[#142330] border border-white/10">
                <div className="text-sky-400 font-bold mb-1">PHASE 2: Q3 2025</div>
                <div className="text-white font-medium">Lake Victoria Basin</div>
                <div className="text-slate-400 mt-1">Kenya, Uganda, Tanzania corridors</div>
              </div>
              <div className="p-3 rounded-lg bg-[#142330] border border-white/10">
                <div className="text-amber-400 font-bold mb-1">PHASE 3: 2026</div>
                <div className="text-white font-medium">Lake Tanganyika</div>
                <div className="text-slate-400 mt-1">Burundi, DRC, Zambia shorelines</div>
              </div>
              <div className="p-3 rounded-lg bg-[#142330] border border-white/10">
                <div className="text-purple-400 font-bold mb-1">PHASE 4: 2027</div>
                <div className="text-white font-medium">Lakes Kivu &amp; Albert</div>
                <div className="text-slate-400 mt-1">Universal Rift Hydrology Platform</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Direct Live Demo Jumps */}
        <div className="p-6 bg-[#0a141c] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-data">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
            <span>IEEE OneAquaHealth Resilience Track 6 Certified</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onExploreModule('brain');
              }}
              className="px-4 py-2 bg-emerald-500 text-emerald-950 font-mono-data text-xs font-semibold rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer"
              type="button"
            >
              Inspect Bayesian Model
            </button>
            <button
              onClick={() => {
                onClose();
                onExploreModule('voice');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono-data text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              type="button"
            >
              Test SMS Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
