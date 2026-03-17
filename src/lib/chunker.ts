import { DocumentChunk } from "../types/document";

const CHUNK_SIZE_CHARS = 8000; // Approx 2000 tokens
const CHUNK_OVERLAP_CHARS = 800; // Approx 200 tokens

export function chunkDocument(text: string): DocumentChunk[] {
  console.log("[Chunker] Splitting document into chunks...");
  const chunks: DocumentChunk[] = [];
  let start = 0;
  let chunkId = 1;

  while (start < text.length) {
    let end = start + CHUNK_SIZE_CHARS;
    
    // Try to find a logical boundary (double newline or period)
    if (end < text.length) {
      const boundary = text.lastIndexOf('\n\n', end);
      if (boundary > start + (CHUNK_SIZE_CHARS * 0.7)) {
        end = boundary + 2;
      } else {
        const periodBoundary = text.lastIndexOf('. ', end);
        if (periodBoundary > start + (CHUNK_SIZE_CHARS * 0.7)) {
          end = periodBoundary + 2;
        }
      }
    }

    const chunkText = text.substring(start, end).trim();
    
    // Infer section hint from the first line if it looks like a heading
    const firstLine = chunkText.split('\n')[0].substring(0, 100);
    const sectionHint = firstLine.length < 60 ? firstLine : undefined;

    chunks.push({
      chunkId,
      text: chunkText,
      sectionHint,
      tokenCount: Math.ceil(chunkText.length / 4) // Rough estimate
    });

    start = end - CHUNK_OVERLAP_CHARS;
    chunkId++;

    if (start >= text.length) break;
  }

  console.log(`[Chunker] Created ${chunks.length} chunks.`);
  return chunks;
}
