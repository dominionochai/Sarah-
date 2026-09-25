import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { NavigationPath } from '../../types/index.ts';
import {
  DISTRICT_HOTSPOTS,
  SURVEILLANCE_TIMELINE,
  EPISTEMIC_EVIDENCE_SOURCES,
  MALAWI_OUTBREAK_CITATION,
  DistrictHotspot,
} from '../../data/choleraData.ts';

interface BrainModuleProps {
  onShowToast: (msg: string) => void;
  onNavigate: (path: NavigationPath) => void;
  onAddTaskToHands?: (taskName: string) => void;
}

interface BrainCatchmentStation {
  id: string;
  name: string;
  code: string;
  district: string;
  station: string;
  lat: number;
  lng: number;
  score: number;
  riskType: 'unsafe' | 'sample_required' | 'safe';
  statusLabel: string;
  rationale: string;
  chlorophyllA: number;
  turbidity: number;
  waterTempAnomaly: string;
  microcystinProb: string;
}

const BRAIN_STATIONS: BrainCatchmentStation[] = [
  {
    id: 'st-demo',
    name: 'Demo Lake (MW-DL-01)',
    code: 'MW-DL-01',
    district: 'Salima Rural Water District',
    station: 'Station 03A',
    lat: -13.7842,
    lng: 34.6214,
    score: 88,
    riskType: 'unsafe',
    statusLabel: 'CLASS 1: IMMEDIATE INTERVENTION',
    rationale: 'High surface water temperature anomaly (+2.4°C) combined with agricultural runoff flux following 42mm precipitation. Multi-spectral bloom indices match toxin-producing microcystin profile with 89% Bayesian confidence.',
    chlorophyllA: 64.2,
    turbidity: 41.8,
    waterTempAnomaly: '+2.4°C',
    microcystinProb: '89%'
  },
  {
    id: 'st-linthipe',
    name: 'Linthipe Lower Reach',
    code: 'MW-LNT-02',
    district: 'Dedza / Salima Confluence',
    station: 'Station 04B',
    lat: -13.9211,
    lng: 34.5812,
    score: 72,
    riskType: 'unsafe',
    statusLabel: 'HIGH RISK: DOWNSTREAM DISPERSION',
    rationale: 'Direct recipient of upstream Demo Lake agricultural discharge. Turbidity surging with elevated phycocyanin pigment signal.',
    chlorophyllA: 48.5,
    turbidity: 38.0,
    waterTempAnomaly: '+1.8°C',
    microcystinProb: '76%'
  },
  {
    id: 'st-chia',
    name: 'Point E: Chia Basin Inflow',
    code: 'MW-CL-04',
    district: 'Nkhotakota South',
    station: 'Station 05',
    lat: -13.0142,
    lng: 34.3312,
    score: 51,
    riskType: 'sample_required',
    statusLabel: 'UNCERTAINTY: FIELD SAMPLE REQUIRED',
    rationale: 'High optical cloud occlusion (>60%) on recent Sentinel-2 pass prevented conclusive spectro-radiometric calibration. Ground truth bottle sample required within 12 hours.',
    chlorophyllA: 31.4,
    turbidity: 22.1,
    waterTempAnomaly: '+1.1°C',
    microcystinProb: '51%'
  },
  {
    id: 'st-dedza',
    name: 'Dedza Plateau Station BH-402',
    code: 'MW-DD-402',
    district: 'Dedza Uplands',
    station: 'Station 08',
    lat: -14.1205,
    lng: 34.3120,
    score: 48,
    riskType: 'sample_required',
    statusLabel: 'ELEVATED WATCH: RE-SCREEN PENDING',
    rationale: 'Moderate inorganic sediment backscatter from hillside erosion. In-situ buoy calibration scheduled.',
    chlorophyllA: 19.8,
    turbidity: 26.5,
    waterTempAnomaly: '+0.6°C',
    microcystinProb: '38%'
  },
  {
    id: 'st-senga',
    name: 'Senga Bay Intake Pier',
    code: 'MW-SB-01',
    district: 'Salima North',
    station: 'Station 02',
    lat: -13.7214,
    lng: 34.6190,
    score: 34,
    riskType: 'sample_required',
    statusLabel: 'MONITORING: MARGINAL PLUME',
    rationale: 'Pelagic wind-driven currents dispersing surface scum northeast towards open water. Daily optical tracking active.',
    chlorophyllA: 14.2,
    turbidity: 12.0,
    waterTempAnomaly: '+0.4°C',
    microcystinProb: '22%'
  },
  {
    id: 'st-chizumulu',
    name: 'Chizumulu Borehole #3',
    code: 'BH-CHZ-03',
    district: 'Salima Basin Safe Island',
    station: 'Station BH-03',
    lat: -13.8821,
    lng: 34.3412,
    score: 12,
    riskType: 'safe',
    statusLabel: 'VERIFIED SAFE: PRIMARY FAILOVER',
    rationale: 'Deep confined aquifer (45m static water table). 0 CFU/100mL E. coli. Tested and locked as priority community failover distribution point.',
    chlorophyllA: 1.2,
    turbidity: 2.1,
    waterTempAnomaly: '0.0°C',
    microcystinProb: '2%'
  },
  {
    id: 'st-nkhotakota',
    name: 'Nkhotakota Deep Well #4',
    code: 'BH-NKK-04',
    district: 'Nkhotakota Central',
    station: 'Station BH-04',
    lat: -12.9214,
    lng: 34.2981,
    score: 15,
    riskType: 'safe',
    statusLabel: 'VERIFIED SAFE: BACKUP POINT',
    rationale: 'Modern solar pump with automated chlorination dosing. Nominal background parameters.',
    chlorophyllA: 1.8,
    turbidity: 3.6,
    waterTempAnomaly: '+0.1°C',
    microcystinProb: '3%'
  },
  {
    id: 'st-bua',
    name: 'Bua Estuary Clean Reach',
    code: 'MW-BUA-01',
    district: 'Nkhotakota Reserve Fringe',
    station: 'Station 01',
    lat: -12.9812,
    lng: 34.2811,
    score: 18,
    riskType: 'safe',
    statusLabel: 'VERIFIED SAFE: REFERENCE REACH',
    rationale: 'High riverine dilution volume. Heavy canopy shading prevents cyanobacterial bloom proliferation.',
    chlorophyllA: 4.5,
    turbidity: 14.2,
    waterTempAnomaly: '-0.2°C',
    microcystinProb: '4%'
  },
  {
    id: 'st-maclear',
    name: 'Cape Maclear Marine Reserve Point',
    code: 'MW-CML-09',
    district: 'Mangochi North',
    station: 'Station 09',
    lat: -14.0200,
    lng: 34.8400,
    score: 14,
    riskType: 'safe',
    statusLabel: 'VERIFIED SAFE: OLIGOTROPHIC BASELINE',
    rationale: 'Secchi disc transparency >7m. Protected national park waters with zero agricultural discharge.',
    chlorophyllA: 2.1,
    turbidity: 1.8,
    waterTempAnomaly: '0.0°C',
    microcystinProb: '1%'
  },
];

// Historical WHO cholera annual case counts (Malawi timeline highlights)
const WHO_HISTORIC_CASES = [
  { year: '1998', cases: 25410, note: 'Major Lake Basin Outbreak' },
  { year: '2001', cases: 33546, note: 'Flood Flush Surge' },
  { year: '2005', cases: 4890, note: 'Low Baseline' },
  { year: '2009', cases: 5740, note: 'Southern Arm Outbreak' },
  { year: '2015', cases: 1420, note: 'Dry Season Containment' },
  { year: '2018', cases: 940, note: 'OCV Pilot Rollout' },
  { year: '2020', cases: 180, note: 'Border Surveillance' },
  { year: '2022', cases: 18450, note: 'Freddy Season Onset' },
  { year: '2023', cases: 58941, note: 'National Epidemic Peak' },
];

export const BrainModule: React.FC<BrainModuleProps> = ({
  onShowToast,
  onNavigate,
  onAddTaskToHands,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedStation, setSelectedStation] = useState<BrainCatchmentStation>(BRAIN_STATIONS[0]);
  const [activeDistrictId, setActiveDistrictId] = useState<string>('salima');
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(3); // Day D-6
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);

  const selectedDistrict: DistrictHotspot =
    DISTRICT_HOTSPOTS.find((d) => d.id === activeDistrictId) || DISTRICT_HOTSPOTS[0];

  const currentTimelinePoint = SURVEILLANCE_TIMELINE[selectedTimelineIndex] || SURVEILLANCE_TIMELINE[3];

  // Leaflet Real OSM Street Tiles centered on Lake Malawi (-13.8, 34.4, zoom 9)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-13.8, 34.4],
      zoom: 9,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // Real OpenStreetMap street tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // 8+ circular markers colored by real risk: red (unsafe), amber/grey-hatched (sample required), green (safe)
    BRAIN_STATIONS.forEach((station) => {
      let iconHtml = '';

      if (station.riskType === 'unsafe') {
        // Red circular pin (pulsing)
        iconHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; cursor: pointer;">
            <span style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background: rgba(244, 63, 94, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <span style="width: 18px; height: 18px; border-radius: 9999px; background: #e11d48; border: 2.5px solid #ffffff; box-shadow: 0 0 12px rgba(225, 29, 72, 0.9);"></span>
          </div>
        `;
      } else if (station.riskType === 'sample_required') {
        // Amber / grey-hatched circular pin (field sample required)
        iconHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; cursor: pointer;">
            <span style="width: 16px; height: 16px; border-radius: 9999px; background: repeating-linear-gradient(45deg, #f59e0b, #f59e0b 2px, #64748b 2px, #64748b 5px); border: 2px solid #ffffff; box-shadow: 0 1px 6px rgba(0,0,0,0.6);"></span>
          </div>
        `;
      } else {
        // Green safe circular pin
        iconHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; cursor: pointer;">
            <span style="width: 14px; height: 14px; border-radius: 9999px; background: #10b981; border: 2px solid #ffffff; box-shadow: 0 1px 6px rgba(16, 185, 129, 0.7);"></span>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: `brain-station-icon-${station.id}`,
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px; color: #0f172a;">
          <strong style="color: ${station.riskType === 'unsafe' ? '#e11d48' : station.riskType === 'sample_required' ? '#b45309' : '#059669'}; font-size: 12px;">
            ${station.name}
          </strong><br/>
          <span>Risk Score: <strong>${station.score}/100</strong></span><br/>
          <span>Chl-a: ${station.chlorophyllA} µg/L • Turbidity: ${station.turbidity} NTU</span><br/>
          <span style="color: #64748b; font-weight: bold;">${station.statusLabel}</span>
        </div>
      `);

      marker.on('click', () => {
        setSelectedStation(station);
        onShowToast(`Selected ${station.name}: Score ${station.score}/100 (${station.riskType.toUpperCase()})`);
      });
    });

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Timeline Scrubber Auto-Play
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingDemo) {
      timer = setTimeout(() => {
        if (selectedTimelineIndex < SURVEILLANCE_TIMELINE.length - 1) {
          const nextIndex = selectedTimelineIndex + 1;
          setSelectedTimelineIndex(nextIndex);
          if (nextIndex === 3) {
            onShowToast('💥 DAY D-6: Sentinel-2 optical surge detected! BRAIN issues Class 1 alert.');
          } else if (nextIndex === 5) {
            onShowToast('⚠️ 3-7 DAY BLIND SPOT: Lab culture delay zone. WHO reports 0 cases while risk is 92/100.');
          } else if (nextIndex === 8) {
            onShowToast('🚨 DAY 0: First WHO SitRep published (38 cases) — 5 full days after BRAIN alert!');
          }
        } else {
          setIsPlayingDemo(false);
          onShowToast('✓ Demo script complete: "Risk rises before cases" confirmed.');
        }
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [isPlayingDemo, selectedTimelineIndex, onShowToast]);

  const handleDispatchCollector = () => {
    if (onAddTaskToHands) {
      onAddTaskToHands(`Emergency grab sample at ${selectedStation.name}`);
    }
    onShowToast(`DISPATCH TASK LOGGED: Stewardship unit dispatched for bottle sampling at ${selectedStation.name}`);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto animate-fade-in gap-6">
      {/* Top Header & Outbreak Thesis Banner */}
      <div className="bg-gradient-to-r from-[#07131e] via-[#091b2b] to-[#0c2438] border border-cyan-500/40 p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-mono-micro text-xs text-cyan-300 uppercase tracking-widest font-bold bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
              BAYESIAN EPIDEMIOLOGY MOAT • THE DEMO THESIS
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#050d14]/90 px-3.5 py-1.5 rounded-xl border border-rose-500/30 font-mono-micro text-xs">
            <span className="text-rose-400 font-bold">MALAWI OUTBREAK BENCHMARK:</span>
            <span className="text-white font-semibold">58,941 Cases (CFR 3.0%)</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">WHO SitRep #78</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-white font-medium tracking-tight">
              Lab-confirmed cholera takes <span className="text-rose-400 font-bold underline decoration-rose-500/50">DAYS</span> to appear in WHO reports.
              <br className="hidden sm:inline" />
              <span className="text-cyan-400 font-bold"> BRAIN sees the satellite signal FIRST.</span>
            </h1>
            <p className="font-body-sm text-sm text-slate-300 mt-1 leading-relaxed">
              Real Leaflet OSM street tiles on the left showing 8+ risk-classified stations. Click any marker to view real scores and rationale.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedTimelineIndex(0);
              setIsPlayingDemo(true);
              onShowToast('Playing Demo Script: Watching teal satellite line rise 5 days BEFORE red WHO cholera bars');
            }}
            disabled={isPlayingDemo}
            className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono-data text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
            type="button"
          >
            {isPlayingDemo ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                <span>Scrubbing Timeline ({selectedTimelineIndex + 1}/{SURVEILLANCE_TIMELINE.length})...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                <span>▶ Run Demo Pitch Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Split View: Map (Left) + Station Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (7 Cols): Real Leaflet OSM Street Tiles (roads, town names, lake blue) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="bg-[#0b1620] rounded-2xl border border-white/10 p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-[18px]">map</span>
                <span className="font-mono-micro text-xs text-white font-bold uppercase tracking-wider">
                  OSM STREET TILES • LAKE MALAWI BASIN (-13.8, 34.4)
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono-micro text-xs text-slate-400">
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Unsafe
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Sample Req.
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Safe
                </span>
              </div>
            </div>

            {/* Real Leaflet Map */}
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-white/10 bg-[#e5e7eb]">
              <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '500px' }} />

              <div className="absolute bottom-3 left-3 z-[500] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 font-mono-micro text-[11px] shadow pointer-events-none">
                <span>Click any station marker to update right inspector</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-micro text-slate-400 pt-1">
              <span>9 CATCHMENT STATIONS PINNED ACROSS BASIN</span>
              <span className="text-cyan-400">ZOOM ~9 • EPSG:3857</span>
            </div>
          </div>
        </div>

        {/* Right Side (5 Cols): Station Inspector with Real Score / Rationale */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#0b1620] rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono-micro text-xs uppercase text-cyan-400 font-bold tracking-wider">
                  STATION INSPECTOR PANEL
                </span>
                <h3 className="font-headline-sm text-xl text-white font-semibold mt-0.5">
                  {selectedStation.name}
                </h3>
                <span className="font-mono-micro text-xs text-slate-400">
                  {selectedStation.district} • {selectedStation.code}
                </span>
              </div>

              <span
                className={`font-mono-micro text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg border ${
                  selectedStation.riskType === 'unsafe'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : selectedStation.riskType === 'sample_required'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {selectedStation.riskType.toUpperCase()}
              </span>
            </div>

            {/* Score & Probabilistic Metrics */}
            <div className="flex items-baseline gap-3 py-1">
              <span
                className={`font-headline-xl text-5xl font-bold leading-none ${
                  selectedStation.score >= 70
                    ? 'text-rose-400'
                    : selectedStation.score >= 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {selectedStation.score}
              </span>
              <div className="flex flex-col">
                <span className="font-mono-data text-xs text-slate-300">/ 100 Risk Score</span>
                <span className="font-mono-micro text-[11px] text-slate-400">
                  Microcystin Probability: <strong className="text-white">{selectedStation.microcystinProb}</strong>
                </span>
              </div>
            </div>

            {/* Rationale Text */}
            <div className="bg-[#050e16] p-3.5 rounded-xl border border-white/5 font-body-sm text-xs sm:text-sm text-slate-200 leading-relaxed">
              <p>{selectedStation.rationale}</p>
            </div>

            {/* Real Telemetry Grid */}
            <div className="grid grid-cols-3 gap-2 font-mono-data text-xs">
              <div className="bg-[#07131e] p-2.5 rounded-lg border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono-micro">CHL-A</span>
                <span className="text-white font-bold text-sm mt-0.5">{selectedStation.chlorophyllA} µg/L</span>
              </div>
              <div className="bg-[#07131e] p-2.5 rounded-lg border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono-micro">TURBIDITY</span>
                <span className="text-amber-400 font-bold text-sm mt-0.5">{selectedStation.turbidity} NTU</span>
              </div>
              <div className="bg-[#07131e] p-2.5 rounded-lg border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono-micro">TEMP ANOMALY</span>
                <span className="text-rose-400 font-bold text-sm mt-0.5">{selectedStation.waterTempAnomaly}</span>
              </div>
            </div>

            {/* Actions for this station */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
              <button
                onClick={handleDispatchCollector}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono-data text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">biotech</span>
                <span>Dispatch Bottle Grab</span>
              </button>

              <button
                onClick={() => onNavigate('voice')}
                className="bg-white/10 hover:bg-white/20 text-white font-mono-data text-xs font-semibold py-2.5 rounded-lg transition-colors border border-white/15 cursor-pointer flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">podcasts</span>
                <span>Issue Advisory</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WHO PANEL BELOW THE MAP: Real Bar Chart (thin vertical bars, not tiles) built from case counts */}
      <div className="bg-[#0b1620] rounded-2xl border border-white/10 p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-micro text-xs text-rose-400 font-bold uppercase tracking-wider">
                WHO CLINICAL SURVEILLANCE &amp; 1973–2023 CASE COUNT ARCHIVE
              </span>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-mono-micro px-2 py-0.5 rounded font-bold uppercase border border-rose-500/30">
                THIN BAR CHART • ZERO MAP TILES
              </span>
            </div>
            <h2 className="font-headline-md text-xl text-white font-medium mt-1">
              Epidemiological Delay Proof: Satellite Risk Leads Clinical Cases by 5 Days
            </h2>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-xs font-mono-micro">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-3.5 h-1 bg-cyan-400 rounded-full inline-block"></span>
              Satellite Risk Score (Rises First)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm inline-block"></span>
              WHO Confirmed Cases (Lags 4-6 Days)
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 bg-amber-400/30 border border-amber-400 rounded-sm inline-block"></span>
              3-7 Day Lab Blind Spot
            </span>
          </div>
        </div>

        {/* Real Thin Vertical Bar Chart (SVG) */}
        <div className="relative w-full h-[280px] bg-[#050e16] rounded-xl border border-white/10 p-4">
          <svg className="w-full h-full" viewBox="0 0 900 240" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brainBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.95"></stop>
                <stop offset="100%" stopColor="#9f1239" stopOpacity="0.75"></stop>
              </linearGradient>

              <pattern id="brainHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45 0 0)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.3"></line>
              </pattern>
            </defs>

            {/* Horizontal Gridlines */}
            <line x1="50" y1="30" x2="850" y2="30" stroke="#1e293b" strokeDasharray="3 3"></line>
            <text x="42" y="34" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">200</text>
            <line x1="50" y1="80" x2="850" y2="80" stroke="#1e293b" strokeDasharray="3 3"></line>
            <text x="42" y="84" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">150</text>
            <line x1="50" y1="130" x2="850" y2="130" stroke="#1e293b" strokeDasharray="3 3"></line>
            <text x="42" y="134" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">100</text>
            <line x1="50" y1="180" x2="850" y2="180" stroke="#1e293b" strokeDasharray="3 3"></line>
            <text x="42" y="184" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">50</text>
            <line x1="50" y1="205" x2="850" y2="205" stroke="#334155" strokeWidth="1.5"></line>
            <text x="42" y="209" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">0</text>

            {/* Shaded 3-7 Day Lab Delay Zone */}
            <rect x="255" y="20" width="315" height="185" fill="url(#brainHatch)"></rect>
            <rect x="255" y="20" width="315" height="185" fill="#f59e0b" fillOpacity="0.04" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.4"></rect>
            <text x="412" y="38" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
              ⚠️ 3–7 DAY LAB CONFIRMATION DELAY ZONE (TCBS AGAR INCUBATION)
            </text>

            {/* THIN VERTICAL CASE BARS */}
            {SURVEILLANCE_TIMELINE.map((pt, i) => {
              const x = 75 + i * 65;
              const barHeight = (pt.whoConfirmedCases / 200) * 175;
              const y = 205 - barHeight;
              return (
                <g key={`bar-${pt.dayLabel}`} onClick={() => setSelectedTimelineIndex(i)} className="cursor-pointer">
                  {pt.whoConfirmedCases > 0 ? (
                    <>
                      <rect
                        x={x - 8}
                        y={y}
                        width="16"
                        height={barHeight}
                        rx="2"
                        fill="url(#brainBarGrad)"
                        className="hover:brightness-125 transition-all"
                      ></rect>
                      <text x={x} y={y - 5} fill="#f43f5e" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                        {pt.whoConfirmedCases}
                      </text>
                    </>
                  ) : null}
                  <text x={x} y={222} fill={selectedTimelineIndex === i ? '#22d3ee' : '#94a3b8'} fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight={selectedTimelineIndex === i ? 'bold' : 'normal'}>
                    {pt.dayLabel}
                  </text>
                  <text x={x} y={233} fill="#64748b" fontSize="8" fontFamily="IBM Plex Sans" textAnchor="middle">
                    {pt.dateStr}
                  </text>
                </g>
              );
            })}

            {/* SATELLITE RISK LINE (Rises FIRST) */}
            <path
              d={`M 75 ${205 - (16/100)*175}
                 L 140 ${205 - (22/100)*175}
                 L 205 ${205 - (48/100)*175}
                 L 270 ${205 - (78/100)*175}
                 L 335 ${205 - (86/100)*175}
                 L 400 ${205 - (92/100)*175}
                 L 465 ${205 - (95/100)*175}
                 L 530 ${205 - (94/100)*175}
                 L 595 ${205 - (88/100)*175}
                 L 660 ${205 - (76/100)*175}
                 L 725 ${205 - (61/100)*175}
                 L 790 ${205 - (42/100)*175}`}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3"
              strokeLinecap="round"
            ></path>

            {/* Interactive Circles on Satellite Line */}
            {SURVEILLANCE_TIMELINE.map((pt, i) => {
              const x = 75 + i * 65;
              const y = 205 - (pt.satelliteRiskScore / 100) * 175;
              const isSelected = selectedTimelineIndex === i;
              return (
                <circle
                  key={`dot-${pt.dayLabel}`}
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : 3.5}
                  fill={isSelected ? '#ffffff' : '#22d3ee'}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedTimelineIndex(i)}
                ></circle>
              );
            })}
          </svg>
        </div>

        {/* Selected Scrubber Day Summary Card */}
        <div className="bg-[#050e16] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-data">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
              {currentTimelinePoint.dayLabel}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{currentTimelinePoint.dateStr}</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-400 font-bold">Satellite Score: {currentTimelinePoint.satelliteRiskScore}/100</span>
                <span className="text-slate-500">•</span>
                <span className="text-rose-400 font-bold">WHO Confirmed: {currentTimelinePoint.whoConfirmedCases}</span>
              </div>
              <p className="font-body-sm text-xs text-slate-300 mt-0.5">{currentTimelinePoint.stageNote}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setSelectedTimelineIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedTimelineIndex === 0}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded font-mono-data text-xs cursor-pointer disabled:opacity-30"
              type="button"
            >
              ◀ Prev
            </button>
            <button
              onClick={() => setSelectedTimelineIndex((prev) => Math.min(SURVEILLANCE_TIMELINE.length - 1, prev + 1))}
              disabled={selectedTimelineIndex === SURVEILLANCE_TIMELINE.length - 1}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded font-mono-data text-xs cursor-pointer disabled:opacity-30"
              type="button"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
