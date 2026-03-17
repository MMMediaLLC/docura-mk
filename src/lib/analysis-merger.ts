import { GoogleGenAI } from "@google/genai";
import { ChunkAnalysis } from "../types/chunk";
import { AnalysisResult, DocumentType } from "../types/analysis";
import { parseDocumentAnalysis } from "./json-parser";

export async function mergeAnalyses(
  chunkResults: ChunkAnalysis[],
  docType: DocumentType,
  fullText: string,
  ai: GoogleGenAI
): Promise<AnalysisResult> {
  console.log("[Merger] Consolidating insights from all chunks...");

  // 1. Deduplicate and flatten
  const risks = deduplicate(chunkResults.flatMap(c => c.risks), 'title').map(r => ({
    ...r,
    severity: (['low', 'medium', 'high'].includes(r.severity as string) ? r.severity : 'medium') as any
  }));
  const obligations = deduplicate(chunkResults.flatMap(c => c.obligations), 'obligation').map(o => ({
    ...o,
    party: (['user', 'provider', 'client', 'bidder', 'unspecified'].includes(o.party as string) ? o.party : 'unspecified') as any
  }));
  const deadlines = deduplicate(chunkResults.flatMap(c => c.deadlines), 'description').map(d => ({
    ...d,
    severity: (['info', 'important', 'urgent'].includes(d.severity as string) ? d.severity : 'info') as any
  }));
  const keyClauses = deduplicate(chunkResults.flatMap(c => c.clauses), 'title').map(c => ({
    ...c,
    type: c.type as any // Cast to expected enum
  }));

  // 2. Generate summary and key points using a final pass
  console.log("[Merger] Generating final summary and synthesis...");
  const synthesisPrompt = `
    Synthesize the following extracted insights from a ${docType} into a final executive summary and key points.
    
    Extracted Summary Data:
    - Risks: ${risks.length} found
    - Obligations: ${obligations.length} found
    - Deadlines: ${deadlines.length} found
    
    Document Snippet (First 4000 chars):
    ${fullText.substring(0, 4000)}

    Return ONLY a JSON object:
    {
      "title": "string",
      "summary": "string (3-8 sentences)",
      "keyPoints": ["string"],
      "unclearAreas": ["string"],
      "suggestedQuestions": ["string"],
      "confidenceNotes": ["string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: synthesisPrompt }] }],
    });

    const synthesis = parseDocumentAnalysis(response.text);

    return {
      id: Math.random().toString(36).substring(7),
      documentType: docType,
      title: synthesis.title,
      summary: synthesis.summary,
      keyPoints: synthesis.keyPoints,
      unclearAreas: synthesis.unclearAreas,
      suggestedQuestions: synthesis.suggestedQuestions,
      confidenceNotes: synthesis.confidenceNotes,
      risks,
      obligations,
      deadlines,
      keyClauses,
      fileName: "", // To be filled by caller
      fileSize: 0,   // To be filled by caller
      uploadDate: new Date().toISOString()
    };
  } catch (error) {
    console.error("[Merger] Synthesis failed:", error);
    throw new Error("Failed to synthesize final analysis");
  }
}

function deduplicate<T>(items: T[], key: keyof T): T[] {
  const seen = new Set();
  return items.filter(item => {
    const val = String(item[key]).toLowerCase().trim();
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}
