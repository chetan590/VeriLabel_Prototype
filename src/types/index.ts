export type RuleStatus = 'COMPLIANT' | 'VIOLATION' | 'WARNING';
export type BoxColor = 'red' | 'green' | 'amber';
export type SeverityLevel = 'critical' | 'major' | 'minor';

export interface BoundingBox {
  id: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  label: string;
  boxColor: BoxColor;
  detail?: string;
  ruleCode?: string;
}

export interface ViolationItem {
  id: string;
  code: string;
  severity: SeverityLevel;
  badge: string;
  desc: string;
  rule: string;
}

export interface CompliantItem {
  id: string;
  label: string;
  status: string;
  desc: string;
  value: string;
}

export interface ChangeLogItem {
  id: string;
  targetViolation: string;
  actionRequired: string;
  statutoryReference: string;
}

export interface SampleDataset {
  id: string;
  caseReference?: string;
  inspectionDateTime?: string;
  inspectionLocation?: string;
  name: string;
  category: string;
  netQuantity: string;
  mrp: string;
  mfgDate: string;
  imagePath: string;
  thumbnailUrl?: string;
  summary: string;
  badgeText: string;
  defaultStatus: RuleStatus;
  boundingBoxes: BoundingBox[];
  violations: ViolationItem[];
  compliant: CompliantItem[];
  changeLog: ChangeLogItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}
