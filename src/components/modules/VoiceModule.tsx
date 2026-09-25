import React, { useState, useEffect, useRef } from 'react';

interface VoiceModuleProps {
  onShowToast: (msg: string) => void;
}

export const VoiceModule: React.FC<VoiceModuleProps> = ({ onShowToast }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(14);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin1, setPin1] = useState('8492');
  const [pin2, setPin2] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState<'pending' | 'transmitted'>('pending');
  const [testSmsSimulated, setTestSmsSimulated] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Audio timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 38) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Subtle web audio feedback when playing IVR voice track
  const togglePlay = () => {
    if (!isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          oscillatorRef.current = osc;
        }
      } catch {
        // audio optional
      }
      setIsPlaying(true);
      onShowToast('Chichewa IVR 4040 Voice Track: Streaming (Sister Grace Phiri, Salima Mission)');
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch {
          // ignore
        }
      }
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, clickX / width));
    const newSec = Math.round(ratio * 38);
    setAudioSeconds(newSec);
  };

  const handleConfirmBroadcast = () => {
    if (!pin2.trim()) {
      onShowToast('District Health Officer PIN required for dual-key clearance');
      return;
    }
    setIsPinModalOpen(false);
    setBroadcastStatus('transmitted');
    onShowToast('BROADCAST TRANSMITTED: 340 Health Leaders & Boreholes Pinged via CAP-EAC');
  };

  const handleTestSms = () => {
    setTestSmsSimulated('+265 88 123 4567');
    onShowToast('Live Simulated SMS pushed to Coordinator: +265 88 123 4567');
  };

  const formattedTime = `00:${audioSeconds < 10 ? '0' + audioSeconds : audioSeconds} / 00:38`;
  const activeBarsCount = Math.round((audioSeconds / 38) * 48);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto gap-6">
      {/* Header Section */}
      <header className="flex flex-col gap-1.5 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
          <p className="font-mono-micro text-secondary text-xs uppercase tracking-widest font-semibold">
            MULTILINGUAL RESILIENCE BROADCAST &amp; FIELD DISPATCH
          </p>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-headline-lg text-2xl sm:text-4xl text-white font-medium tracking-tight">
            Community Alert Dispatch &amp; SMS Verification
          </h1>
          <div className="flex items-center gap-2 bg-[#0e1a24] border border-emerald-500/30 px-3.5 py-1.5 rounded-xl">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">campaign</span>
            <span className="font-mono-label text-emerald-300 uppercase tracking-wider text-xs font-semibold">
              PROTOCOL: CAP-EAC v1.4
            </span>
          </div>
        </div>
      </header>

      {/* Top Metadata Strip */}
      <section className="bg-[#0b1620] rounded-2xl p-5 border border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-slate-300 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono-micro text-slate-400 uppercase text-[10px]">
                Target Recipient Group
              </span>
              <span className="font-body-md text-sm sm:text-base text-white font-medium">
                Salima Central Water Committee (340 village health leaders &amp; boreholes)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">cell_tower</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono-micro text-slate-400 uppercase text-[10px]">
                Transmission Channels
              </span>
              <span className="font-body-sm text-sm text-slate-200">
                Cell Broadcast / SMS / FrontlineSMS IVR
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#122230] px-3.5 py-2 rounded-xl border border-white/10 self-start md:self-auto">
          {broadcastStatus === 'pending' ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-mono-data text-amber-300 uppercase tracking-wider font-bold text-xs">
                STATUS: PENDING VALIDATION
              </span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono-data text-emerald-400 uppercase tracking-wider font-bold text-xs">
                STATUS: DISPATCHED &amp; ACTIVE
              </span>
            </>
          )}
        </div>
      </section>

      {/* Multilingual SMS Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: English Primary Broadcast */}
        <article className="bg-[#0b1620] rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-white/10 hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono-data text-white font-bold text-sm">
                  EN (English Primary Broadcast)
                </span>
                <span className="font-mono-micro text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                  PRIMARY LOCALE
                </span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-emerald-400">
                check_circle
              </span>
            </div>

            <div className="bg-[#061019] rounded-xl p-4 mb-4 border border-white/5">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10 font-mono-micro text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">sms</span>
                  <span>TO: +265 88 123 4567 (Group Lead)</span>
                </div>
                <span className="text-emerald-400 font-semibold">PRIORITY 1 / EMERGENCY</span>
              </div>

              <div className="bg-[#122230] rounded-xl p-4 font-body-sm text-sm text-slate-100 leading-relaxed shadow-sm border border-white/5">
                <p className="font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                  URGENT HEALTH ADVISORY [Freshwater Sentinel / Malawi MoH]:
                </p>
                High cyanobacteria bloom detected at Demo Lake (Nkhotakota North sector). DO NOT use lake water directly for drinking or cooking without rolling boil and filtration. Safe alternative: <strong className="text-emerald-300">Chizumulu Borehole #3 (1.2 km south)</strong>. Boil water advisory active for 72 hours.
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between font-mono-micro text-xs text-slate-400 border-t border-white/10">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">pin</span>
              <span>294 / 320 chars (2 SMS segments)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>GSM-7 ENCODING VERIFIED</span>
            </div>
          </div>
        </article>

        {/* Right Card: Swahili Regional Translation */}
        <article className="bg-[#0b1620] rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-white/10 hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono-data text-white font-bold text-sm">
                  SW (Swahili Regional Translation)
                </span>
                <span className="font-mono-micro text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                  KISWAHILI CORRIDOR
                </span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-amber-400">
                translate
              </span>
            </div>

            <div className="bg-[#061019] rounded-xl p-4 mb-4 border border-white/5">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10 font-mono-micro text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">sms</span>
                  <span>TO: Lake Shore Health Coordinators</span>
                </div>
                <span className="text-amber-400 font-semibold">SECTOR CROSS-BORDER</span>
              </div>

              <div className="bg-[#122230] rounded-xl p-4 font-body-sm text-sm text-slate-100 leading-relaxed shadow-sm border border-white/5">
                <p className="font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                  TAHADHARI YA AFYA [Freshwater Sentinel / MoH]:
                </p>
                Mlipuko wa mwani hatari umegunduliwa katika Ziwa Demo. USITUMIE maji ya ziwa moja kwa moja kwa kunywa au kupikia bila kuchemsha vizuri na kuchuja. Njia mbadala salama: <strong className="text-amber-300">Kisima cha Chizumulu Nambari 3 (km 1.2 kusini)</strong>. Tahadhari hii inafanya kazi kwa saa 72.
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between font-mono-micro text-xs text-slate-400 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">verified</span>
              <span>Regional Health Directorate Sync</span>
            </div>
            <span className="text-emerald-400 font-bold">99.1% SEMANTIC MATCH</span>
          </div>
        </article>
      </section>

      {/* DISTINCT PRERECORDED VOICE SCRIPT CARD */}
      <section className="bg-gradient-to-b from-[#132331] to-[#0c1822] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-secondary to-emerald-500"></div>

        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <span className="font-mono-micro text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-full tracking-wider uppercase inline-block mb-2">
                [ DEMO — PRERECORDED VOICE SCRIPT ]
              </span>
              <h2 className="font-headline-sm text-xl sm:text-2xl text-white font-medium">
                CHICHEWA PRERECORDED VOICE DEMO: Dial-in IVR 4040 Audio Track (38s)
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-[#09131a] border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 font-mono-micro text-xs">
              <span className="material-symbols-outlined text-[16px] text-amber-400">mic</span>
              <span>CODEC: AMR-NB 8kHz (Cellular Carrier)</span>
            </div>
          </div>

          {/* Chichewa Field Script */}
          <div className="bg-[#070e14] rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono-label text-xs uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
              <span>Chichewa Local Catchment Dialect Audio Script</span>
            </div>
            <p className="font-body-md text-sm sm:text-base text-slate-200 leading-relaxed italic">
              “CHENJEZO LA MADZI: Madzi a m&apos;nyanja ya Demo Lake ali ndi vuto la ndere zowononga (algal bloom). Musamwe kapena kuphikira madzi awa popanda kuwiritsa bwino kwambiri ndi kusefa. Gwiritsani ntchito chitsime cha Chizumulu Borehole #3 chomwe chili pamtunda wa kilomita 1.2 kumwera. Pitani ku chipatala chapafupi ngati mukumva kutsegula m&apos;mimba kapena kufooka m&apos;thupi.”
            </p>
          </div>

          {/* Interactive Audio Player Bar */}
          <div className="bg-[#0b1620] rounded-xl p-5 flex flex-col gap-3 border border-white/10 shadow-inner">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                aria-label="Play or Pause Audio"
                className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 flex items-center justify-center text-slate-950 shrink-0 transition-transform active:scale-95 shadow-lg shadow-amber-950/40 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[28px] font-bold">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <div className="flex-1 flex flex-col gap-2">
                <div
                  onClick={handleSeek}
                  className="relative w-full h-10 flex items-center gap-1 cursor-pointer select-none bg-black/40 rounded-lg p-2 border border-white/5"
                  title="Click to seek"
                >
                  <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 380 32">
                    <g className="text-slate-600" fill="currentColor">
                      {Array.from({ length: 48 }).map((_, i) => {
                        const heights = [12, 20, 16, 24, 18, 28, 22, 14, 26, 16, 24, 12, 22, 30, 18, 10, 20, 26, 16, 28, 14, 24, 18, 12, 22, 26, 18, 8, 24, 30, 20, 14, 24, 16, 28, 10, 22, 18, 26, 16, 12, 20, 24, 14, 28, 20, 10, 6];
                        const h = heights[i % heights.length];
                        const y = (32 - h) / 2;
                        return <rect key={i} x={i * 8} y={y} width="3" height={h} rx="1" />;
                      })}
                    </g>
                    <g className="text-amber-400" fill="currentColor">
                      {Array.from({ length: activeBarsCount }).map((_, i) => {
                        const heights = [12, 20, 16, 24, 18, 28, 22, 14, 26, 16, 24, 12, 22, 30, 18, 10, 20, 26, 16, 28, 14, 24, 18, 12, 22, 26, 18, 8, 24, 30, 20, 14, 24, 16, 28, 10, 22, 18, 26, 16, 12, 20, 24, 14, 28, 20, 10, 6];
                        const h = heights[i % heights.length];
                        const y = (32 - h) / 2;
                        return <rect key={`active-${i}`} x={i * 8} y={y} width="3" height={h} rx="1" />;
                      })}
                    </g>
                  </svg>
                </div>

                <div className="flex items-center justify-between font-mono-micro text-xs text-slate-400">
                  <span className="text-white font-mono-data font-semibold">{formattedTime}</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="material-symbols-outlined text-[15px] text-amber-400">verified_user</span>
                    Recorded by Sister Grace Phiri, Salima District Health Mission
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-400 font-mono-micro text-xs">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">lock</span>
              <span>Security: SHA-256 Dual-Key Handshake Active</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleTestSms}
                className="bg-[#0b1620] hover:bg-[#122230] text-slate-200 font-mono-data text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer border border-white/10"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-sky-400">smartphone</span>
                <span>Simulate Test SMS (+265)</span>
              </button>

              <button
                onClick={() => setIsPinModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono-data text-xs px-5 py-2.5 rounded-xl font-bold tracking-wide shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                <span>Broadcast All Alerts (Dual PIN)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Test SMS Simulated Push Preview */}
      {testSmsSimulated && (
        <div className="bg-[#0b1620] border border-sky-500/40 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono-data text-xs text-sky-400 font-bold">
              <span className="material-symbols-outlined text-[18px]">sms</span>
              <span>SIMULATED CELL BROADCAST DELIVERED (GSM-7)</span>
            </div>
            <button
              onClick={() => setTestSmsSimulated(null)}
              className="text-slate-400 hover:text-white text-xs font-mono-micro cursor-pointer"
              type="button"
            >
              Dismiss
            </button>
          </div>
          <div className="bg-[#061019] p-4 rounded-xl font-body-sm text-sm text-slate-200 border-l-4 border-sky-400 leading-relaxed">
            [MAL-MOH-ALERT] High cyanobacteria bloom detected at Demo Lake. DO NOT use surface water directly. Use Chizumulu Borehole #3 (1.2 km south). Boil advisory 72h. Ref: CS-9402.
          </div>
        </div>
      )}

      {/* Dual PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1620] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-headline-sm text-lg font-semibold">
                <span className="material-symbols-outlined text-[22px]">security</span>
                <span>Emergency Broadcast Authorization</span>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-sm text-slate-300 leading-relaxed">
              Alert will be broadcast directly to 340 village health chiefs and borehole committee heads across Salima District. Both Duty Officer and Regional Health Director PINs required.
            </p>

            <div className="flex flex-col gap-4 font-mono-data text-xs">
              <div>
                <label className="font-mono-micro text-slate-400 block mb-1.5 uppercase font-semibold">
                  OFFICER 1 PIN (WATER MONITORING UNIT)
                </label>
                <input
                  className="w-full bg-[#061019] text-white px-3.5 py-2.5 rounded-xl outline-none border border-white/10 focus:border-emerald-500 text-sm font-bold tracking-widest"
                  maxLength={4}
                  placeholder="••••"
                  type="password"
                  value={pin1}
                  onChange={(e) => setPin1(e.target.value)}
                />
              </div>

              <div>
                <label className="font-mono-micro text-slate-400 block mb-1.5 uppercase font-semibold">
                  OFFICER 2 PIN (DISTRICT HEALTH OFFICER)
                </label>
                <input
                  className="w-full bg-[#061019] text-white px-3.5 py-2.5 rounded-xl outline-none border border-white/10 focus:border-amber-500 text-sm font-bold tracking-widest placeholder:text-slate-600"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN (e.g. 5183)"
                  type="password"
                  value={pin2}
                  onChange={(e) => setPin2(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="bg-white/5 hover:bg-white/10 text-slate-300 font-mono-data text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBroadcast}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-mono-data text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">sensors</span>
                <span>Confirm &amp; Transmit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
