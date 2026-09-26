import { SAMPLE_DATASETS } from './presets';

export const officerStats = { inspections: 128, compliant: 94, nonCompliant: 34, violations: 61, reports: 117 };

// The dashboard deliberately reuses scanner fixtures. Keep this list at four so every
// dashboard collection has the same bounded inspection scope (three flagged, one pass).
const dashboardSampleIds = ['sample1', 'sample2', 'sample3', 'sample6'];
const dashboardSamples = dashboardSampleIds.map((id) => {
  const sample = SAMPLE_DATASETS.find((dataset) => dataset.id === id);
  if (!sample) throw new Error(`Dashboard sample fixture not found: ${id}`);
  return sample;
});

const statusFor = (status: string) => status === 'COMPLIANT' ? 'COMPLIANT' : 'NON-COMPLIANT';
const primaryRuleFor = (sample: typeof dashboardSamples[number]) =>
  sample.violations[0]?.rule ?? sample.changeLog[0]?.statutoryReference ?? sample.boundingBoxes[0]?.ruleCode ?? 'Not applicable';
const primaryIssueFor = (sample: typeof dashboardSamples[number]) =>
  sample.violations[0]?.code ?? 'No Statutory Violations Detected';

export const recentInspections = dashboardSamples.map((sample) => ({
  id: sample.caseReference ?? sample.id,
  sampleId: sample.id,
  product: sample.name,
  time: sample.inspectionDateTime ?? 'Date/time not recorded',
  status: statusFor(sample.defaultStatus),
  violation: sample.violations.length ? sample.violations.map((violation) => violation.code).join(' / ') : 'None detected',
  officer: 'LM-MH-042',
  report: true
}));

export const violationRecords = dashboardSamples.map((sample) => ({
  product: sample.name,
  issue: primaryIssueFor(sample),
  rule: primaryRuleFor(sample),
  status: sample.defaultStatus === 'COMPLIANT' ? 'Compliant' : 'Open'
}));

// A penalty card represents an actual fixture violation, rather than a separate mock
// product record. The first four retain the dashboard's four-card cap.
export const penaltyRecords = dashboardSamples
  .flatMap((sample) => sample.violations.map((violation) => ({
    product: sample.name,
    issue: violation.code,
    amount: '₹0.00 (prototype)',
    status: `${violation.severity} violation`
  })))
  .slice(0, 4);

export const repeatedOffenders = [
  { entity: 'Sample seller record A', count: 4, recent: 'Dual MRP declaration', status: 'Monitor' },
  { entity: 'Sample manufacturer record B', count: 3, recent: 'Missing consumer helpline', status: 'Review' },
  { entity: 'Sample seller record C', count: 2, recent: 'Date legibility', status: 'Open' }
];

export const evidenceRecords = dashboardSamples.map((sample) => ({
  id: `EV-${sample.caseReference ?? sample.id}`,
  product: sample.name,
  location: sample.inspectionLocation ?? 'Location not recorded',
  timestamp: sample.inspectionDateTime ?? 'Date/time not recorded',
  rule: primaryRuleFor(sample),
  hash: `sha256: ${sample.id}`
}));
