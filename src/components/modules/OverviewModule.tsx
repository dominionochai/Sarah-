import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { NavigationPath } from '../../types/index.ts';

interface OverviewModuleProps {
  onNavigate: (path: NavigationPath) => void;
  onShowToast: (msg: string) => void;
  onOpenInvestorDeck: () => void;
}

interface BoreholePin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isDemoLake: boolean;
  status: 'critical' | 'unscreened' | 'safe';
  riskScore: number;
  turbidity: string;
  chlorophyll: string;
  waterSourceType: string;
}

const BOREHOLE_PINS: BoreholePin[] = [
  { id: 'bh-demo', name: 'Demo Lake (MW-DL-01)', lat: -13.7842, lng: 34.6214, isDemoLake: true, status: 'critical', riskScore: 88, turbidity: '41.8 NTU', chlorophyll: '64.2 µg/L', waterSourceType: 'Open Littoral Surface Intake' },
  { id: 'bh-linthipe', name: 'Linthipe Delta Reach', lat: -13.9211, lng: 34.5812, isDemoLake: false, status: 'unscreened', riskScore: 62, turbidity: '38.0 NTU', chlorophyll: '34.1 µg/L', waterSourceType: 'Riverine Confluence' },
  { id: 'bh-senga', name: 'Senga Bay Intake Pier', lat: -13.7214, lng: 34.6190, isDemoLake: false, status: 'unscreened', riskScore: 18, turbidity: '8.4 NTU', chlorophyll: '12.0 µg/L', waterSourceType: 'Communal Shoreline Standpipe' },
  { id: 'bh-chizumulu', name: 'Chizumulu Borehole #3', lat: -13.8821, lng: 34.3412, isDemoLake: false, status: 'safe', riskScore: 12, turbidity: '2.1 NTU', chlorophyll: '1.2 µg/L', waterSourceType: 'Confined Deep Aquifer (Solar Pump)' },
  { id: 'bh-bua', name: 'Bua River Estuary Station', lat: -12.9812, lng: 34.2811, isDemoLake: false, status: 'unscreened', riskScore: 24, turbidity: '14.2 NTU', chlorophyll: '18.4 µg/L', waterSourceType: 'River Mouth Fishing Settlement' },
  { id: 'bh-chia', name: 'Chia Lagoon Outlet Point', lat: -13.0142, lng: 34.3312, isDemoLake: false, status: 'unscreened', riskScore: 51, turbidity: '18.4 NTU', chlorophyll: '29.5 µg/L', waterSourceType: 'Tidal Wetland Inlet' },
  { id: 'bh-nkhotakota', name: 'Nkhotakota Deep Well #4', lat: -12.9214, lng: 34.2981, isDemoLake: false, status: 'safe', riskScore: 15, turbidity: '3.6 NTU', chlorophyll: '1.8 µg/L', waterSourceType: 'Protected Handpump Well' },
  { id: 'bh-dedza', name: 'Dedza Plateau Station BH-402', lat: -14.1205, lng: 34.3120, isDemoLake: false, status: 'unscreened', riskScore: 30, turbidity: '11.0 NTU', chlorophyll: '8.7 µg/L', waterSourceType: 'Hillside Gravity Supply' },
];

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  onNavigate,
  onShowToast,
  onOpenInvestorDeck,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedPin, setSelectedPin] = useState<BoreholePin>(BOREHOLE_PINS[0]);

  // Leaflet map with OpenStreetMap tiles centered on Lake Malawi (-13.8, 34.4, zoom ~9)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-13.8, 34.4],
      zoom: 9,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // OpenStreetMap standard street tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
    }).addTo(map);

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // 8 circular pins: mostly grey (unscreened), one larger pin in red/pink for Demo Lake
    BOREHOLE_PINS.forEach((pin) => {
      if (pin.isDemoLake) {
        // Larger red/pink pin with pulsing outer ring
        const redIcon = L.divIcon({
          className: 'demo-lake-pin-wrap',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; cursor: pointer;">
              <span style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background: rgba(225, 29, 72, 0.4); animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <span style="width: 20px; height: 20px; border-radius: 9999px; background: #e11d48; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;">
                <span style="width: 6px; height: 6px; border-radius: 9999px; background: #ffffff;"></span>
              </span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([pin.lat, pin.lng], { icon: redIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; padding: 4px; color: #0f172a; min-width: 180px;">
            <div style="color: #e11d48; font-weight: 700; font-size: 13px;">${pin.name}</div>
            <div style="color: #475569; font-size: 11px; margin-top: 2px;">${pin.waterSourceType}</div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
              <div>Risk Score: <strong style="color: #e11d48;">${pin.riskScore}/100</strong></div>
              <div>Turbidity: ${pin.turbidity}</div>
              <div>Chl-a: ${pin.chlorophyll}</div>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedPin(pin);
          onShowToast(`Focused: ${pin.name} (Risk ${pin.riskScore}/100)`);
        });
      } else {
        // Small grey / green pin
        const dotColor = pin.status === 'safe' ? '#059669' : '#64748b';
        const greyIcon = L.divIcon({
          className: 'borehole-dot-pin',
          html: `
            <div style="display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; cursor: pointer;">
              <span style="width: 11px; height: 11px; border-radius: 9999px; background: ${dotColor}; border: 2px solid #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.5);"></span>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([pin.lat, pin.lng], { icon: greyIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; padding: 4px; color: #0f172a; min-width: 160px;">
            <div style="font-weight: 700; color: #0f172a;">${pin.name}</div>
            <div style="color: #64748b; font-size: 11px;">${pin.waterSourceType}</div>
            <div style="margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${pin.status === 'safe' ? '#059669' : '#475569'};">
              Status: <strong>${pin.status === 'safe' ? 'Verified Safe' : 'Unscreened'}</strong>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedPin(pin);
          onShowToast(`Inspecting: ${pin.name}`);
        });
      }
    });

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col w-full gap-7 max-w-7xl mx-auto animate-fade-in pb-10">
      {/* Editorial Mission Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-mono-data text-slate-400">
            <span className="text-teal-400 font-semibold">EPIDEMIOLOGICAL SURVEILLANCE DESK</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>MALAWI MINISTRY OF HEALTH &amp; WATER SANITATION</span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-white font-normal tracking-tight">
            Lake Malawi Basin Water Risk Console
          </h1>
          <p className="font-body-md text-sm text-slate-300 max-w-2xl">
            Real-time multi-spectral satellite radiometry fused with in-situ buoy telemetry. Warning communities of cholera and cyanotoxin risk 5 days ahead of clinical reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('brain')}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono-data text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            type="button"
          >
            <span>Run Bayesian Forecast</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Primary Layout: Map (Left ~60%) + Red Alert & Four Metric Tiles (Right ~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (~60% = 7 Cols): Real Leaflet Map, OpenStreetMap tiles centered on (-13.8, 34.4, zoom 9) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="bg-[#0b131c] rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">map</span>
                <span>OpenStreetMap Cartography</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono-data text-[11px]">Center: 13.8°S, 34.4°E (Zoom 9)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono-data">
                <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 1 Anomaly
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span> 7 Unscreened
                </span>
              </div>
            </div>

            {/* Real Leaflet Map with actual roads, place names, and blue lake */}
            <div className="relative w-full h-[520px] rounded-lg overflow-hidden border border-slate-700/80 shadow-inner bg-slate-200">
              <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '520px' }} />

              {/* Map Floating Location Pill */}
              <div className="absolute bottom-3 left-3 z-[500] bg-white/95 backdrop-blur-md px-3 py-2 rounded-md border border-slate-300 shadow text-slate-900 font-mono-data text-xs pointer-events-none">
                <div className="font-bold text-slate-900">Lake Malawi Central Corridor</div>
                <div className="text-[11px] text-slate-600">Salima, Linthipe Delta &amp; Senga Bay</div>
              </div>
            </div>

            {/* Quiet Footer Metadata */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono-data pt-1">
              <span>Tile layer: OpenStreetMap (OSM Carto Standard)</span>
              <span className="text-slate-400">8 In-Situ Boreholes Pinned</span>
            </div>
          </div>
        </div>

        {/* Right Side (~40% = 5 Cols): Red Alert Card + Four Metric Tiles */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 1. Red Alert Card */}
          <div className="bg-[#180a0f] border-2 border-rose-500/80 rounded-xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-rose-900/60 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-mono-data text-rose-400 font-bold uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Active Water Quality Alert</span>
              </div>
              <span className="text-xs font-mono-data text-rose-300 font-bold">
                Level 1 Urgent
              </span>
            </div>

            <div>
              <h2 className="font-headline-sm text-xl text-white font-medium">
                Demo Lake (MW-DL-01) — Contamination Outbreak
              </h2>
              <p className="text-xs text-rose-300/90 font-mono-data mt-0.5">
                Salima Rural Water District · Station MW-DL-01
              </p>
            </div>

            <p className="font-body-sm text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/40 p-3.5 rounded-lg border border-rose-950">
              Significant algal bloom confirmed by Sentinel-2 MSI spectro-radiometry (NDCI +0.384). Surface water temperature anomaly (+2.4°C) and 42mm precipitation runoff detected. <strong>Bathing and direct consumption restricted.</strong>
            </p>

            <div className="flex items-center justify-between text-xs font-mono-data text-slate-300 pt-1">
              <span>Affected: ~14,200 Residents</span>
              <span className="text-emerald-400 font-semibold">Failover: Chizumulu BH-3</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => onNavigate('network')}
                className="bg-rose-600 hover:bg-rose-500 text-white font-mono-data text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                type="button"
              >
                <span>Isolate Intake Gates</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigate('voice')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-data text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                type="button"
              >
                <span>Broadcast Warning</span>
                <span className="material-symbols-outlined text-[15px]">podcasts</span>
              </button>
            </div>
          </div>

          {/* 2. Four Metric Tiles (Bloom Risk, Turbidity, Chlorophyll-a, Screening Uncertainty) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Tile 1: Bloom Risk */}
            <div className="bg-[#0b131c] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs font-mono-data text-slate-400">Bloom Risk</span>
              <div className="my-2">
                <span className="font-headline-sm text-3xl font-normal text-rose-400">88%</span>
                <span className="text-xs text-rose-300 font-medium block mt-0.5">Critical Risk Tier</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono-data border-t border-slate-800/80 pt-1.5 mt-1">
                NDCI index +0.384
              </span>
            </div>

            {/* Tile 2: Turbidity */}
            <div className="bg-[#0b131c] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs font-mono-data text-slate-400">Turbidity</span>
              <div className="my-2">
                <span className="font-headline-sm text-3xl font-normal text-amber-300">41.8</span>
                <span className="text-xs text-slate-300 block mt-0.5">NTU</span>
              </div>
              <span className="text-[11px] text-amber-400/90 font-mono-data border-t border-slate-800/80 pt-1.5 mt-1">
                +140% post-rain flush
              </span>
            </div>

            {/* Tile 3: Chlorophyll-a */}
            <div className="bg-[#0b131c] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs font-mono-data text-slate-400">Chlorophyll-a</span>
              <div className="my-2">
                <span className="font-headline-sm text-3xl font-normal text-emerald-400">64.2</span>
                <span className="text-xs text-slate-300 block mt-0.5">µg/L</span>
              </div>
              <span className="text-[11px] text-emerald-400/90 font-mono-data border-t border-slate-800/80 pt-1.5 mt-1">
                +3.4σ above mean
              </span>
            </div>

            {/* Tile 4: Screening Uncertainty */}
            <div className="bg-[#0b131c] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs font-mono-data text-slate-400">Screening Uncertainty</span>
              <div className="my-2">
                <span className="font-headline-sm text-3xl font-normal text-teal-300">±4.2%</span>
                <span className="text-xs text-slate-300 block mt-0.5">95.8% Bayesian PPV</span>
              </div>
              <span className="text-[11px] text-teal-400/90 font-mono-data border-t border-slate-800/80 pt-1.5 mt-1">
                Calibrated to buoy #02
              </span>
            </div>
          </div>

          {/* Real Field Steward Presence Strip */}
          <div className="bg-[#0b131c] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono-data text-slate-300">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-400 text-[18px]">verified_user</span>
              <span>Duty Limnologist: <strong className="text-white">Dr. C. Phiri (Salima DHO)</strong></span>
            </div>
            <span className="text-slate-500">Shift 06:00–18:00</span>
          </div>
        </div>
      </div>

      {/* Human Ground-Truth Strip: Physical Water Testing in Action */}
      <div className="bg-[#0b131c] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-700">
            <img
              src="/src/assets/images/water_field_testing_1790357264353.jpg"
              alt="Limnologist Water Quality Sampling in Malawi"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-mono-data text-teal-400 font-semibold">
              FIELD STEWARDSHIP &amp; GROUND TRUTH BOTTLE TESTING
            </div>
            <h3 className="font-headline-sm text-base sm:text-lg text-white font-medium">
              Physical Spectrophotometer Sampling within 12 Hours of Satellite Breach
            </h3>
            <p className="font-body-sm text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Automated Sentinel-2 radiometric detections do not act alone. Field units with portable fluorometers and Secchi disks verify cyanotoxin concentrations before municipal sluice gates are altered.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('hands')}
          className="text-xs font-mono-data text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1.5 self-start md:self-center shrink-0 border border-teal-500/30 px-3.5 py-2 rounded-lg hover:border-teal-400 transition-colors"
          type="button"
        >
          <span>View Field Kanban</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
