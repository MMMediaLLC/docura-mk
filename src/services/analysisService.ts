import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { AnalysisResult } from "../types/analysis";
import { v4 as uuidv4 } from 'uuid';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs`;

// Keep in sync with MAX_DOC_CHARS in api/analyze.ts.
const MAX_DOC_CHARS = 200000;

export class AnalysisService {
  // Retaining the constructor signature prevents Dashboard.tsx compilation errors
  constructor(apiKey?: string) {
    if (apiKey) {
      console.warn("AnalysisService was initialized with an API key, but is now securely using backend endpoints.");
    }
  }

  async analyze(file: File): Promise<{ analysis: AnalysisResult, chunks: any[] }> {
    const text = await this.extractText(file);
    
    console.log("[Pipeline] Starting full document analysis via secure backend API...");

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          fileName: file.name, 
          fileSize: file.size 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Backend Error]", response.status, errorText);
        // Surface the specific server-side reason to the user when available,
        // instead of a generic failure message.
        let serverMessage = '';
        try {
          serverMessage = JSON.parse(errorText)?.error || '';
        } catch { /* response was not JSON */ }
        throw new Error(serverMessage || "Анализата не успеа. Ве молиме обидете се повторно.");
      }

      console.log("[Pipeline] Processing backend JSON response...");
      const data = await response.json();
      const payload = data.analysis || data; // Handle standard or wrapped shape
      
      const finalAnalysis: AnalysisResult = {
        id: uuidv4(),
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        documentType: payload.documentType || "general_pdf",
        title: payload.title || file.name,
        summary: payload.summary || "No summary available.",
        keyPoints: payload.keyPoints || [],
        risks: payload.risks || [],
        penalties: payload.penalties || [],
        obligations: payload.obligations || [],
        deadlines: payload.deadlines || [],
        keyClauses: payload.keyClauses || [],
        unclearAreas: payload.unclearAreas || [],
        suggestedQuestions: payload.suggestedQuestions || [],
        confidenceNotes: payload.confidenceNotes || []
      };

      const chunks = [{ id: uuidv4(), content: text, startIndex: 0, endIndex: text.length }];
      return { analysis: finalAnalysis, chunks };
    } catch (error: any) {
      console.error("[Pipeline] Secure Fetch failed:", error);
      // Preserve the specific (already localized) message; only fall back to a
      // generic Macedonian message for genuine network/transport failures.
      if (error instanceof Error && error.message) throw error;
      throw new Error("Не може да се воспостави врска со серверот за анализа. Проверете ја интернет-врската и обидете се повторно.");
    }
  }

  private async extractText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    
    let text = '';
    
    const fileName = file.name.toLowerCase();
    
    if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      text = await file.text();
    }
    
    text = this.cleanText(text);
    
    if (text.length < 50) {
      throw new Error("Датотеката не може да се прочита јасно. Можеби е PDF само со слики (скениран без текст), заштитена со лозинка или празна. Обидете се со датотека што содржи избирлив текст.");
    }

    if (text.length > MAX_DOC_CHARS) {
      console.warn(`[Pipeline] Text exceeds threshold: ${text.length} chars. Rejecting to prevent abuse and high costs.`);
      throw new Error(`Документот е преголем (${text.length.toLocaleString('mk-MK')} знаци). Дозволени се најмногу 200.000 знаци. Поделете го документот на помали делови и анализирајте ги поединечно.`);
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

  async chat(chunks: any[], question: string, title: string): Promise<string> {
    const context = Array.isArray(chunks) 
      ? chunks.map(c => typeof c === 'string' ? c : c.content).join('\n').substring(0, 30000)
      : "";

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, question, title })
      });

      if (!response.ok) {
        throw new Error(`Chat API failed securely: ${response.statusText}`);
      }

      const data = await response.json();
      return data.answer || "No response generated by secure backend.";
    } catch (error: any) {
      console.error("[Backend] Secure Chat Error:", error);
      throw new Error("Chat failed to communicate with secure backend.");
    }
  }
}
