export interface DistrictHotspot {
  id: string;
  name: string;
  lakeRegion: string;
  historicalCases2022_23: number;
  cfrPercent: number; // Case Fatality Rate (e.g. 2.8%)
  ocvCoveragePercent: number; // Oral Cholera Vaccine coverage (e.g. 74%)
  population: number;
  rainySeasonRisk: 'CRITICAL (Nov-Apr Flood Flush)' | 'HIGH (Lake Upwelling)' | 'ELEVATED';
  primaryVulnerability: string;
  activeSurveillanceStatus: 'SURGE_PREDICTED' | 'ELEVATED_WATCH' | 'STABILIZED';
  satelliteLeadTimeDays: number;
  coordinates: string;
}

export interface CholeraSurveillanceTimelinePoint {
  dayLabel: string;
  dayNumber: number;
  dateStr: string;
  satelliteRiskScore: number; // 0 - 100 (Teal Line: Rises FIRST)
  whoConfirmedCases: number;  // (Red Bars: Lags 4-6 days behind)
  isLagZone: boolean;         // 3-7 Day Blind Spot
  stageNote?: string;
  whoSitRepStatus: string;
  brainAlertStatus: string;
}

export interface EpistemicEvidenceSource {
  id: string;
  name: string;
  agency: string;
  category: 'satellite' | 'who_surveillance' | 'immunization' | 'hydrology';
  weightPercent: number;
  confidencePercent: number;
  temporalProperty: string; // e.g. "+5 to +7 Days Predictive" vs "Retrospective (-4.5d lag)"
  description: string;
  metricValue: string;
  metricLabel: string;
  statusBadge: string;
  badgeColor: 'teal' | 'red' | 'amber' | 'blue';
}

export const MALAWI_OUTBREAK_CITATION = {
  title: "Malawi 2022–2023 National Cholera Epidemic",
  source: "World Health Organization (WHO AFRO) & Malawi Ministry of Health SitRep #78",
  totalCases: 58941,
  totalDeaths: 1768,
  caseFatalityRate: 3.00, // Highest in Malawi history, WHO benchmark threshold is <1.0%
  districtsAffected: 29,
  triggerMechanism: "Onset of seasonal heavy rainfall (Nov–Apr) combined with Cyclone Freddy flood washouts inundating unlined pit latrines and shallow boreholes across the Lake Malawi corridor.",
  thesisQuote: "Lab-confirmed cholera takes DAYS to appear in WHO reports. BRAIN sees the satellite signal first. Risk rises before cases becomes visible proof."
};

export const DISTRICT_HOTSPOTS: DistrictHotspot[] = [
  {
    id: 'salima',
    name: 'Salima District',
    lakeRegion: 'Central Lake Malawi & Linthipe Delta',
    historicalCases2022_23: 3890,
    cfrPercent: 2.8,
    ocvCoveragePercent: 74,
    population: 440000,
    rainySeasonRisk: 'CRITICAL (Nov-Apr Flood Flush)',
    primaryVulnerability: 'Linthipe River sediment plume directly enters domestic fishing & bathing intakes.',
    activeSurveillanceStatus: 'SURGE_PREDICTED',
    satelliteLeadTimeDays: 5,
    coordinates: '13.78°S • 34.62°E'
  },
  {
    id: 'mangochi',
    name: 'Mangochi District',
    lakeRegion: 'Southern Lake Malawi Arm & Shire Confluence',
    historicalCases2022_23: 8240,
    cfrPercent: 2.4,
    ocvCoveragePercent: 68,
    population: 1148000,
    rainySeasonRisk: 'CRITICAL (Nov-Apr Flood Flush)',
    primaryVulnerability: 'High-density artisanal fishing docks; shallow sand-point wells with fecal seepage.',
    activeSurveillanceStatus: 'SURGE_PREDICTED',
    satelliteLeadTimeDays: 6,
    coordinates: '14.47°S • 35.26°E'
  },
  {
    id: 'nsanje',
    name: 'Nsanje District',
    lakeRegion: 'Lower Shire River Basin Floodplains',
    historicalCases2022_23: 4120,
    cfrPercent: 3.4,
    ocvCoveragePercent: 82,
    population: 300000,
    rainySeasonRisk: 'CRITICAL (Nov-Apr Flood Flush)',
    primaryVulnerability: 'Transboundary floodwaters from Zambezi basin submerging communal water points.',
    activeSurveillanceStatus: 'ELEVATED_WATCH',
    satelliteLeadTimeDays: 4,
    coordinates: '16.92°S • 35.26°E'
  },
  {
    id: 'karonga',
    name: 'Karonga District',
    lakeRegion: 'Northern Lake Margin & Songwe Catchment',
    historicalCases2022_23: 2450,
    cfrPercent: 2.1,
    ocvCoveragePercent: 61,
    population: 365000,
    rainySeasonRisk: 'HIGH (Lake Upwelling)',
    primaryVulnerability: 'Seasonal river flash floods; lowest OCV second-dose vaccination completion in corridor.',
    activeSurveillanceStatus: 'ELEVATED_WATCH',
    satelliteLeadTimeDays: 7,
    coordinates: '9.93°S • 33.93°E'
  }
];

export const SURVEILLANCE_TIMELINE: CholeraSurveillanceTimelinePoint[] = [
  {
    dayLabel: 'D-12',
    dayNumber: 1,
    dateStr: 'Oct 14',
    satelliteRiskScore: 16,
    whoConfirmedCases: 0,
    isLagZone: false,
    stageNote: 'Baseline dry-season water clarity. High optical transmission. No anomaly.',
    whoSitRepStatus: '0 cases (Normal)',
    brainAlertStatus: 'Nominal Baseline'
  },
  {
    dayLabel: 'D-10',
    dayNumber: 2,
    dateStr: 'Oct 16',
    satelliteRiskScore: 22,
    whoConfirmedCases: 0,
    isLagZone: false,
    stageNote: 'First convective storm (44mm). Runoff begins entering catchment.',
    whoSitRepStatus: '0 cases reported',
    brainAlertStatus: 'Advisory Watch'
  },
  {
    dayLabel: 'D-8',
    dayNumber: 3,
    dateStr: 'Oct 18',
    satelliteRiskScore: 48,
    whoConfirmedCases: 0,
    isLagZone: false,
    stageNote: 'Sentinel-2 passes: Surface water temperature +2.1°C, Turbidity surges to 36 NTU.',
    whoSitRepStatus: '0 cases (No clinic signal)',
    brainAlertStatus: 'Class 2: Watch'
  },
  {
    dayLabel: 'D-6',
    dayNumber: 4,
    dateStr: 'Oct 20',
    satelliteRiskScore: 78,
    whoConfirmedCases: 0,
    isLagZone: true,
    stageNote: '💥 BRAIN FIRES CLASS 1 ALERT: NDCI +0.38 (+3.4σ bloom). Water table flooded. 5-day warning issued!',
    whoSitRepStatus: '0 cases (SitRep #72 blind)',
    brainAlertStatus: '🚨 CLASS 1: IMMEDIATE INTERVENTION'
  },
  {
    dayLabel: 'D-5',
    dayNumber: 5,
    dateStr: 'Oct 21',
    satelliteRiskScore: 86,
    whoConfirmedCases: 0,
    isLagZone: true,
    stageNote: 'Contaminated water consumed in unserved villages. Vibrio cholerae incubation period (1-3 days).',
    whoSitRepStatus: '0 cases in official tally',
    brainAlertStatus: '🚨 Alert Active (Boreholes safe-routed)'
  },
  {
    dayLabel: 'D-4',
    dayNumber: 6,
    dateStr: 'Oct 22',
    satelliteRiskScore: 92,
    whoConfirmedCases: 1,
    isLagZone: true,
    stageNote: 'First symptomatic patients arrive at rural health posts. Stool samples collected for TCBS agar.',
    whoSitRepStatus: '1 sporadic case (Not cluster)',
    brainAlertStatus: '🚨 Alert Active (Lead time +4d)'
  },
  {
    dayLabel: 'D-3',
    dayNumber: 7,
    dateStr: 'Oct 23',
    satelliteRiskScore: 95,
    whoConfirmedCases: 3,
    isLagZone: true,
    stageNote: 'Samples in transit by motorcycle to District Hospital Laboratory for culture confirmation.',
    whoSitRepStatus: '3 suspected (Awaiting culture)',
    brainAlertStatus: '🚨 Alert Active (Lead time +3d)'
  },
  {
    dayLabel: 'D-2',
    dayNumber: 8,
    dateStr: 'Oct 24',
    satelliteRiskScore: 94,
    whoConfirmedCases: 8,
    isLagZone: true,
    stageNote: 'Lab confirms V. cholerae O1 serotype Ogawa. DHIS2 paper-to-digital data entry delay.',
    whoSitRepStatus: '8 confirmed in district log',
    brainAlertStatus: '🚨 Alert Active (Lead time +2d)'
  },
  {
    dayLabel: 'D-0 (TODAY)',
    dayNumber: 9,
    dateStr: 'Oct 26',
    satelliteRiskScore: 88,
    whoConfirmedCases: 38,
    isLagZone: false,
    stageNote: '🚨 FIRST WHO SITREP PUBLISHED: 38 confirmed cases. BRAIN detected this 5 FULL DAYS earlier!',
    whoSitRepStatus: '38 cases (WHO SitRep cluster declared)',
    brainAlertStatus: 'Intervention Ongoing (Ring chlorination)'
  },
  {
    dayLabel: 'D+2',
    dayNumber: 10,
    dateStr: 'Oct 28',
    satelliteRiskScore: 76,
    whoConfirmedCases: 84,
    isLagZone: false,
    stageNote: 'Hospital cholera treatment units (CTUs) reach capacity without early water diversion.',
    whoSitRepStatus: '84 cumulative cases',
    brainAlertStatus: 'Mitigation Phase'
  },
  {
    dayLabel: 'D+4',
    dayNumber: 11,
    dateStr: 'Oct 30',
    satelliteRiskScore: 61,
    whoConfirmedCases: 142,
    isLagZone: false,
    stageNote: 'Emergency chlorine distribution brings environmental reservoir under control.',
    whoSitRepStatus: '142 cumulative cases',
    brainAlertStatus: 'Post-Peak Deceleration'
  },
  {
    dayLabel: 'D+6',
    dayNumber: 12,
    dateStr: 'Nov 01',
    satelliteRiskScore: 42,
    whoConfirmedCases: 198,
    isLagZone: false,
    stageNote: 'Cases level off as safe borehole alternatives (Chizumulu BH-3) protect community.',
    whoSitRepStatus: '198 cumulative cases (Stabilizing)',
    brainAlertStatus: 'Recovery & Verification'
  }
];

export const EPISTEMIC_EVIDENCE_SOURCES: EpistemicEvidenceSource[] = [
  {
    id: 'src-sentinel',
    name: 'Sentinel-2 MSI Optical Radiometry',
    agency: 'ESA Copernicus / Sentinel-2B (10m Multi-Spectral Blend)',
    category: 'satellite',
    weightPercent: 35,
    confidencePercent: 94,
    temporalProperty: '+5 to +7 Days PREDICTIVE Lead Time',
    description: 'NDCI chlorophyll absorption index & 560nm sediment backscatter. Detects cyanobacterial biomass and surface runoff 120 hours before clinical manifestations.',
    metricValue: 'NDCI +0.38',
    metricLabel: 'Surface Cyanobacteria Bloom (+3.4σ)',
    statusBadge: 'PREDICTIVE SIGNAL',
    badgeColor: 'teal'
  },
  {
    id: 'src-who',
    name: 'WHO AFRO & DHIS2 Lab Surveillance',
    agency: 'World Health Organization & Malawi MoH Weekly SitReps',
    category: 'who_surveillance',
    weightPercent: 25,
    confidencePercent: 99,
    temporalProperty: '-4.5 Days RETROSPECTIVE Lag',
    description: 'Weekly clinical admissions, stool culture confirmations (TCBS agar), and Case Fatality Rate (CFR). Retrospective confirmation of what has ALREADY occurred.',
    metricValue: '3.0% CFR',
    metricLabel: '58,941 Historic Cases (2022-23 Baseline)',
    statusBadge: 'RETROSPECTIVE TRUTH',
    badgeColor: 'red'
  },
  {
    id: 'src-ocv',
    name: 'Oral Cholera Vaccine (OCV) Shield',
    agency: 'Gavi & Malawi National Expanded Immunization Program',
    category: 'immunization',
    weightPercent: 20,
    confidencePercent: 91,
    temporalProperty: 'Static Vulnerability Multiplier',
    description: 'District 2-dose vaccination coverage. Populations below 75% coverage lack herd immunity against waterborne outbreaks, scaling the Bayesian risk coefficient.',
    metricValue: '68% - 74%',
    metricLabel: 'District Immunity Shield (Gap: 26-32%)',
    statusBadge: 'VULNERABILITY FACTOR',
    badgeColor: 'amber'
  },
  {
    id: 'src-hydro',
    name: 'HydroSHEDS D8 Basin Runoff Flux',
    agency: 'USGS HydroSHEDS & NASA GPM IMERG Precipitation',
    category: 'hydrology',
    weightPercent: 20,
    confidencePercent: 88,
    temporalProperty: '+48h Hydrologic Velocity',
    description: 'Directed acyclic flow modeling of floodwash during the Nov–Apr rainy season. Predicts which shallow boreholes will be submerged by contaminated surface water.',
    metricValue: '+42 mm / 24h',
    metricLabel: 'Rainy Season Flood Inundation Rate',
    statusBadge: 'PHYSICAL CARRIER',
    badgeColor: 'blue'
  }
];
