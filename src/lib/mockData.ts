import { AnalysisResult } from '../types/analysis';

export const MOCK_ANALYSIS: AnalysisResult = {
  id: 'demo-1',
  documentType: 'contract',
  title: 'Software Development Agreement - Acme Corp',
  summary: 'A standard software development contract between Acme Corp (Client) and DevFlow (Provider). It covers a 6-month project for building a mobile application with a total budget of $50,000.',
  keyPoints: [
    'Fixed-price engagement of $50,000',
    'Intellectual property transfers upon final payment',
    '30-day termination notice required',
    'Governing law is Delaware'
  ],
  risks: [
    {
      title: 'Broad Indemnity',
      severity: 'high',
      explanation: 'The provider is required to indemnify the client for any third-party claims related to the software, which is a significant liability.',
      sourceHint: 'Section 8.2 Indemnification'
    },
    {
      title: 'Unlimited Liability',
      severity: 'medium',
      explanation: 'There is no cap on the total liability for breach of confidentiality.',
      sourceHint: 'Section 9.1 Limitation of Liability'
    }
  ],
  obligations: [
    {
      party: 'provider',
      obligation: 'Deliver source code and documentation',
      timing: 'At project completion'
    },
    {
      party: 'client',
      obligation: 'Provide feedback within 5 business days',
      timing: 'Ongoing'
    }
  ],
  deadlines: [
    {
      dateOrPeriod: '2024-06-01',
      description: 'Final project delivery',
      severity: 'urgent'
    },
    {
      dateOrPeriod: 'Monthly',
      description: 'Progress reports due',
      severity: 'info'
    }
  ],
  keyClauses: [
    {
      type: 'payment',
      title: 'Payment Schedule',
      summary: '25% upfront, 25% at Milestone 1, 50% upon final acceptance.',
      sourceHint: 'Exhibit A'
    },
    {
      type: 'IP',
      title: 'Ownership of Work Product',
      summary: 'Client owns all deliverables once full payment is received.',
      sourceHint: 'Section 5.1'
    }
  ],
  unclearAreas: [
    'The definition of "Acceptance Criteria" is not specified in the main document.',
    'Warranty period duration is missing.'
  ],
  suggestedQuestions: [
    'What happens if the client delays feedback beyond 5 days?',
    'Is there a cap on liability for non-confidentiality breaches?'
  ],
  confidenceNotes: [
    'High confidence in extraction of payment terms.',
    'Medium confidence in IP ownership as it depends on payment status.'
  ],
  fileName: 'software-agreement.pdf',
  fileSize: 1240000,
  uploadDate: new Date().toISOString()
};
