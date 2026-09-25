import React, { useState } from 'react';
import { AuditEvent } from '../../types/index.ts';
import { INITIAL_AUDIT_EVENTS } from '../../data/mockData.ts';

interface VerifyModuleProps {
  onShowToast: (msg: string) => void;
}

export const VerifyModule: React.FC<VerifyModuleProps> = ({ onShowToast }) => {
  const [events] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedEvent, setInspectedEvent] = useState<AuditEvent | null>(null);

  const filteredEvents = events.filter((evt) => {
    if (selectedEventId && evt.id !== selectedEventId) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        evt.targetName.toLowerCase().includes(q) ||
        evt.granuleId.toLowerCase().includes(q) ||
        evt.outcomeGrade.toLowerCase().includes(q) ||
        evt.groundTruthFinding.toLowerCase().includes(q) ||
        evt.id.toLowerCase().includes(q);
      return match;
    }
    return true;
  });

  const handleSelectNode = (id: string) => {
    if (selectedEventId === id) {
      setSelectedEventId(null);
    } else {
      setSelectedEventId(id);
      onShowToast(`Filter applied: Event ${id}`);
    }
  };

  const handleResetFilter = () => {
    setSelectedEventId(null);
    setSearchQuery('');
    onShowToast('Verification filter reset to all events');
  };

  const handleExportCSV = () => {
    const header = ['Event ID', 'Date', 'Granule ID', 'Water Point Target', 'Coordinates', 'Satellite Risk Score', 'Chlorophyll Est', 'Ground Truth Finding', 'Outcome Grade', 'Lead-Time', 'Notes'];
    const rows = events.map((e) => [
      `"${e.id}"`,
      `"${e.date}"`,
      `"${e.granuleId}"`,
      `"${e.targetName}"`,
      `"${e.coords}"`,
      `"${e.satelliteRisk}"`,
      `"${e.chlorophyllEst}"`,
      `"${e.groundTruthFinding} - ${e.groundTruthSub}"`,
      `"${e.outcomeGrade}"`,
      `"${e.leadTime}"`,
      `"${e.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'freshwater_sentinel_audit_ledger_2023_2024.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Exported audit ledger CSV successfully');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto gap-6">
      {/* SECTION HEADER: Clinical, matter-of-fact archival tone */}
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="font-mono-micro text-emerald-400 text-xs tracking-widest uppercase font-semibold">
            EMPIRICAL MODEL EVALUATION &amp; GROUND-TRUTH AUDIT
          </span>
          <span className="font-mono-micro text-slate-400 text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            ISO-14044 / QA-PROTO-9
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-2xl sm:text-4xl text-white font-medium tracking-tight">
              Historical Verification &amp; Validation Track Record
            </h1>
            <p className="font-mono-micro text-slate-400 mt-1 tracking-wide text-xs sm:text-sm">
              Audit Period: Nov 2023 – Oct 2024 • Validation Standard: WHO Guidelines for Safe Recreational &amp; Drinking Water
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono-micro self-start lg:self-auto">
            <div className="bg-[#0b1620] border border-emerald-500/30 px-3.5 py-2 rounded-xl text-slate-200 flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
              <span>
                EPIDEMIOLOGY AUDIT STATUS: <strong className="text-emerald-400 font-semibold">RECONCILED</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP SECTION: Horizontal Lead-Time & Empirical Sequence Timeline */}
      <section className="bg-[#0b1620] p-6 rounded-2xl shadow-sm border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline-sm text-xl text-white font-medium">
              Alert Verification Sequence &amp; Lead-Time Log
            </h2>
            <p className="font-mono-micro text-slate-400 text-xs mt-0.5">
              Chronological sequence of S2-MSI spectral triggers matched to wet-lab spectrometry and field dip test outcomes
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono-micro text-xs text-slate-400">
            <span>WINDOW:</span>
            <span className="text-white bg-white/10 px-2.5 py-1 rounded-md font-mono-data font-semibold">365 DAYS</span>
          </div>
        </div>

        {/* Timeline Scroll Container */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-[920px] relative px-6 pt-10 pb-8">
            {/* Connecting Hairline Axis */}
            <div className="absolute left-6 right-6 top-[51px] h-[2px] bg-slate-700"></div>

            {/* Timeline Node Track */}
            <div className="relative flex justify-between items-start">
              {/* Node 1: Nov 12 */}
              <button
                onClick={() => handleSelectNode('EVT-1001')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1001' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1001' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"></div>
                </div>
                <span className="font-mono-data text-xs text-white font-semibold">Nov 12</span>
                <span className="font-mono-micro text-emerald-400 mt-0.5 font-bold">+4d lead</span>
                <span className="font-mono-micro text-slate-400 tracking-tight">S2-094</span>
              </button>

              {/* Node 2: Dec 04 */}
              <button
                onClick={() => handleSelectNode('EVT-1002')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1002' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1002' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"></div>
                </div>
                <span className="font-mono-data text-xs text-white font-semibold">Dec 04</span>
                <span className="font-mono-micro text-emerald-400 mt-0.5 font-bold">+6d lead</span>
                <span className="font-mono-micro text-slate-400 tracking-tight">S2-118</span>
              </button>

              {/* Node 3: Jan 19 (False Positive) */}
              <button
                onClick={() => handleSelectNode('EVT-1003')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1003' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1003' ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50"></div>
                </div>
                <span className="font-mono-data text-xs text-rose-400 font-semibold">Jan 19</span>
                <span className="font-mono-micro text-rose-400 mt-0.5 font-bold">+2d lead</span>
                <span className="font-mono-micro text-rose-300/80 tracking-tight">False Pos</span>
              </button>

              {/* Node 4: Feb 08 */}
              <button
                onClick={() => handleSelectNode('EVT-1004')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1004' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1004' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"></div>
                </div>
                <span className="font-mono-data text-xs text-white font-semibold">Feb 08</span>
                <span className="font-mono-micro text-emerald-400 mt-0.5 font-bold">+5d lead</span>
                <span className="font-mono-micro text-slate-400 tracking-tight">S2-182</span>
              </button>

              {/* Node 5: Mar 22 */}
              <button
                onClick={() => handleSelectNode('EVT-1005')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1005' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1005' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"></div>
                </div>
                <span className="font-mono-data text-xs text-white font-semibold">Mar 22</span>
                <span className="font-mono-micro text-emerald-400 mt-0.5 font-bold">+3d lead</span>
                <span className="font-mono-micro text-slate-400 tracking-tight">S2-205</span>
              </button>

              {/* Node 6: Apr 11 (Unverifiable) */}
              <button
                onClick={() => handleSelectNode('EVT-1006')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1006' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1006' ? 'ring-2 ring-slate-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-500"></div>
                </div>
                <span className="font-mono-data text-xs text-slate-400 font-semibold">Apr 11</span>
                <span className="font-mono-micro text-slate-400 mt-0.5">Unverifiable</span>
                <span className="font-mono-micro text-slate-500 tracking-tight">Cloud &gt;75%</span>
              </button>

              {/* Node 7: Jun 02 */}
              <button
                onClick={() => handleSelectNode('EVT-1007')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1007' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1007' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"></div>
                </div>
                <span className="font-mono-data text-xs text-white font-semibold">Jun 02</span>
                <span className="font-mono-micro text-emerald-400 mt-0.5 font-bold">+7d lead</span>
                <span className="font-mono-micro text-slate-400 tracking-tight">S2-261</span>
              </button>

              {/* Node 8: Jul 18 */}
              <button
                onClick={() => handleSelectNode('EVT-1008')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1008' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1008' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"></div>
                </div>
                <span className="font-mono-data text-xs text-white font-semibold">Jul 18</span>
                <span className="font-mono-micro text-emerald-400 mt-0.5 font-bold">+4d lead</span>
                <span className="font-mono-micro text-slate-400 tracking-tight">S2-302</span>
              </button>

              {/* Node 9: Sep 09 (Unverifiable) */}
              <button
                onClick={() => handleSelectNode('EVT-1009')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1009' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1009' ? 'ring-2 ring-slate-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-500"></div>
                </div>
                <span className="font-mono-data text-xs text-slate-400 font-semibold">Sep 09</span>
                <span className="font-mono-micro text-slate-400 mt-0.5">Unverifiable</span>
                <span className="font-mono-micro text-slate-500 tracking-tight">Buoy Stale</span>
              </button>

              {/* Node 10: Oct 24 (Active / Pending) */}
              <button
                onClick={() => handleSelectNode('EVT-1010')}
                className={`flex flex-col items-center group relative cursor-pointer text-center bg-transparent border-0 p-0 transition-transform ${
                  selectedEventId === 'EVT-1010' ? 'scale-125' : 'hover:scale-110'
                }`}
                type="button"
              >
                <div className={`w-7 h-7 rounded-full bg-[#070e14] border border-white/20 flex items-center justify-center mb-3 ${
                  selectedEventId === 'EVT-1010' ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0b1620]' : ''
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-500/50"></div>
                </div>
                <span className="font-mono-data text-xs text-amber-300 font-semibold">Oct 24</span>
                <span className="font-mono-micro text-amber-400 mt-0.5 font-bold">Active Alert</span>
                <span className="font-mono-micro text-slate-400 tracking-tight">Pending Lab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 bg-[#061019] px-4 py-3 rounded-xl border border-white/5">
          <div className="flex flex-wrap items-center gap-6 font-mono-micro text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-white font-medium">Supported (n=6)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-white font-medium">Not-supported / False Pos (n=1)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-500"></span>
              <span className="text-slate-300">Unverifiable / Data Gap (n=2)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-amber-300 font-medium">Pending Verification (n=1)</span>
            </div>
          </div>

          <button
            onClick={handleResetFilter}
            className="font-mono-micro text-xs text-emerald-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            <span>RESET FILTER</span>
          </button>
        </div>
      </section>

      {/* MIDDLE SECTION: 3-Stat Precision & Track Record Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Total Alerts Graded */}
        <div className="bg-[#0b1620] p-6 rounded-2xl shadow-sm border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-label text-xs uppercase text-slate-400 tracking-wider font-semibold">
                TOTAL ALERTS GRADED
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline-xl text-5xl text-white font-bold tracking-tight">10</span>
              <span className="font-headline-sm text-slate-400 font-normal">Alerts Evaluated</span>
            </div>
          </div>
          <div className="pt-4 mt-2 bg-[#061019] p-3.5 rounded-xl border border-white/5">
            <p className="font-body-sm text-xs text-slate-300 leading-relaxed">
              12-month rolling catchment screening window spanning Mangochi, Nkhata Bay, and Salima in-shore sites.
            </p>
          </div>
        </div>

        {/* Stat 2: Empirically Supported Count */}
        <div className="bg-[#0b1620] p-6 rounded-2xl shadow-sm border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-label text-xs uppercase text-slate-400 tracking-wider font-semibold">
                EMPIRICALLY SUPPORTED COUNT
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline-xl text-5xl text-emerald-400 font-bold tracking-tight">6</span>
              <span className="font-headline-sm text-emerald-300 font-normal">Confirmed</span>
            </div>
          </div>
          <div className="pt-4 mt-2 bg-[#061019] p-3.5 rounded-xl border border-white/5">
            <p className="font-body-sm text-xs text-slate-300 leading-relaxed">
              Lab confirmed microcystin &gt;1.0 µg/L or Secchi disk &lt;0.5m via spectrophotometric assay (WHO Alert Level 1+).
            </p>
          </div>
        </div>

        {/* Stat 3: Screening Precision (PPV) */}
        <div className="bg-[#0b1620] p-6 rounded-2xl shadow-sm border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-label text-xs uppercase text-slate-400 tracking-wider font-semibold">
                SCREENING PRECISION (PPV)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline-xl text-5xl text-white font-bold tracking-tight">85.7%</span>
              <span className="font-mono-data text-emerald-400 font-medium text-sm">PPV (6 of 7)</span>
            </div>
          </div>
          <div className="pt-4 mt-2 bg-[#061019] p-3.5 rounded-xl border border-white/5">
            <p className="font-body-sm text-xs text-slate-300 leading-relaxed">
              Excluding unverifiable events (6 of 7 testable).{' '}
              <strong className="text-amber-400 font-normal">Clinical note:</strong> Small sample size (N=10); statistical power constrained by field sampling cadence.
            </p>
          </div>
        </div>
      </section>

      {/* ASYMMETRIC SUPPLEMENT: Lead-Time Distribution & Analytical Rigor */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-8 bg-[#0b1620] p-6 rounded-2xl shadow-sm border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-headline-sm text-xl text-white font-medium">
                Early Warning Window Distribution
              </h3>
              <p className="font-mono-micro text-slate-400 text-xs mt-0.5">
                Lead-time in days between satellite risk detection and verified in-situ community health exposure threshold
              </p>
            </div>
            <div className="font-mono-micro text-xs bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-300 font-bold">
              MEAN LEAD: 4.4 DAYS
            </div>
          </div>

          <div className="h-44 w-full flex flex-col justify-end pt-4">
            <div className="grid grid-cols-6 gap-3 items-end h-32 px-4 bg-[#061019] rounded-xl pt-4 border border-white/5">
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="font-mono-micro text-slate-400">1 alert</span>
                <div className="w-full bg-slate-700 hover:bg-slate-600 rounded-t h-[20%] transition-all"></div>
                <span className="font-mono-micro text-slate-300 font-medium">2 Days</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="font-mono-micro text-slate-400">1 alert</span>
                <div className="w-full bg-teal-800 hover:bg-teal-700 rounded-t h-[20%] transition-all"></div>
                <span className="font-mono-micro text-slate-300 font-medium">3 Days</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="font-mono-micro text-emerald-400 font-bold">2 alerts</span>
                <div className="w-full bg-emerald-500 rounded-t h-[60%] transition-all shadow-lg shadow-emerald-500/30"></div>
                <span className="font-mono-micro text-white font-bold">4 Days</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="font-mono-micro text-slate-400">1 alert</span>
                <div className="w-full bg-teal-700 hover:bg-teal-600 rounded-t h-[25%] transition-all"></div>
                <span className="font-mono-micro text-slate-300 font-medium">5 Days</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="font-mono-micro text-slate-400">1 alert</span>
                <div className="w-full bg-teal-700 hover:bg-teal-600 rounded-t h-[25%] transition-all"></div>
                <span className="font-mono-micro text-slate-300 font-medium">6 Days</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="font-mono-micro text-emerald-400 font-bold">1 alert</span>
                <div className="w-full bg-emerald-600 rounded-t h-[30%] transition-all"></div>
                <span className="font-mono-micro text-slate-300 font-medium">7 Days</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-mono-micro font-mono-micro text-slate-400 px-4 mt-2.5 text-xs">
              <span>MIN: 2 DAYS (FALSE ALARM)</span>
              <span>INTERQUARTILE RANGE: 3.5 – 5.5 DAYS</span>
              <span>MAX: 7 DAYS (JUN 02 S2-261)</span>
            </div>
          </div>
        </div>

        {/* Methodological Rigor */}
        <div className="lg:col-span-4 bg-[#0b1620] p-6 rounded-2xl shadow-sm border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[18px] text-amber-400">biotech</span>
              <span className="font-mono-label text-xs uppercase text-white tracking-wider font-semibold">
                GROUND-TRUTH PROTOCOL
              </span>
            </div>
            <h4 className="font-headline-sm text-lg text-white font-medium mb-2">
              Double-Blind Lab Assay
            </h4>
            <p className="font-body-sm text-xs text-slate-300 leading-relaxed mb-4">
              All validation points represent physical water collections tested by Lilongwe Water Board or Monkey Bay Research Station:
            </p>
            <ul className="space-y-2 font-mono-micro text-xs text-slate-200">
              <li className="flex items-start gap-2 bg-[#061019] p-2.5 rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">1.</span>
                <span>Microcystin ELISA Photometry (&gt;1.0 µg/L cutoff for drinking breach)</span>
              </li>
              <li className="flex items-start gap-2 bg-[#061019] p-2.5 rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">2.</span>
                <span>Dual-Wavelength Spectrophotometry (680nm/720nm NDCI match)</span>
              </li>
              <li className="flex items-start gap-2 bg-[#061019] p-2.5 rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">3.</span>
                <span>Secchi Extinction Depth (confirmed &lt;0.5m photic penetration)</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between font-mono-micro text-xs text-slate-400 border-t border-white/10">
            <span>ASSAY LATENCY: 24–48h</span>
            <span className="text-emerald-400 font-semibold">CHAIN-OF-CUSTODY PINNED</span>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION: Detailed Verification Audit Table */}
      <section className="bg-[#0b1620] rounded-2xl shadow-sm border border-white/10 overflow-hidden mb-6">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-headline-sm text-xl text-white font-medium">
                Detailed Verification Audit Ledger
              </h3>
              {(selectedEventId || searchQuery) && (
                <span className="font-mono-micro text-xs bg-emerald-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-md">
                  FILTER ACTIVE
                </span>
              )}
            </div>
            <p className="font-mono-micro text-slate-400 text-xs">
              Complete audit trail of satellite trigger events, predicted bloom vectors, and laboratory assay corroborations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                className="bg-[#061019] text-white font-mono-micro text-xs px-3.5 py-2 pl-9 rounded-xl w-64 focus:outline-none border border-white/10 focus:border-emerald-500 placeholder-slate-500"
                placeholder="Search Target, Granule, or Outcome..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-2.5">
                search
              </span>
            </div>
            <button
              className="bg-white/10 hover:bg-white/20 text-white font-mono-micro text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              onClick={handleExportCSV}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>EXPORT CSV</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#061019] font-mono-label text-xs text-slate-400 uppercase tracking-wider border-y border-white/10">
                <th className="py-3 px-5 font-semibold">Event &amp; Granule ID</th>
                <th className="py-3 px-5 font-semibold">Water Point Target</th>
                <th className="py-3 px-5 font-semibold">Satellite Risk Score</th>
                <th className="py-3 px-5 font-semibold">In-Situ Ground Truth Finding</th>
                <th className="py-3 px-5 font-semibold">Outcome Grade</th>
                <th className="py-3 px-5 font-semibold text-right">Lead-Time</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-sm divide-y divide-white/5">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-mono-micro text-xs">
                    No matching audit events found for current filter.{' '}
                    <button onClick={handleResetFilter} className="text-emerald-400 underline ml-1 cursor-pointer">
                      Reset Filter
                    </button>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((row) => {
                  const isSelected = selectedEventId === row.id;
                  let outcomeBadgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
                  let outcomeDotClass = 'bg-emerald-400';

                  if (row.outcomeGrade === 'False Positive') {
                    outcomeBadgeClass = 'bg-rose-950/80 text-rose-300 border-rose-500/30';
                    outcomeDotClass = 'bg-rose-500';
                  } else if (row.outcomeGrade === 'Unverifiable') {
                    outcomeBadgeClass = 'bg-slate-800 text-slate-300 border-slate-600';
                    outcomeDotClass = 'bg-slate-400';
                  } else if (row.outcomeGrade === 'Pending') {
                    outcomeBadgeClass = 'bg-amber-950/80 text-amber-300 border-amber-500/30';
                    outcomeDotClass = 'bg-amber-400 animate-pulse';
                  }

                  let leadTimeColor = 'text-emerald-400';
                  if (row.outcomeGrade === 'False Positive') leadTimeColor = 'text-rose-400';
                  if (row.outcomeGrade === 'Unverifiable') leadTimeColor = 'text-slate-400';
                  if (row.outcomeGrade === 'Pending') leadTimeColor = 'text-amber-300';

                  return (
                    <tr
                      key={row.id}
                      onClick={() => setInspectedEvent(row)}
                      className={`hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-950/40 border-l-4 border-l-emerald-400' : ''
                      }`}
                    >
                      <td className="py-3.5 px-5 font-mono-data text-xs">
                        <div className="text-white font-medium flex items-center gap-1.5">
                          <span>{row.date}</span>
                          <span className="text-[10px] text-slate-400 bg-white/5 px-1 py-0.5 rounded border border-white/5">
                            {row.id}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px]">{row.granuleId}</div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="text-white font-medium">{row.targetName}</div>
                        <div className="font-mono-micro text-xs text-slate-400">{row.coords}</div>
                      </td>

                      <td className="py-3.5 px-5 font-mono-data text-xs">
                        <div
                          className={`font-semibold ${
                            row.outcomeGrade === 'False Positive'
                              ? 'text-amber-400'
                              : row.outcomeGrade === 'Pending'
                              ? 'text-amber-300'
                              : row.outcomeGrade === 'Unverifiable'
                              ? 'text-slate-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {row.satelliteRisk}
                        </div>
                        <div className="text-slate-400 text-[11px]">{row.chlorophyllEst}</div>
                      </td>

                      <td className="py-3.5 px-5 font-mono-micro text-xs">
                        <div
                          className={`font-mono-data text-xs font-semibold ${
                            row.outcomeGrade === 'False Positive'
                              ? 'text-rose-400'
                              : row.outcomeGrade === 'Pending'
                              ? 'text-amber-300'
                              : row.outcomeGrade === 'Unverifiable'
                              ? 'text-slate-400'
                              : 'text-white'
                          }`}
                        >
                          {row.groundTruthFinding}
                        </div>
                        <div className="text-slate-400">{row.groundTruthSub}</div>
                      </td>

                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono-micro text-xs font-semibold border ${outcomeBadgeClass}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${outcomeDotClass}`}></span>
                          {row.outcomeGrade}
                        </span>
                      </td>

                      <td className={`py-3.5 px-5 text-right font-mono-data font-semibold text-xs ${leadTimeColor}`}>
                        {row.leadTime}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Row detail inspector dialog */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1620] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="font-mono-label text-xs uppercase text-white font-bold">
                  Audit Ledger Record #{inspectedEvent.id}
                </span>
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-xl text-white font-semibold">
                {inspectedEvent.targetName}
              </h3>
              <p className="font-mono-micro text-xs text-slate-400">{inspectedEvent.coords}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#061019] p-4 rounded-xl font-mono-data text-xs border border-white/5">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">DATE &amp; GRANULE</span>
                <span className="text-white font-medium">{inspectedEvent.date}</span>
                <span className="text-slate-400 block text-[11px]">{inspectedEvent.granuleId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">OUTCOME &amp; LEAD</span>
                <span className="text-emerald-400 font-bold">{inspectedEvent.outcomeGrade}</span>
                <span className="text-white block text-[11px]">{inspectedEvent.leadTime}</span>
              </div>
            </div>

            <div className="bg-[#122230] p-4 rounded-xl border border-white/5">
              <span className="font-mono-micro text-xs text-emerald-400 uppercase font-bold block mb-1">
                IN-SITU GROUND TRUTH CORROBORATION
              </span>
              <p className="font-body-sm text-sm text-white mb-1">
                {inspectedEvent.groundTruthFinding}
              </p>
              <p className="font-mono-micro text-xs text-slate-300">
                {inspectedEvent.groundTruthSub}
              </p>
            </div>

            {inspectedEvent.notes && (
              <div className="bg-[#061019] p-4 rounded-xl border border-white/5">
                <span className="font-mono-micro text-xs text-amber-400 uppercase font-bold block mb-1">
                  FIELD AUDIT NOTES
                </span>
                <p className="font-body-sm text-xs text-slate-300 leading-relaxed">
                  {inspectedEvent.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  handleSelectNode(inspectedEvent.id);
                  setInspectedEvent(null);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-mono-micro text-xs flex items-center gap-1 font-semibold cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                <span>Focus in Ledger</span>
              </button>
              <button
                onClick={() => setInspectedEvent(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-mono-data text-xs px-4 py-2 rounded-xl cursor-pointer"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
