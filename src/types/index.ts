export type NavigationPath = 
  | 'overview'
  | 'eyes'
  | 'brain'
  | 'voice'
  | 'network'
  | 'hands'
  | 'verify';

export interface AuditEvent {
  id: string;
  date: string;
  granuleId: string;
  targetName: string;
  coords: string;
  satelliteRisk: string;
  chlorophyllEst: string;
  groundTruthFinding: string;
  groundTruthSub: string;
  outcomeGrade: 'Supported' | 'False Positive' | 'Unverifiable' | 'Pending';
  leadTime: string;
  notes?: string;
}

export interface CatchmentPoint {
  id: string;
  name: string;
  code: string;
  district: string;
  station: string;
  score: number;
  status: 'critical' | 'moderate' | 'low' | 'uncertain';
  statusLabel: string;
  lat: number;
  lng: number;
  rationale: string;
  chlorophyllA: number;
  chlorophyllChange: string;
  turbidity: number;
  turbidityChange: string;
  waterTemp: string;
  rainfall24h: string;
  microcystinProb: string;
  trajectory: { day: string; score: number }[];
  isUncertaintySite?: boolean;
}

export interface KanbanTask {
  id: string;
  title: string;
  type: 'sample' | 'verify' | 'alternative';
  priority: 'CRITICAL (P0)' | 'HIGH (P1)' | 'MED (P2)' | 'LOW (P3)' | 'CRITICAL';
  priorityLevel: 'p0' | 'p1' | 'p2' | 'p3';
  location: string;
  evidence: string;
  assignee: string;
  coordsOrMeta: string;
  status: 'pending' | 'in-progress' | 'done';
  statusBadge?: string;
  image?: string;
  imageAlt?: string;
  imageMeta?: string;
  progressPercent?: number;
  eta?: string;
  isEpistemicSite?: boolean;
}
