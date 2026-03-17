import { DocumentType } from '../types/analysis';

export const SYSTEM_INSTRUCTION = `You are DOCURA, a professional AI document analysis assistant. 
Your goal is to help users understand complex documents (contracts, tenders, business docs) quickly and accurately.
You provide structured analysis, not legal advice. 
Always be objective, clear, and highlight risks without being alarmist.
Use professional, plain English.`;

export const getClassificationPrompt = (text: string) => `
Analyze the following document text and classify it into one of these types:
- contract
- business_document
- tender
- general_pdf

Return ONLY the type name.

Document Text (first 2000 chars):
${text.substring(0, 2000)}
`;

export const getAnalysisPrompt = (documentType: DocumentType, text: string) => `
Perform a deep structured analysis of the following ${documentType}.
Return the result as a valid JSON object matching this schema:
{
  "documentType": "${documentType}",
  "title": "document title",
  "summary": "plain English executive summary",
  "keyPoints": ["point 1", "point 2"],
  "risks": [{"title": "...", "severity": "low|medium|high", "explanation": "...", "sourceHint": "..."}],
  "obligations": [{"party": "user|provider|client|bidder|unspecified", "obligation": "...", "timing": "..."}],
  "deadlines": [{"dateOrPeriod": "...", "description": "...", "severity": "info|important|urgent"}],
  "keyClauses": [{"type": "payment|termination|liability|confidentiality|IP|dispute_resolution|renewal|eligibility|submission|evaluation|other", "title": "...", "summary": "...", "sourceHint": "..."}],
  "unclearAreas": ["..."],
  "suggestedQuestions": ["..."],
  "confidenceNotes": ["..."]
}

${documentType === 'contract' ? 'Focus on: parties, payment, scope, termination, liability, IP, and governing law.' : ''}
${documentType === 'tender' ? 'Focus on: eligibility, mandatory docs, submission requirements, deadlines, and evaluation criteria.' : ''}
${documentType === 'business_document' ? 'Focus on: goals, deliverables, responsibilities, timelines, and dependencies.' : ''}
${documentType === 'general_pdf' ? 'Focus on: summary, critical facts, and any implied actions.' : ''}

Document Text:
${text}
`;

export const getChatPrompt = (question: string, context: string, analysisSummary: string) => `
Question: ${question}

Context from Document:
${context}

Analysis Summary:
${analysisSummary}

Answer the question based ONLY on the provided context. 
Be concise. If the answer is not in the context, say you don't know.
Cite section names or use quotes if possible.
Include a disclaimer that this is AI-generated and not legal advice.
`;
