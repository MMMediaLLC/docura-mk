import { GoogleGenAI } from "@google/genai";
import { DocumentChunk } from "../types/document";
import { ChunkAnalysis } from "../types/chunk";
import { DocumentType } from "../types/analysis";

export async function analyzeChunk(
  chunk: DocumentChunk, 
  docType: DocumentType, 
  ai: GoogleGenAI
): Promise<ChunkAnalysis> {
  console.log(`[ChunkAnalysis] Analyzing chunk ${chunk.chunkId}...`);

  const prompt = `
    Analyze this chunk of a ${docType} and extract key insights.
    Return ONLY a JSON object with this structure:
    {
      "risks": [{"title": "string", "severity": "low|medium|high", "explanation": "string", "sourceHint": "string"}],
      "obligations": [{"party": "string", "obligation": "string", "timing": "string"}],
      "deadlines": [{"dateOrPeriod": "string", "description": "string", "severity": "info|important|urgent"}],
      "clauses": [{"type": "string", "title": "string", "summary": "string", "sourceHint": "string"}]
    }

    Chunk Text:
    ${chunk.text}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error(`[ChunkAnalysis] Failed for chunk ${chunk.chunkId}:`, error);
    return { risks: [], obligations: [], deadlines: [], clauses: [] };
  }
}
