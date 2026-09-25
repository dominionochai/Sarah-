import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-surface/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container border border-outline-variant/60 rounded-xl p-6 max-w-2xl w-full shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">policy</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">
              Standards, Protocols & Epistemic Framework
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          <section className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30">
            <h3 className="font-mono-label text-mono-label uppercase text-primary tracking-wider mb-1">
              IEEE OneAquaHealth / Resilience Informatics
            </h3>
            <p>
              Freshwater Sentinel operates as an integrated epidemiological early-warning and resilient catchment telemetry instrument for the Lake Malawi (Nyasa) rift basin. It unifies satellite radiometry, in-situ buoys, Bayesian predictive risk models, and community SMS dispatch.
            </p>
          </section>

          <section className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30">
            <h3 className="font-mono-label text-mono-label uppercase text-tertiary tracking-wider mb-1">
              WHO Alert Levels & Ground-Truth Mandate
            </h3>
            <ul className="list-disc list-inside space-y-1 font-mono-micro text-mono-micro text-outline">
              <li><strong className="text-on-surface">Alert Level 1 (&gt;1.0 µg/L Microcystin):</strong> Drinking water alert, precautionary filtration and boiling required.</li>
              <li><strong className="text-on-surface">Alert Level 2 (&gt;10 µg/L Microcystin):</strong> Direct contact and recreational ban; immediate failover to alternate deep boreholes.</li>
              <li><strong className="text-on-surface">Double-Blind Lab Protocol:</strong> Satellite triggers (NDCI &gt; 0.20) must be validated via spectrophotometry (680/720nm) and microcystin ELISA within 48h.</li>
            </ul>
          </section>

          <section className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30">
            <h3 className="font-mono-label text-mono-label uppercase text-outline tracking-wider mb-1">
              Epistemic Transparency Commitment
            </h3>
            <p>
              Under ISO-14044 and QA-PROTO-9, when remote sensing data is occluded by persistent tropical convective cloud cover (&gt;75%) or telemetry drops offline, events are categorized as <strong className="text-on-surface">Unverifiable</strong> rather than falsely assumed nominal.
            </p>
          </section>

          <section className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30">
            <h3 className="font-mono-label text-mono-label uppercase text-secondary tracking-wider mb-1">
              CAP-EAC v1.4 Community Broadcast Protocol
            </h3>
            <p>
              Alerts dispatched to village water committees and health centers utilize GSM-7 cellular broadcasts in English, Swahili, and pre-recorded Chichewa voice IVR tracks to guarantee accessibility across literacy gradients.
            </p>
          </section>
        </div>

        <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between font-mono-micro text-mono-micro text-outline">
          <span>LATITUDE: 13°46'S • LONGITUDE: 34°18'E</span>
          <button
            onClick={onClose}
            className="bg-primary text-on-primary font-mono-data text-mono-data px-4 py-1.5 rounded font-semibold hover:bg-primary-container cursor-pointer transition-colors"
            type="button"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
