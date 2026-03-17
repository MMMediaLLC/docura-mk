import { GoogleGenAI } from "@google/genai";
import { DocumentType } from "../types/analysis";

export async function classifyDocument(text: string, ai: GoogleGenAI): Promise<DocumentType> {
  console.log("[Classifier] Detecting document type...");
  
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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    const type = response.text.trim().toLowerCase() as DocumentType;
    const validTypes: DocumentType[] = ['contract', 'tender', 'business_document', 'general_pdf'];
    
    return validTypes.includes(type) ? type : 'general_pdf';
  } catch (error) {
    console.error("[Classifier] Classification failed:", error);
    return 'general_pdf';
  }
}
