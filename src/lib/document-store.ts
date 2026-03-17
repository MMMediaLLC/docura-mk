import { AnalysisResult } from "../types/analysis";
import { DocumentChunk } from "../types/document";

interface StoredDocument {
  id: string;
  fileName: string;
  fileSize: number;
  analysis: AnalysisResult;
  chunks: DocumentChunk[];
  uploadDate: string;
  userId?: string;
}

// In-memory store for MVP (Replace with Postgres/Prisma later)
const store = new Map<string, StoredDocument>();

export const documentStore = {
  save: (doc: StoredDocument) => {
    store.set(doc.id, doc);
    console.log(`[Store] Saved document ${doc.id}`);
  },
  get: (id: string) => {
    return store.get(id);
  },
  list: () => {
    return Array.from(store.values());
  },
  delete: (id: string) => {
    store.delete(id);
    console.log(`[Store] Deleted document ${id}`);
  }
};
