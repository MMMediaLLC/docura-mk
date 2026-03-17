import { DocumentType } from './analysis';

export interface DocumentMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  userId?: string;
}

export interface ProcessedDocument extends DocumentMetadata {
  fullText: string;
  detectedType: DocumentType;
  chunks: DocumentChunk[];
}

export interface DocumentChunk {
  chunkId: number;
  text: string;
  sectionHint?: string;
  tokenCount: number;
}
