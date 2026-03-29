import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { context, question, title } = req.body;

  if (!context || !question) {
    return res.status(400).json({ error: 'Missing context or question in request body.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Internal Server Error: Missing GEMINI_API_KEY environment variable.' });
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are DOCURA AI, an expert legal and document analyst. 
    You are answering a question about the document titled "${title || 'Untitled'}".
    
    Document Context:
    ${context}
    
    Question: ${question}
    
    Provide a clear, professional, and accurate answer in Macedonian (македонски јазик) based ONLY on the provided context. 
    If the information is not in the context, state that clearly in Macedonian.
    Do not respond in English.
    
    Answer precisely, citing source sections if present.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });
    
    return res.status(200).json({ answer: response.text });
  } catch (error: any) {
    console.error("[Backend] AI Chat Error:", error.message);
    return res.status(500).json({ error: "Failed to generate chat response safely." });
  }
}
