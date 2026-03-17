export function parseDocumentAnalysis(input: string): any {
  let jsonString = input.trim();

  // 1. Strip markdown fences if present
  if (jsonString.startsWith("```")) {
    const firstNewline = jsonString.indexOf("\n");
    if (firstNewline !== -1) {
      jsonString = jsonString.slice(firstNewline + 1);
    }
    const endFences = jsonString.lastIndexOf("```");
    if (endFences !== -1) {
      jsonString = jsonString.slice(0, endFences);
    }
    jsonString = jsonString.trim();
  }

  // 2. Identify the first valid JSON object start and end
  const firstBrace = jsonString.indexOf("{");
  const lastBrace = jsonString.lastIndexOf("}");
  
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error("Could not locate a JSON object in the AI response.");
  }

  jsonString = jsonString.slice(firstBrace, lastBrace + 1);

  // 3. Clean up common JSON issues (trailing commas, unescaped quotes) - simple heuristic
  jsonString = jsonString.replace(/,\s*([}\]])/g, "$1");

  // 4. Parse
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err: any) {
    throw new Error("Failed to parse JSON response: " + err.message);
  }

  // 5. Provide minimal defaults if required arrays are missing
  return {
    documentType: parsed.documentType || "general_pdf",
    title: parsed.title || "Untitled Document",
    summary: parsed.summary || "No summary provided.",
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
    risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    obligations: Array.isArray(parsed.obligations) ? parsed.obligations : [],
    deadlines: Array.isArray(parsed.deadlines) ? parsed.deadlines : [],
    keyClauses: Array.isArray(parsed.keyClauses) ? parsed.keyClauses : [],
    unclearAreas: Array.isArray(parsed.unclearAreas) ? parsed.unclearAreas : [],
    suggestedQuestions: Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions : [],
    confidenceNotes: Array.isArray(parsed.confidenceNotes) ? parsed.confidenceNotes : [],
  };
}
