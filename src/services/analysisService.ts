import { GoogleGenAI } from "@google/genai";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { AnalysisResult, DocumentType } from "../types/analysis";
import { v4 as uuidv4 } from 'uuid';
import { parseDocumentAnalysis } from '../lib/json-parser';

// Initialize PDF.js worker using unpkg which is more reliable for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export class AnalysisService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyze(file: File): Promise<{ analysis: AnalysisResult, chunks: any[] }> {
    const text = await this.extractText(file);
    const docType = await this.classify(text);
    const chunks = this.chunkText(text);
    
    const chunkResults = await this.analyzeChunks(chunks, docType);
    const finalAnalysis = await this.mergeAnalyses(chunkResults, docType, text);

    finalAnalysis.fileName = file.name;
    finalAnalysis.fileSize = file.size;
    finalAnalysis.id = uuidv4();
    finalAnalysis.uploadDate = new Date().toISOString();

    return { analysis: finalAnalysis, chunks };
  }

  private async extractText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    
    let text = '';
    
    if (file.type === 'application/pdf') {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      text = await file.text();
    }
    
    text = this.cleanText(text);
    
    if (text.length < 50) {
      throw new Error("This file could not be read clearly. It may be an image-only PDF, password protected, or completely empty.");
    }
    
    console.log(`[Pipeline] Extracted text length: ${text.length} characters`);
    return text;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  private async classify(text: string): Promise<DocumentType> {
    const prompt = `
      Analyze the following document text and classify it into exactly one of these types:
      - contract
      - tender
      - business_document
      - general_pdf

      Return ONLY the type name in lowercase.

      Document Text (first 4000 chars):
      ${text.substring(0, 4000)}
    `;

    console.log("[Pipeline] Starting document classification...");
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    const type = response.text.trim().toLowerCase() as DocumentType;
    const validTypes: DocumentType[] = ['contract', 'tender', 'business_document', 'general_pdf'];
    const finalType = validTypes.includes(type) ? type : 'general_pdf';
    
    console.log(`[Pipeline] Detected type: ${finalType}`);
    return finalType;
  }

  private chunkText(text: string): any[] {
    const CHUNK_SIZE = 15000;
    const chunks = [];
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      chunks.push({
        id: uuidv4(),
        content: text.substring(i, i + CHUNK_SIZE),
        startIndex: i,
        endIndex: Math.min(i + CHUNK_SIZE, text.length)
      });
    }
    console.log(`[Pipeline] Created ${chunks.length} chunks for analysis`);
    return chunks;
  }

  private async analyzeChunks(chunks: any[], docType: DocumentType): Promise<any[]> {
    const results = [];
    for (const chunk of chunks) {
      const prompt = `
        Analyze this ${docType} chunk and extract key information.
        Focus on: summary, risks, obligations, and key clauses.
        
        Chunk content:
        ${chunk.content}
      `;
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
      });
      results.push(response.text);
    }
    return results;
  }

  private async mergeAnalyses(chunkResults: string[], docType: DocumentType, fullText: string): Promise<AnalysisResult> {
    const prompt = `
      Merge these partial analyses into a final structured report for a ${docType}.
      Format as JSON with the following structure:
      {
        "title": "A concise title for the document",
        "summary": "Executive summary",
        "keyPoints": ["point 1", "point 2"],
        "risks": [{"title": "", "severity": "low|medium|high", "explanation": "", "sourceHint": ""}],
        "obligations": [{"party": "user|provider|client|bidder|unspecified", "obligation": "", "timing": ""}],
        "deadlines": [{"dateOrPeriod": "", "description": "", "severity": "info|important|urgent"}],
        "keyClauses": [{"type": "payment|termination|liability|...", "title": "", "summary": "", "sourceHint": ""}],
        "unclearAreas": ["area 1"],
        "suggestedQuestions": ["question 1"],
        "confidenceNotes": ["note 1"]
      }
      
      Partial analyses:
      ${chunkResults.join('\n---\n')}
    `;

    console.log("[Pipeline] Starts merging partial chunks into structured JSON...");

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    try {
      console.log("[Pipeline] Processing AI JSON response...");
      const data = parseDocumentAnalysis(response.text);
      
      return {
        id: '',
        fileName: '',
        fileSize: 0,
        uploadDate: '',
        documentType: data.documentType || docType,
        title: data.title,
        summary: data.summary,
        keyPoints: data.keyPoints,
        risks: data.risks,
        obligations: data.obligations,
        deadlines: data.deadlines,
        keyClauses: data.keyClauses,
        unclearAreas: data.unclearAreas,
        suggestedQuestions: data.suggestedQuestions,
        confidenceNotes: data.confidenceNotes
      };
    } catch (error: any) {
       console.error("[Pipeline] JSON Parse failed:", error);
       console.log("Raw Response was:", response.text);
       throw new Error("Analysis failed: The AI generated an invalid response shape. " + error.message);
    }
  }

  async chat(chunks: any[], question: string, title: string): Promise<string> {
    const context = Array.isArray(chunks) 
      ? chunks.map(c => typeof c === 'string' ? c : c.content).join('\n').substring(0, 30000)
      : "";

    const prompt = `
      You are DOCURA AI, an expert legal and document analyst. 
      You are answering a question about the document titled "${title}".
      
      Document Context:
      ${context}
      
      Question: ${question}
      
      Provide a clear, professional, and accurate answer based ONLY on the provided context. 
      If the information is not in the context, state that clearly.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  }
}
