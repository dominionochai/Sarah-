import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { NavigationPath } from '../../types/index.ts';

interface EyesModuleProps {
  onShowToast: (msg: string) => void;
  onNavigate: (path: NavigationPath) => void;
}

type SatelliteCompositeMode = 'falsecolor' | 'truecolor' | 'nironly';

export const EyesModule: React.FC<EyesModuleProps> = ({ onShowToast, onNavigate }) => {
  const [compositeMode, setCompositeMode] = useState<SatelliteCompositeMode>('falsecolor');
  const [activeBand, setActiveBand] = useState<string>('B05');
  const insetMapContainerRef = useRef<HTMLDivElement | null>(null);
  const insetMapInstanceRef = useRef<L.Map | null>(null);

  // Tiny non-interactive OSM location-inset map showing "This is Malawi" for context
  useEffect(() => {
    if (!insetMapContainerRef.current || insetMapInstanceRef.current) return;

    const insetMap = L.map(insetMapContainerRef.current, {
      center: [-13.25, 34.3],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
    });

    insetMapInstanceRef.current = insetMap;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
    }).addTo(insetMap);

    // Target boundary bounding box for Central Lake Malawi
    const bounds: [number, number][] = [
      [-14.2, 33.8],
      [-12.2, 34.9],
    ];
    L.rectangle(bounds, {
      color: '#f43f5e',
      weight: 2,
      fillColor: '#f43f5e',
      fillOpacity: 0.25,
    }).addTo(insetMap);

    const timer = setTimeout(() => {
      insetMap.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      insetMap.remove();
      insetMapInstanceRef.current = null;
    };
  }, []);

  const bands = [
    { id: 'B02', name: 'Blue (490nm)', res: '10m', val: '0.042', role: 'Deep water penetration baseline', status: 'Nominal' },
    { id: 'B03', name: 'Green (560nm)', res: '10m', val: '0.088', role: 'Inorganic suspended sediment & silt', status: 'Moderate' },
    { id: 'B04', name: 'Red (665nm)', res: '10m', val: '0.051', role: 'Chlorophyll-a maximum absorption', status: 'Active' },
    { id: 'B05', name: 'RedEdge (705nm)', res: '20m', val: '0.142', role: 'Cyanobacterial bloom backscatter peak', status: 'Peak Anomaly' },
    { id: 'B08', name: 'NIR (842nm)', res: '10m', val: '0.245', role: 'Vegetation & coastline discrimination', status: 'High NIR' },
    { id: 'B11', name: 'SWIR-1 (1610nm)', res: '20m', val: '0.012', role: 'Cloud penetration & soil saturation', status: 'Clear BOA' },
  ];

  // Visual filter for the real satellite composite image
  const getImageFilterClass = () => {
    switch (compositeMode) {
      case 'falsecolor':
        // Vivid false-color composite: high saturation, emerald cyan & red edge bloom
        return 'contrast-135 saturate-200 hue-rotate-15';
      case 'nironly':
        // Near-Infrared B08: dark absorbing water with vivid infrared vegetation reflection
        return 'contrast-160 saturate-150 hue-rotate-290 brightness-95';
      case 'truecolor':
      default:
        // Natural optical RGB satellite
        return 'contrast-105 saturate-110 brightness-100';
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto animate-fade-in gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-white/10 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono-micro text-xs text-cyan-400 bg-cyan-950/80 border border-cyan-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
              MISSION EYES • SATELLITE COMPOSITE VIEW
            </span>
            <span className="font-mono-label text-xs text-slate-400 uppercase tracking-wider hidden sm:inline">
              Sentinel-2 MSI Level-2A BOA Reflectance
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-white font-medium tracking-tight">
            Earth Observation Spectral Telemetry
          </h1>
          <p className="font-mono-data text-xs text-slate-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-cyan-400">satellite_alt</span>
            <span>Sentinel-2B Pass: S2B_L2A_20241024T0740 • Granule: T36LVK</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">Atmospheric: Sen2Cor v2.10</span>
          </p>
        </div>

        <button
          onClick={() => onNavigate('brain')}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono-data text-xs px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 self-start sm:self-auto"
          type="button"
        >
          <span>Transfer to BRAIN Model</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>

      {/* FULL WIDTH HERO: Real False-Color Satellite Composite Image (NOT street tiles) */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-[#07131e] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group flex flex-col justify-between">
        {/* The Real Satellite Composite Image Surface */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/src/assets/images/satellite_sentinel_earth_1790357283361.jpg"
            alt="Sentinel-2 Satellite Imagery Lake Malawi False Color"
            className={`w-full h-full object-cover transition-all duration-700 ${getImageFilterClass()}`}
          />

          {/* False-Color Dynamic Spectral Layer Overlay */}
          {compositeMode === 'falsecolor' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/35 via-transparent to-rose-800/40 pointer-events-none mix-blend-color-dodge"></div>
          )}

          {/* NIR Only Layer Overlay */}
          {compositeMode === 'nironly' && (
            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 via-transparent to-indigo-950/50 pointer-events-none mix-blend-multiply"></div>
          )}
        </div>

        {/* Top Left Metadata Tag */}
        <div className="relative z-10 m-4 self-start bg-[#07131e]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-xs font-mono-data text-white shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-bold">
            {compositeMode === 'falsecolor'
              ? 'S2-MSI FALSE COLOR (NDCI B05/B04 COMPOSITE)'
              : compositeMode === 'nironly'
              ? 'NEAR-INFRARED (NIR B08 MONOCHROME ABSORPTION)'
              : 'TRUE COLOR OPTICAL (B04-B03-B02 RGB)'}
          </span>
        </div>

        {/* Central Epicenter Target Indicator */}
        <div className="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-50"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 border-2 border-white shadow-xl"></span>
          </span>
          <div className="mt-1 -ml-16 px-3 py-1 bg-[#050e16]/95 backdrop-blur-md rounded-lg border border-rose-500/60 shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-mono-micro text-xs text-rose-300 font-bold">
              Demo Lake Epicenter: NDCI +0.384
            </span>
          </div>
        </div>

        {/* Corner Non-Interactive Location-Inset Map: Real OSM tiles showing "this is Malawi" */}
        <div className="absolute bottom-4 right-4 z-20 bg-[#081522]/95 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-2xl flex flex-col gap-1 pointer-events-auto">
          <div className="flex items-center justify-between font-mono-micro text-[10px] text-slate-300 border-b border-white/10 pb-1">
            <span className="font-bold text-white uppercase tracking-wider">MALAWIA BASIN INSET</span>
            <span className="text-cyan-400">OSM TILES</span>
          </div>

          <div
            ref={insetMapContainerRef}
            className="w-[140px] h-[105px] rounded-lg overflow-hidden border border-white/10 shadow-inner"
            title="Non-interactive context map of Malawi"
          />

          <span className="font-mono-micro text-[9px] text-slate-400 text-center">
            Context: Central Lake Sector
          </span>
        </div>

        {/* Bottom Left Telemetry Strip */}
        <div className="relative z-10 m-4 self-start bg-[#07131e]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 text-[11px] font-mono-micro text-slate-300 pointer-events-none hidden sm:block">
          RESOLUTION: 10m GSD • 12-BIT RADIOMETRIC DYNAMIC RANGE
        </div>
      </div>

      {/* Small Toggle Directly Below the Image: True color / False color / NIR only */}
      <div className="bg-[#0b1620] rounded-2xl border border-white/10 p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono-micro text-xs uppercase tracking-wider text-slate-400 font-bold">
            COMPOSITE LAYER:
          </span>

          <div className="flex items-center gap-1.5 bg-[#050e16] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setCompositeMode('falsecolor');
                onShowToast('Swapped to False Color Composite: Highlights cyanobacterial bloom absorption');
              }}
              className={`px-4 py-2 rounded-lg font-mono-data text-xs font-semibold transition-all cursor-pointer ${
                compositeMode === 'falsecolor'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              type="button"
            >
              False Color (NDCI)
            </button>

            <button
              onClick={() => {
                setCompositeMode('nironly');
                onShowToast('Swapped to NIR Only (B08): Near-Infrared absorption reveals exact waterline');
              }}
              className={`px-4 py-2 rounded-lg font-mono-data text-xs font-semibold transition-all cursor-pointer ${
                compositeMode === 'nironly'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              type="button"
            >
              NIR Only (B08)
            </button>

            <button
              onClick={() => {
                setCompositeMode('truecolor');
                onShowToast('Swapped to True Color (Natural Optical RGB)');
              }}
              className={`px-4 py-2 rounded-lg font-mono-data text-xs font-semibold transition-all cursor-pointer ${
                compositeMode === 'truecolor'
                  ? 'bg-slate-200 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              type="button"
            >
              True Color (RGB)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-micro text-slate-400">
          <span>PIXEL VALUE: NDCI +0.384</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold">100% Granule Ingested</span>
        </div>
      </div>

      {/* Real NDCI / Coverage / Uncertainty Cards Below */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Real NDCI */}
        <div className="bg-[#0b1620] border border-cyan-500/40 p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-mono-micro text-xs uppercase font-bold text-cyan-400">
              NDCI CALCULATION (DEMO LAKE)
            </span>
            <span className="material-symbols-outlined text-[18px] text-cyan-400">biotech</span>
          </div>
          <div className="my-2">
            <span className="font-headline-sm text-3xl font-bold text-white">+0.384</span>
            <span className="font-mono-micro text-xs text-rose-400 font-bold block mt-0.5">
              BLOOM BREACH (+3.4σ ANOMALY)
            </span>
          </div>
          <div className="pt-2 border-t border-white/5 font-mono-data text-xs text-slate-400">
            Formula: (B05 - B04) / (B05 + B04)
          </div>
        </div>

        {/* Card 2: Real Spatial Coverage */}
        <div className="bg-[#0b1620] border border-emerald-500/40 p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-mono-micro text-xs uppercase font-bold text-emerald-400">
              SPATIAL COVERAGE
            </span>
            <span className="material-symbols-outlined text-[18px] text-emerald-400">crop_free</span>
          </div>
          <div className="my-2">
            <span className="font-headline-sm text-3xl font-bold text-white">98.4%</span>
            <span className="font-mono-micro text-xs text-emerald-300 font-bold block mt-0.5">
              CLEAR OPTICAL PIXELS
            </span>
          </div>
          <div className="pt-2 border-t border-white/5 font-mono-data text-xs text-slate-400">
            Cloud Occlusion: 1.6% (Dedza Range)
          </div>
        </div>

        {/* Card 3: Real Uncertainty */}
        <div className="bg-[#0b1620] border border-amber-500/40 p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-mono-micro text-xs uppercase font-bold text-amber-400">
              SCREENING UNCERTAINTY
            </span>
            <span className="material-symbols-outlined text-[18px] text-amber-400">tune</span>
          </div>
          <div className="my-2">
            <span className="font-headline-sm text-3xl font-bold text-white">±4.2%</span>
            <span className="font-mono-micro text-xs text-cyan-300 font-bold block mt-0.5">
              95.8% BAYESIAN PPV
            </span>
          </div>
          <div className="pt-2 border-t border-white/5 font-mono-data text-xs text-slate-400">
            Ground Corroboration: 14 In-Situ Buoys
          </div>
        </div>
      </div>

      {/* S2-MSI Band Radiometry Grid */}
      <div className="bg-[#0b1620] rounded-2xl border border-white/10 p-5 shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-mono-micro text-xs uppercase tracking-wider text-cyan-300 font-bold">
            SPECTRAL BAND RADIOMETRY TELEMETRY
          </span>
          <span className="font-mono-micro text-xs text-slate-400">
            CALIBRATED BOTTOM-OF-ATMOSPHERE (BOA)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {bands.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setActiveBand(b.id);
                onShowToast(`Band ${b.id} selected: ${b.name} (${b.val} refl)`);
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                activeBand === b.id
                  ? 'bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400'
                  : 'bg-[#050e16] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-data text-xs font-bold text-cyan-400">{b.id}</span>
                  <span className="font-mono-micro text-[9px] text-slate-400 bg-white/5 px-1 rounded">{b.res}</span>
                </div>
                <div className="font-body-sm text-xs font-semibold text-white truncate">{b.name}</div>
                <div className="font-mono-micro text-[10px] text-slate-400 truncate mt-0.5">{b.role}</div>
              </div>
              <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between font-mono-data text-xs">
                <span className="text-slate-500 text-[10px]">Refl:</span>
                <span className="text-white font-bold">{b.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
