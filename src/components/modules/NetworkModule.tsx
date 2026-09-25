import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { NavigationPath } from '../../types/index.ts';

interface NetworkModuleProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: NavigationPath) => void;
}

export const NetworkModule: React.FC<NetworkModuleProps> = ({ onShowToast, onNavigate }) => {
  const [simState, setSimState] = useState<'idle' | 'running' | 'complete'>('idle');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isolationSecured, setIsolationSecured] = useState(false);
  const [selectedNodeName, setSelectedNodeName] = useState<string>('Demo Lake Source');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Markers and layers refs so we can dynamically mutate colors and add polylines
  const sourceMarkerRef = useRef<L.Marker | null>(null);
  const linthipeMarkerRef = useRef<L.Marker | null>(null);
  const estuaryMarkerRef = useRef<L.Marker | null>(null);
  const actHereMarkerRef = useRef<L.Marker | null>(null);
  const flowLinesLayerRef = useRef<L.LayerGroup | null>(null);

  // Real OpenStreetMap street tiles (same as Brain)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-13.82, 34.45],
      zoom: 10,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // Real OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const flowGroup = L.layerGroup().addTo(map);
    flowLinesLayerRef.current = flowGroup;

    // Helper to create circle icons
    const createCircleIcon = (color: string, size = 16, pulse = false, label = '') => {
      return L.divIcon({
        className: 'network-node-icon',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
            ${pulse ? `<span style="position: absolute; width: ${size + 14}px; height: ${size + 14}px; border-radius: 9999px; background: ${color}55; animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
            <span style="width: ${size}px; height: ${size}px; border-radius: 9999px; background: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.6);"></span>
            ${label ? `<span style="margin-top: 4px; background: #081724; color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.7);">${label}</span>` : ''}
          </div>
        `,
        iconSize: [size + 16, size + 16],
        iconAnchor: [(size + 16) / 2, (size + 16) / 2],
      });
    };

    // 1. Demo Lake Source Node (initially neutral blue before demo)
    const sourceMarker = L.marker([-13.7842, 34.6214], {
      icon: createCircleIcon('#0284c7', 16, false, 'Demo Lake'),
    }).addTo(map);
    sourceMarker.bindPopup(`
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px; color: #0f172a;">
        <strong>Demo Lake Intake Point</strong><br/>
        <span>Status: Normal Baseline (Run demo to simulate plume)</span>
      </div>
    `);
    sourceMarker.on('click', () => {
      setSelectedNodeName('Demo Lake Catchment');
      onShowToast('Focused: Demo Lake Catchment Node');
    });
    sourceMarkerRef.current = sourceMarker;

    // 2. Linthipe Junction (initially neutral grey)
    const linthipeMarker = L.marker([-13.9211, 34.5812], {
      icon: createCircleIcon('#64748b', 14, false, 'Linthipe Jct'),
    }).addTo(map);
    linthipeMarker.bindPopup(`
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px; color: #0f172a;">
        <strong>Linthipe Junction Reach</strong><br/>
        <span>Downstream flow channel</span>
      </div>
    `);
    linthipeMarker.on('click', () => {
      setSelectedNodeName('Linthipe Junction Reach');
      onShowToast('Focused: Linthipe Junction Reach');
    });
    linthipeMarkerRef.current = linthipeMarker;

    // 3. Estuary Wetland (initially neutral grey)
    const estuaryMarker = L.marker([-13.7214, 34.6190], {
      icon: createCircleIcon('#64748b', 12, false, 'Senga Estuary'),
    }).addTo(map);
    estuaryMarker.bindPopup(`
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px; color: #0f172a;">
        <strong>Senga Estuary Wetland</strong><br/>
        <span>Discharge to Lake Pelagic Waters</span>
      </div>
    `);
    estuaryMarker.on('click', () => {
      setSelectedNodeName('Senga Estuary Wetland');
      onShowToast('Focused: Senga Estuary Wetland');
    });
    estuaryMarkerRef.current = estuaryMarker;

    // 4. Chizumulu Borehole #3 (initially standard clean marker)
    const chizumuluMarker = L.marker([-13.8821, 34.3412], {
      icon: createCircleIcon('#10b981', 14, false, 'Chizumulu BH-3'),
    }).addTo(map);
    chizumuluMarker.bindPopup(`
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px; color: #0f172a;">
        <strong style="color: #059669;">Chizumulu Borehole #3</strong><br/>
        <span>Clean Confined Aquifer (1.2 km west)</span>
      </div>
    `);
    chizumuluMarker.on('click', () => {
      setSelectedNodeName('Chizumulu Borehole #3');
      onShowToast('Focused: Chizumulu Borehole #3 Primary Safe Failover');
    });
    actHereMarkerRef.current = chizumuluMarker;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // "Run network demo" dynamic trigger:
  // Node turns red, dashed amber lines trace to downstream nodes, starred green marker appears labeled "ACT HERE"
  const handleRunDemo = () => {
    if (isSimulating || !mapInstanceRef.current) return;
    setIsSimulating(true);
    setSimState('running');
    onShowToast('Running Hydrological Network Simulation: Calculating D8 flow routing...');

    const map = mapInstanceRef.current;
    if (flowLinesLayerRef.current) {
      flowLinesLayerRef.current.clearLayers();
    }

    // STEP 1 (0ms): Turn Demo Lake node bright RED with pulsing beacon
    if (sourceMarkerRef.current) {
      sourceMarkerRef.current.setIcon(
        L.divIcon({
          className: 'network-node-icon',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
              <span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: rgba(244, 63, 94, 0.45); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <span style="width: 20px; height: 20px; border-radius: 9999px; background: #e11d48; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(225, 29, 72, 0.95);"></span>
              <span style="margin-top: 4px; background: #1c0a0f; color: #fda4af; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 4px; border: 1.5px solid #f43f5e; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.8);">
                🚨 DEMO LAKE [SOURCE: UNSAFE]
              </span>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })
      );
    }

    // STEP 2 (600ms): Trace dashed amber lines to downstream nodes (Linthipe Jct & Senga Estuary)
    setTimeout(() => {
      onShowToast('Traversing downstream solute velocity (0.38 m/s)... Amber contamination vectors active');

      if (flowLinesLayerRef.current) {
        // Line 1: Demo Lake -> Linthipe Jct
        const line1 = L.polyline(
          [
            [-13.7842, 34.6214],
            [-13.8400, 34.6050],
            [-13.9211, 34.5812],
          ],
          {
            color: '#f59e0b',
            weight: 4.5,
            dashArray: '8, 8',
            opacity: 0.95,
          }
        ).addTo(flowLinesLayerRef.current);

        // Line 2: Linthipe Jct -> Senga Estuary Wetland
        const line2 = L.polyline(
          [
            [-13.9211, 34.5812],
            [-13.8200, 34.6300],
            [-13.7214, 34.6190],
          ],
          {
            color: '#f59e0b',
            weight: 3.5,
            dashArray: '6, 6',
            opacity: 0.85,
          }
        ).addTo(flowLinesLayerRef.current);

        // Line 3: Clean failover diversion line to Chizumulu BH-3
        const safeLine = L.polyline(
          [
            [-13.7842, 34.6214],
            [-13.8300, 34.4500],
            [-13.8821, 34.3412],
          ],
          {
            color: '#10b981',
            weight: 3.5,
            dashArray: '4, 4',
            opacity: 0.9,
          }
        ).addTo(flowLinesLayerRef.current);
      }

      // Linthipe marker turns amber
      if (linthipeMarkerRef.current) {
        linthipeMarkerRef.current.setIcon(
          L.divIcon({
            className: 'network-node-icon',
            html: `
              <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                <span style="width: 16px; height: 16px; border-radius: 9999px; background: #f59e0b; border: 2.5px solid #ffffff; box-shadow: 0 0 10px rgba(245, 158, 11, 0.8);"></span>
                <span style="margin-top: 4px; background: #1c1508; color: #fde68a; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #f59e0b; white-space: nowrap;">
                  Linthipe Jct (+4h Plume)
                </span>
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          })
        );
      }

      // Estuary marker turns amber
      if (estuaryMarkerRef.current) {
        estuaryMarkerRef.current.setIcon(
          L.divIcon({
            className: 'network-node-icon',
            html: `
              <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                <span style="width: 14px; height: 14px; border-radius: 9999px; background: #f59e0b; border: 2px solid #ffffff;"></span>
                <span style="margin-top: 4px; background: #1c1508; color: #fde68a; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #f59e0b; white-space: nowrap;">
                  Senga Estuary (+9h Plume)
                </span>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          })
        );
      }
    }, 800);

    // STEP 3 (1800ms): STARRED GREEN MARKER APPEARS LABELED "ACT HERE"
    setTimeout(() => {
      if (actHereMarkerRef.current) {
        actHereMarkerRef.current.setIcon(
          L.divIcon({
            className: 'network-act-here-icon',
            html: `
              <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; z-index: 1000;">
                <span style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(16, 185, 129, 0.4); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                <div style="width: 32px; height: 32px; border-radius: 9999px; background: #059669; border: 3px solid #ffffff; box-shadow: 0 0 16px rgba(16, 185, 129, 0.95); display: flex; align-items: center; justify-content: center; color: #ffffff;">
                  <span class="material-symbols-outlined" style="font-size: 18px; font-weight: bold;">star</span>
                </div>
                <div style="margin-top: 5px; background: #064e3b; color: #a7f3d0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px; border: 2px solid #34d399; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined" style="font-size: 14px; color: #34d399;">verified</span>
                  <span>ACT HERE (CHIZUMULU BH-3)</span>
                </div>
              </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          })
        );
      }

      setSimState('complete');
      setIsSimulating(false);
      setIsolationSecured(true);
      onShowToast('✓ SIMULATION COMPLETE: Downstream isolation confirmed. Failover locked to Chizumulu BH-3 ("ACT HERE").');
    }, 2000);
  };

  const handleResetDemo = () => {
    setSimState('idle');
    setIsolationSecured(false);
    if (flowLinesLayerRef.current) {
      flowLinesLayerRef.current.clearLayers();
    }
    // Reset nodes back to neutral
    if (sourceMarkerRef.current) {
      sourceMarkerRef.current.setIcon(
        L.divIcon({
          className: 'network-node-icon',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
              <span style="width: 16px; height: 16px; border-radius: 9999px; background: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.6);"></span>
              <span style="margin-top: 4px; background: #081724; color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #0284c7; white-space: nowrap;">Demo Lake</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
      );
    }
    if (actHereMarkerRef.current) {
      actHereMarkerRef.current.setIcon(
        L.divIcon({
          className: 'network-node-icon',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
              <span style="width: 14px; height: 14px; border-radius: 9999px; background: #10b981; border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.6);"></span>
              <span style="margin-top: 4px; background: #081724; color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #10b981; white-space: nowrap;">Chizumulu BH-3</span>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })
      );
    }
    onShowToast('Network demo reset to initial monitoring state');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto animate-fade-in gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-white/10 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono-micro text-xs text-cyan-400 bg-cyan-950/80 border border-cyan-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
              NETWORK TOPOLOGY • HYDRO-GRAPH-6
            </span>
            <span className="font-mono-label text-xs text-slate-400 uppercase tracking-wider hidden sm:inline">
              Directed Acyclic Basin Propagation &amp; Sluice Control
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-white font-medium tracking-tight">
            Downstream Contamination Network Analysis
          </h1>
          <p className="font-mono-data text-xs text-slate-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-cyan-400">account_tree</span>
            <span>Real OSM Street Tiles • Reach: Linthipe Catchment</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">14 Hydrological Edges Active</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {simState === 'complete' && (
            <button
              onClick={handleResetDemo}
              className="bg-white/10 hover:bg-white/20 text-white font-mono-data text-xs px-3 py-2 rounded-xl border border-white/15 cursor-pointer"
              type="button"
            >
              Reset View
            </button>
          )}

          <button
            onClick={handleRunDemo}
            disabled={isSimulating}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono-data text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            type="button"
          >
            {isSimulating ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                <span>Propagating Vectors...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>▶ Run network demo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Real Leaflet OSM Street Map (left) + Simulation Controls & State Readout (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (7 Cols): Real OSM Street Tiles Map */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="bg-[#0b1620] rounded-2xl border border-white/10 p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-[18px]">hub</span>
                <span className="font-mono-micro text-xs text-white font-bold uppercase tracking-wider">
                  OSM STREET TILES • LAKE MALAWI &amp; LINTHIPE BASIN
                </span>
              </div>
              <span className="font-mono-micro text-slate-400 text-xs">
                {simState === 'complete' ? '🚨 PLUME PROPAGATED' : 'READY TO SIMULATE'}
              </span>
            </div>

            {/* Real Leaflet Map */}
            <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-white/10 bg-[#e5e7eb]">
              <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '540px' }} />

              {/* Dynamic HUD Note on Map */}
              <div className="absolute bottom-3 left-3 z-[500] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-300 text-slate-900 font-mono-micro text-[11px] shadow-lg max-w-sm pointer-events-none">
                <div className="font-bold border-b border-slate-200 pb-1 mb-1 flex items-center justify-between">
                  <span>DYNAMIC SIMULATION ENGINE</span>
                  <span className="text-emerald-700 font-bold">{simState.toUpperCase()}</span>
                </div>
                <p className="text-slate-600 leading-tight">
                  {simState === 'idle'
                    ? 'Click "Run network demo" above. Watch node turn red, dashed amber vectors trace downstream, and the starred green "ACT HERE" marker appear!'
                    : 'Downstream valves locked at Linthipe Jct. Safe failover diversion routed to Chizumulu BH-3.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-micro text-slate-400 pt-1">
              <span>SOLUTE VELOCITY: 0.38 m/s • D8 BASIN ROUTING</span>
              <span className="text-emerald-400 font-semibold">LEAFLET OSM TILES</span>
            </div>
          </div>
        </div>

        {/* Right Side (5 Cols): Simulation Controls, State Terminal & Target Intervention Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 1. Simulation Status Terminal Card */}
          <div className="bg-[#0b1620] rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono-micro text-xs text-cyan-400 font-bold uppercase tracking-wider">
                  TOPOLOGICAL DISPATCH ENGINE
                </span>
                <h3 className="font-headline-sm text-xl text-white font-semibold mt-0.5">
                  Propagation &amp; Route Isolation
                </h3>
              </div>
              <span className="material-symbols-outlined text-cyan-400 text-[24px]">alt_route</span>
            </div>

            {/* State Readout Badge */}
            <div className="bg-[#050e16] p-3 rounded-xl border border-white/10 flex items-center justify-between font-mono-data text-xs">
              <span className="text-slate-400 uppercase font-mono-micro">CURRENT STATUS:</span>
              <div className="flex items-center gap-1.5 font-bold">
                <span className={simState === 'idle' ? 'text-white' : 'text-slate-600'}>IDLE</span>
                <span className="text-slate-600">/</span>
                <span className={simState === 'running' ? 'text-amber-400 animate-pulse' : 'text-slate-600'}>RUNNING</span>
                <span className="text-slate-600">/</span>
                <span className={simState === 'complete' ? 'text-emerald-400' : 'text-slate-600'}>COMPLETE</span>
              </div>
            </div>

            {/* Terminal Log */}
            <div className="bg-[#050e16] p-3.5 rounded-xl border border-white/10 font-mono-data text-xs text-slate-200 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-cyan-400 shrink-0 mt-0.5">terminal</span>
                <p className="leading-relaxed">
                  {simState === 'idle' && (
                    <span className="text-slate-400">
                      Standby: Directed acyclic flow ready. Click &quot;▶ Run network demo&quot; to execute real-time dispersion calculations.
                    </span>
                  )}
                  {simState === 'running' && (
                    <span className="text-amber-300 font-semibold animate-pulse">
                      Traversing downstream solute velocity (0.38 m/s)... Locking extraction valves at Linthipe Jct &amp; Senga Estuary...
                    </span>
                  )}
                  {simState === 'complete' && (
                    <span className="text-slate-200">
                      Network analyzed: <strong className="text-white">14 edges scanned</strong>. Plume velocity: <strong className="text-amber-400">0.38 m/s</strong>. Downstream extraction isolated. Failover secured to <strong className="text-emerald-400">Chizumulu BH-3</strong>.
                    </span>
                  )}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-micro text-slate-400">
                <span>SOLUTE: Microcystin-LR</span>
                <span className={isolationSecured ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  ISOLATION: {isolationSecured ? 'SECURED (2/2)' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* 2. Primary Intervention Point Target: "ACT HERE" */}
            <div className="bg-gradient-to-r from-[#064e3b]/80 to-[#022c22]/90 border-2 border-emerald-400 p-4 rounded-xl shadow-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-micro text-xs text-emerald-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-300">star</span>
                  RECOMMENDED INTERVENTION TARGET
                </span>
                <span className="bg-emerald-400 text-slate-950 font-mono-micro text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                  ACT HERE
                </span>
              </div>

              <div className="font-headline-sm text-lg text-white font-bold">
                Chizumulu Borehole #3 (1.2 km South)
              </div>

              <p className="font-body-sm text-xs text-emerald-100 leading-relaxed">
                Capacity: <strong>45 L/min</strong> • Confined deep aquifer (28m depth) • Coliform: <strong>0 CFU/100mL</strong>. Verified completely isolated from surface runoff plume.
              </p>

              <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between font-mono-micro text-[11px] text-emerald-200">
                <span>REDUNDANCY BUFFER: 72H</span>
                <span className="font-bold text-white">COMMUNITY DISPATCH ACTIVE</span>
              </div>
            </div>

            {/* Sluice Gate Manual Lockout Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono-micro text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-400">lock</span>
                Downstream Sluice Gates:
              </span>
              <button
                onClick={() => {
                  setIsolationSecured(!isolationSecured);
                  onShowToast(isolationSecured ? 'Manual override: Sluice gates OPENED' : 'Sluice gates LOCKED & ISOLATED');
                }}
                className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer border ${
                  isolationSecured
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
                type="button"
              >
                {isolationSecured ? 'ISOLATION SECURED (LOCKED)' : 'OVERRIDE: OPEN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
