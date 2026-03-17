export interface ChunkAnalysis {
  risks: {
    title: string;
    severity: 'low' | 'medium' | 'high';
    explanation: string;
    sourceHint?: string;
  }[];
  obligations: {
    party: string;
    obligation: string;
    timing: string;
  }[];
  deadlines: {
    dateOrPeriod: string;
    description: string;
    severity: 'info' | 'important' | 'urgent';
  }[];
  clauses: {
    type: string;
    title: string;
    summary: string;
    sourceHint?: string;
  }[];
}
