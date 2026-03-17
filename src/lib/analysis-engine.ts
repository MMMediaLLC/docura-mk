import { GoogleGenAI } from "@google/genai";
import { extractTextFromPDF, extractTextFromDocx } from "./document-parser";
import { classifyDocument } from "./document-classifier";
import { chunkDocument } from "./chunker";
import { analyzeChunk } from "./chunk-analysis";
import { mergeAnalyses } from "./analysis-merger";
import { documentStore } from "./document-store";
import { AnalysisResult } from "../types/analysis";

export async function analyzeDocument(
  fileBuffer: Buffer,
  fileName: string,
  fileSize: number,
  mimeType: string,
  ai: GoogleGenAI
): Promise<AnalysisResult> {
  console.log(`[Pipeline] Starting analysis for ${fileName} (${fileSize} bytes)`);

  // 1. Extract Text
  let text = "";
  if (mimeType === "application/pdf") {
    text = await extractTextFromPDF(fileBuffer);
  } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    text = await extractTextFromDocx(fileBuffer);
  } else if (mimeType === "text/plain" || fileName.endsWith(".txt") || fileName.endsWith(".pdf")) {
    // Fallback for testing or plain text
    text = fileBuffer.toString("utf-8");
  } else {
    throw new Error("Unsupported file type");
  }

  if (!text || text.trim().length === 0) {
    throw new Error("Document appears to be empty or unreadable");
  }

  // 2. Classify
  const docType = await classifyDocument(text, ai);

  // 3. Chunk
  const chunks = chunkDocument(text);

  // 4. Analyze Chunks (Parallel with limit)
  const MAX_CONCURRENT = 5;
  const chunkResults = [];
  
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT) {
    const batch = chunks.slice(i, i + MAX_CONCURRENT);
    const batchResults = await Promise.all(
      batch.map(chunk => analyzeChunk(chunk, docType, ai))
    );
    chunkResults.push(...batchResults);
  }

  // 5. Merge
  const finalAnalysis = await mergeAnalyses(chunkResults, docType, text, ai);
  
  // Update metadata
  finalAnalysis.fileName = fileName;
  finalAnalysis.fileSize = fileSize;

  // 6. Store
  documentStore.save({
    id: finalAnalysis.id,
    fileName,
    fileSize,
    analysis: finalAnalysis,
    chunks,
    uploadDate: finalAnalysis.uploadDate
  });

  console.log(`[Pipeline] Analysis complete for ${finalAnalysis.id}`);
  return finalAnalysis;
}
