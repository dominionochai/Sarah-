import React, { useState } from 'react';
import { KanbanTask } from '../../types/index.ts';
import { INITIAL_KANBAN_TASKS } from '../../data/mockData.ts';

interface HandsModuleProps {
  onShowToast: (msg: string) => void;
  externalTasks?: string[];
}

export const HandsModule: React.FC<HandsModuleProps> = ({ onShowToast, externalTasks }) => {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_KANBAN_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(INITIAL_KANBAN_TASKS[0]?.id || null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskLocation, setNewTaskLocation] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'CRITICAL (P0)' | 'HIGH (P1)' | 'MED (P2)' | 'LOW (P3)'>('CRITICAL (P0)');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Unit Bravo (M. Banda)');
  const [newTaskEvidence, setNewTaskEvidence] = useState('');

  // Handle advancement
  const handleAdvanceTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (t.status === 'pending') {
            onShowToast(`Task "${t.title}" moved to IN-PROGRESS`);
            return { ...t, status: 'in-progress', eta: 'En Route (ETA 35m)' };
          }
          if (t.status === 'in-progress') {
            onShowToast(`Task "${t.title}" marked DONE & VERIFIED`);
            return { ...t, status: 'done', statusBadge: 'VERIFIED CLOSED' };
          }
        }
        return t;
      })
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      type: newTaskTitle.toLowerCase().includes('sample') ? 'sample' : 'verify',
      priority: newTaskPriority,
      priorityLevel: newTaskPriority.includes('P0') ? 'p0' : newTaskPriority.includes('P1') ? 'p1' : newTaskPriority.includes('P2') ? 'p2' : 'p3',
      location: newTaskLocation.trim() || 'Demo Lake Catchment',
      evidence: newTaskEvidence.trim() || 'Manual mission protocol scheduled by field dispatch coordinator.',
      assignee: newTaskAssignee,
      coordsOrMeta: 'SCHEDULED SPRINT 28-D',
      status: 'pending'
    };

    setTasks([newTask, ...tasks]);
    setSelectedTaskId(newTask.id);
    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskLocation('');
    setNewTaskEvidence('');
    onShowToast(`New mission protocol logged: "${newTask.title}"`);
  };

  const handleExportManifest = () => {
    const geoJson = {
      type: 'FeatureCollection',
      name: 'Freshwater_Sentinel_Field_Manifest_Sprint28D',
      features: tasks.map((t) => ({
        type: 'Feature',
        properties: {
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          location: t.location,
          assignee: t.assignee,
          evidence: t.evidence,
        },
        geometry: {
          type: 'Point',
          coordinates: [34.30 + Math.random() * 0.4, -13.78 - Math.random() * 0.4]
        }
      }))
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJson, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'freshwater_sentinel_field_manifest.geojson');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Exported Field Manifest GeoJSON successfully');
  };

  const handleSyncMWater = () => {
    onShowToast('Syncing with mWater & KoboToolbox cloud endpoints (DHIS2 API)...');
    setTimeout(() => {
      onShowToast('✓ mWater Sync Complete: 0 pending field surveys in queue');
    }, 1200);
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Top Dispatch Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-mono-micro text-mono-micro uppercase tracking-widest text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              Operational Field Action &amp; Dispatch Tracking
            </span>
            <span className="font-mono-micro text-mono-micro text-outline tracking-wider hidden sm:inline">
              • CADENCE: SPRINT 28-D • EPIDEMIOLOGY RESPONSE
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-medium">
            Water Steward Response &amp; Sample Collection
          </h1>
          <p className="font-mono-data text-mono-data text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-primary">groups</span>
            <span>
              Active Teams: <strong className="text-on-surface font-semibold">3 Field Units</strong> (Alpha, Bravo, Kilo-4)
            </span>
            <span className="text-outline-variant">|</span>
            <span className="material-symbols-outlined text-[15px] text-secondary">location_on</span>
            <span>
              Region: <strong className="text-on-surface font-semibold">Salima &amp; Nkhotakota Districts</strong> (Basin Zone IV)
            </span>
          </p>
        </div>

        {/* Right Quick Telemetry Counters */}
        <div className="flex items-center gap-2 self-start lg:self-end">
          <div className="bg-surface-container border border-outline-variant/50 px-3.5 py-2 rounded-lg flex items-center gap-3 shadow-sm">
            <div className="flex flex-col">
              <span className="font-mono-micro text-mono-micro uppercase text-outline">Lab Turnaround</span>
              <span className="font-mono-data text-mono-data text-on-surface font-semibold">4.2h avg</span>
            </div>
            <div className="h-6 w-px bg-outline-variant/40"></div>
            <div className="flex flex-col">
              <span className="font-mono-micro text-mono-micro uppercase text-outline">Chain of Custody</span>
              <span className="font-mono-data text-mono-data text-primary font-semibold">100% Pinned</span>
            </div>
          </div>
          <button
            onClick={() => onShowToast('Filter applied: All Epidemiological Field Protocols Active')}
            className="bg-surface-container-high border border-outline-variant/60 hover:border-primary text-on-surface px-3.5 py-2.5 rounded-lg flex items-center gap-2 font-mono-micro text-mono-micro uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
            <span>Filter Protocols</span>
          </button>
        </div>
      </div>

      {/* Field Operations Visual Showcase: Real Ground Truth Photography */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Photo Card 1: Spectrophotometer testing */}
        <div className="relative rounded-xl overflow-hidden border border-outline-variant/40 group shadow-lg">
          <div className="h-44 w-full relative">
            <img
              src="/src/assets/images/water_field_testing_1790357264353.jpg"
              alt="Limnologist Water Quality Sampling"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="font-mono-micro text-mono-micro bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                Ground Validation Truth
              </span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">
                In-Situ Spectrophotometric Bio-Assay
              </h4>
              <p className="font-mono-micro text-[11px] text-on-surface-variant">
                Physical bottle collection within 12h of satellite anomaly breach
              </p>
            </div>
            <span className="font-mono-data text-mono-data text-primary bg-surface-container-lowest/80 px-2 py-1 rounded border border-primary/30">
              Unit Bravo
            </span>
          </div>
        </div>

        {/* Photo Card 2: Safe Borehole Station */}
        <div className="relative rounded-xl overflow-hidden border border-outline-variant/40 group shadow-lg">
          <div className="h-44 w-full relative">
            <img
              src="/src/assets/images/community_health_borehole_1790357291197.jpg"
              alt="Community Borehole Safe Water Distribution"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="font-mono-micro text-mono-micro bg-secondary/20 text-secondary border border-secondary/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                Clean Failover Target
              </span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">
                Chizumulu Borehole #3 Infrastructure
              </h4>
              <p className="font-mono-micro text-[11px] text-on-surface-variant">
                Active community water steward monitoring: 45 L/min safe supply
              </p>
            </div>
            <span className="font-mono-data text-mono-data text-secondary bg-surface-container-lowest/80 px-2 py-1 rounded border border-secondary/30">
              Verified Safe
            </span>
          </div>
        </div>
      </div>

      {/* Operational Ribbon Alert: Epistemic Ground Truth Disclosure */}
      <div className="mt-4 mb-6 p-4 rounded-xl bg-surface-container-low border border-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary/10 text-secondary shrink-0 border border-secondary/20">
            <span className="material-symbols-outlined text-[20px]">biotech</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono-data text-mono-data text-on-surface font-semibold flex items-center gap-2 flex-wrap">
              GROUND TRUTH COMPLIANCE PROTOCOL (MAL-MOH-2025/ENV)
              <span className="font-mono-micro text-mono-micro text-secondary bg-secondary/20 px-2 py-0.5 rounded border border-secondary/30 font-semibold">
                MANDATORY SAMPLING ACTIVE
              </span>
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Synthetic Sentinel-2 MSI spectro-radiometric alerts require direct physical bottle collection within 12 hours of threshold breach (&gt;0.40 NDCI).
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono-micro text-mono-micro text-outline uppercase tracking-wider">
            SYNC CADENCE: 5 MIN
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
        </div>
      </div>

      {/* 3-Column Kanban Board + Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* The 3 Kanban Columns (8 cols on lg) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* COLUMN 1: PENDING */}
          <div className="flex flex-col bg-surface-container rounded-xl border border-outline-variant/40 p-3.5 shadow-sm">
            <div className="font-mono-data text-mono-data uppercase tracking-wider text-outline border-b border-outline-variant/40 pb-2.5 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-outline"></span>
                <span className="text-on-surface font-semibold text-xs">PENDING</span>
                <span className="bg-surface-container-high px-1.5 py-0.5 rounded text-[11px] font-mono-data text-outline">
                  {pendingTasks.length}
                </span>
              </div>
              <span className="font-mono-micro text-[10px] text-outline">QUEUE</span>
            </div>

            <div className="flex flex-col gap-3">
              {pendingTasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`bg-surface-container-lowest border border-outline-variant/40 hover:border-primary transition-all p-3 rounded-lg relative group cursor-pointer shadow-sm ${
                      isSelected ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className={`font-mono-micro text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wider uppercase border ${
                          task.priorityLevel === 'p0'
                            ? 'bg-error/15 text-error border-error/30'
                            : task.priorityLevel === 'p1'
                            ? 'bg-secondary/15 text-secondary border-secondary/30'
                            : 'bg-surface-container text-outline border-outline-variant/40'
                        }`}
                      >
                        {task.priority}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdvanceTask(task.id);
                        }}
                        aria-label="Advance task to In-Progress"
                        className="opacity-70 group-hover:opacity-100 hover:text-primary transition-all text-outline p-0.5 cursor-pointer"
                        type="button"
                        title="Move to In-Progress"
                      >
                        <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                      </button>
                    </div>

                    <h3 className="font-body-md text-sm font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-2 font-mono-data text-xs text-on-surface-variant truncate">
                      <span className="material-symbols-outlined text-[13px] text-primary shrink-0">pin_drop</span>
                      <span className="truncate">{task.location}</span>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between font-mono-micro text-[10px] text-outline">
                      <span className="truncate text-on-surface-variant">{task.assignee}</span>
                      <span className="shrink-0">{task.coordsOrMeta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: IN-PROGRESS */}
          <div className="flex flex-col bg-surface-container rounded-xl border border-secondary/30 p-3.5 shadow-sm">
            <div className="font-mono-data text-mono-data uppercase tracking-wider text-secondary border-b border-outline-variant/40 pb-2.5 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                <span className="text-on-surface font-semibold text-xs">IN-PROGRESS</span>
                <span className="bg-secondary/20 px-1.5 py-0.5 rounded text-[11px] font-mono-data text-secondary font-bold">
                  {inProgressTasks.length}
                </span>
              </div>
              <span className="font-mono-micro text-[10px] text-secondary">ACTIVE</span>
            </div>

            <div className="flex flex-col gap-3">
              {inProgressTasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`bg-surface-container-lowest border-2 border-secondary/50 hover:border-secondary transition-all p-3 rounded-lg relative group cursor-pointer shadow-md ${
                      isSelected ? 'ring-2 ring-secondary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono-micro text-[10px] px-1.5 py-0.5 rounded bg-error/20 text-error border border-error/30 font-semibold tracking-wider uppercase">
                        {task.priority}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdvanceTask(task.id);
                        }}
                        aria-label="Mark completed"
                        className="opacity-80 group-hover:opacity-100 hover:text-primary transition-all text-outline p-0.5 cursor-pointer"
                        type="button"
                        title="Mark task completed"
                      >
                        <span className="material-symbols-outlined text-[17px]">done_all</span>
                      </button>
                    </div>

                    <h3 className="font-body-md text-sm font-semibold text-on-surface mb-1 group-hover:text-secondary transition-colors line-clamp-2">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-2 font-mono-data text-xs text-on-surface-variant truncate">
                      <span className="material-symbols-outlined text-[13px] text-secondary shrink-0">pin_drop</span>
                      <span className="truncate">{task.location}</span>
                    </div>

                    {task.eta && (
                      <div className="bg-primary/10 border border-primary/30 rounded px-2 py-1 mb-2 flex items-center justify-between text-[11px] font-mono-data">
                        <span className="text-primary font-medium">En Route</span>
                        <span className="text-primary font-bold">{task.eta}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between font-mono-micro text-[10px] text-outline">
                      <span className="truncate text-on-surface font-medium">{task.assignee}</span>
                      <span className="shrink-0">{task.coordsOrMeta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: DONE */}
          <div className="flex flex-col bg-surface-container rounded-xl border border-primary/30 p-3.5 shadow-sm">
            <div className="font-mono-data text-mono-data uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-2.5 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-on-surface font-semibold text-xs">DONE</span>
                <span className="bg-primary/20 px-1.5 py-0.5 rounded text-[11px] font-mono-data text-primary font-bold">
                  {doneTasks.length}
                </span>
              </div>
              <span className="font-mono-micro text-[10px] text-primary">VERIFIED</span>
            </div>

            <div className="flex flex-col gap-3">
              {doneTasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`bg-surface-container-lowest/80 border border-outline-variant/40 hover:border-primary/80 transition-all p-3 rounded-lg relative group cursor-pointer ${
                      isSelected ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono-micro text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-semibold tracking-wider uppercase">
                        {task.statusBadge || 'VERIFIED CLOSED'}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                    </div>

                    <h3 className="font-body-md text-sm font-semibold text-on-surface mb-1 line-clamp-2">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-2 font-mono-data text-xs text-on-surface-variant truncate">
                      <span className="material-symbols-outlined text-[13px] text-primary shrink-0">pin_drop</span>
                      <span className="truncate">{task.location}</span>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between font-mono-micro text-[10px] text-outline">
                      <span className="truncate text-on-surface-variant">{task.assignee}</span>
                      <span className="text-primary font-semibold">100% OK</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Inspector & Chain of Custody Detail Panel (4 cols on lg) */}
        <div className="lg:col-span-4 bg-surface-container border border-outline-variant/50 rounded-xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <div>
              <span className="font-mono-label text-mono-label text-primary uppercase tracking-wider font-semibold">
                TASK EVIDENCE INSPECTOR
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-0.5">
                {selectedTask?.title || 'Protocol Detail'}
              </h3>
            </div>
            <span className="material-symbols-outlined text-primary text-[22px]">fact_check</span>
          </div>

          {selectedTask && (
            <div className="flex flex-col gap-3 font-body-sm text-body-sm">
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 flex flex-col gap-1">
                <span className="font-mono-micro text-mono-micro text-outline uppercase">LOCATION &amp; COORDINATES</span>
                <span className="font-body-md text-on-surface font-semibold">{selectedTask.location}</span>
                <span className="font-mono-micro text-[11px] text-primary">{selectedTask.coordsOrMeta}</span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 flex flex-col gap-1">
                <span className="font-mono-micro text-mono-micro text-outline uppercase">EVIDENCE &amp; INSTRUCTIONS</span>
                <p className="text-on-surface-variant text-xs leading-relaxed">{selectedTask.evidence}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30 flex flex-col">
                  <span className="font-mono-micro text-mono-micro text-outline uppercase">ASSIGNED TO</span>
                  <span className="font-mono-data text-xs text-on-surface font-medium mt-0.5">{selectedTask.assignee}</span>
                </div>
                <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30 flex flex-col">
                  <span className="font-mono-micro text-mono-micro text-outline uppercase">STATUS</span>
                  <span className="font-mono-data text-xs text-primary font-bold mt-0.5 uppercase">
                    {selectedTask.status}
                  </span>
                </div>
              </div>

              {/* Chain of custody verification */}
              <div className="bg-surface-container-high/60 p-3 rounded-lg border border-primary/30 flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono-micro text-mono-micro">
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    CHAIN OF CUSTODY PINNED
                  </span>
                  <span className="text-outline">SHA256: e82f...a1c9</span>
                </div>
                <p className="font-mono-micro text-[11px] text-on-surface-variant">
                  Sample seals verified by Salima District Limnological Health Lab under WHO standard surveillance SOP.
                </p>
              </div>

              {selectedTask.status !== 'done' && (
                <button
                  onClick={() => handleAdvanceTask(selectedTask.id)}
                  className="w-full bg-primary text-on-primary font-mono-data text-xs font-semibold py-2.5 rounded-lg hover:bg-primary-container transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 mt-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Advance Status: {selectedTask.status === 'pending' ? 'Move to In-Progress' : 'Mark Done & Verified'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Operational Field Manifest & Integration Dock */}
      <div className="mt-8 bg-surface-container rounded-xl border border-outline-variant/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="bg-primary text-on-primary font-body-md text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary-container transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>New Field Mission Protocol</span>
          </button>

          <button
            onClick={handleExportManifest}
            className="bg-surface-container-high border border-outline-variant/60 text-on-surface hover:border-primary font-mono-data text-xs px-3.5 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">download</span>
            <span>Export Field Manifest (GeoJSON / CSV)</span>
          </button>

          <button
            onClick={handleSyncMWater}
            className="bg-surface-container-high border border-outline-variant/60 text-on-surface hover:border-primary font-mono-data text-xs px-3.5 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">cloud_sync</span>
            <span>Sync with mWater / KoboToolbox</span>
          </button>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center font-mono-micro text-mono-micro text-outline">
          <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/40 shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-primary">sensors</span>
            <span>HF RADIO LINK: ACTIVE (146.520 MHz)</span>
          </div>
          <span>BUFFER: 0 PENDING SYNC</span>
        </div>
      </div>

      {/* New Task Creation Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTask}
            className="bg-surface-container-high border border-outline-variant/60 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary">assignment_add</span>
                <span>Dispatch New Field Mission</span>
              </div>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-outline hover:text-on-surface cursor-pointer p-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 font-body-sm text-body-sm">
              <div>
                <label className="font-mono-micro text-mono-micro text-outline block mb-1 uppercase">
                  Protocol Title / Mission Goal
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct Secchi depth & bottle sample at Bay Pier"
                  className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-lg outline-none border border-outline-variant/40 focus:border-primary"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono-micro text-mono-micro text-outline block mb-1 uppercase">
                    Priority Tier
                  </label>
                  <select
                    className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-lg outline-none border border-outline-variant/40"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  >
                    <option value="CRITICAL (P0)">CRITICAL (P0)</option>
                    <option value="HIGH (P1)">HIGH (P1)</option>
                    <option value="MED (P2)">MED (P2)</option>
                    <option value="LOW (P3)">LOW (P3)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono-micro text-mono-micro text-outline block mb-1 uppercase">
                    Assignee Unit
                  </label>
                  <select
                    className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-lg outline-none border border-outline-variant/40"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                  >
                    <option value="Unit Alpha (J. Chirwa)">Unit Alpha (J. Chirwa)</option>
                    <option value="Unit Bravo (M. Banda)">Unit Bravo (M. Banda)</option>
                    <option value="Unit Kilo-4 (E. Lungu)">Unit Kilo-4 (E. Lungu)</option>
                    <option value="Dr. F. Msowoya (Lab)">Dr. F. Msowoya (Lab)</option>
                    <option value="Unassigned (Queue)">Unassigned (Queue)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono-micro text-mono-micro text-outline block mb-1 uppercase">
                  Water Point / Catchment Reach
                </label>
                <input
                  type="text"
                  placeholder="e.g. Salima Intake Station #2 or Borehole BH-104"
                  className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-lg outline-none border border-outline-variant/40 focus:border-primary"
                  value={newTaskLocation}
                  onChange={(e) => setNewTaskLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="font-mono-micro text-mono-micro text-outline block mb-1 uppercase">
                  Ground Truth Sampling Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on spectrophotometer kit, required temperature stabilization, or transport timeline..."
                  className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 rounded-lg outline-none border border-outline-variant/40 focus:border-primary"
                  value={newTaskEvidence}
                  onChange={(e) => setNewTaskEvidence(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/30">
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="bg-surface-container text-on-surface font-mono-data text-mono-data px-4 py-2 rounded-lg hover:bg-surface-bright cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-on-primary font-mono-data text-mono-data px-5 py-2 rounded-lg font-semibold hover:bg-primary-container cursor-pointer transition-colors shadow-md"
              >
                Dispatch Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
