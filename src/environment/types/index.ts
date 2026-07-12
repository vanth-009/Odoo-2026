export interface Department {
  id: string;
  name: string;
  targetEmissions: number;
  currentEmissions: number;
  score: number;
  status: 'On Track' | 'Warning' | 'Critical';
  trend: 'up' | 'down';
}

export interface CarbonTransaction {
  id: string;
  txId: string;
  department: string;
  operation: string;
  product: string;
  carbon: number;
  timestamp: string | Date;
  status: string;
}

export interface SustainabilityGoal {
  id: string;
  name: string;
  department: string;
  owner: string;
  progress: number;
  target: number;
  remaining: number;
  deadline: string | Date;
  status: 'On Track' | 'Behind Schedule' | 'Completed';
  risk: 'Low' | 'Medium' | 'High' | 'None';
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  subcategory?: string | null;
  unit: string;
  value: number; // CO2 factor value
  source: string;
  version: string;
  effectiveDate: string | Date;
  description?: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProductESGProfile {
  id: string;
  name: string;
  code: string;
  category: string;
  supplier: string;
  packagingType: string;
  recyclablePercent: number;
  manufacturingCountry: string;
  lifecycleStage: string;
  hazardClass?: string | null;
  carbonCategory?: string | null;
  preferredEmissionFactorId?: string | null;
  preferredEmissionFactor?: EmissionFactor | null;
  esgRating: string;
  description?: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DashboardKPIs {
  totalEmissions: number;
  currentMonthEmissions: number;
  prevMonthEmissions: number;
  momChange: number;
  avgScore: number;
  activeGoals: number;
  goalsAchieved: number;
  deptsExceedingTarget: number;
  netCarbonSaved: number;
}

export interface MonthlyTrend {
  month: string;
  carbon: number;
}

export interface SourceBreakdown {
  name: string;
  carbon: number;
}

export interface Hotspot {
  operation: string;
  department: string;
  carbon: number;
  percentage: number;
}

export interface EnvironmentalAlert {
  id: string;
  severity: 'high' | 'medium' | 'info';
  message: string;
  action: string;
  timestamp: string;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  departments: Department[];
  monthlyTrends: MonthlyTrend[];
  sourceBreakdown: SourceBreakdown[];
  hotspots: Hotspot[];
  recentActivity: CarbonTransaction[];
  goals: SustainabilityGoal[];
  alerts: EnvironmentalAlert[];
}
