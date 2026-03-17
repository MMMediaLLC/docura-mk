import { GoogleGenAI } from "@google/genai";
import { DocumentChunk } from "../types/document";

export async function askDocument(
  question: string,
  chunks: DocumentChunk[],
  summary: string,
  ai: GoogleGenAI
): Promise<string> {
  console.log(`[QA] Answering question: ${question}`);

  // 1. Simple retrieval: find chunks containing keywords from the question
  const keywords = question.toLowerCase().split(' ').filter(w => w.length > 3);
  const relevantChunks = chunks
    .map(chunk => {
      let score = 0;
      keywords.forEach(kw => {
        if (chunk.text.toLowerCase().includes(kw)) score++;
      });
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Top 3 chunks
    .map(c => c.chunk);

  const context = relevantChunks.map(c => c.text).join('\n\n---\n\n');

  const prompt = `
    You are DOCURA Q&A assistant. Answer the user's question based ONLY on the provided document context.
    If the answer is not in the context, say you don't know.
    
    Document Summary:
    ${summary}

    Relevant Context:
    ${context}

    Question:
    ${question}

    Answer concisely with citations if possible. Not legal advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("[QA] Failed to generate answer:", error);
    return "I'm sorry, I encountered an error while searching the document.";
  }
}
