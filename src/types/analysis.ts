export type DocumentType = 'contract' | 'business_document' | 'tender' | 'general_pdf';

export interface Risk {
  title: string;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  sourceHint?: string;
}

export interface Obligation {
  party: 'user' | 'provider' | 'client' | 'bidder' | 'unspecified';
  obligation: string;
  timing: string;
}

export interface Deadline {
  dateOrPeriod: string;
  description: string;
  severity: 'info' | 'important' | 'urgent';
}

export interface KeyClause {
  type: 'payment' | 'termination' | 'liability' | 'confidentiality' | 'IP' | 'dispute_resolution' | 'renewal' | 'eligibility' | 'submission' | 'evaluation' | 'other';
  title: string;
  summary: string;
  sourceHint?: string;
}

export interface AnalysisResult {
  id: string;
  documentType: DocumentType;
  title: string;
  summary: string;
  keyPoints: string[];
  risks: Risk[];
  obligations: Obligation[];
  deadlines: Deadline[];
  keyClauses: KeyClause[];
  unclearAreas: string[];
  suggestedQuestions: string[];
  confidenceNotes: string[];
  fileName: string;
  uploadDate: string;
  fileSize: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sourceHint?: string;
}
