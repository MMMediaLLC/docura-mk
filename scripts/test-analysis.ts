import { GoogleGenAI } from "@google/genai";
import { analyzeDocument } from "../src/lib/analysis-engine";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key present:", !!apiKey);
  
  const ai = new GoogleGenAI({ apiKey: apiKey || "" });
  
  const samplePath = path.join(__dirname, "../sample-documents/sample-contract.txt");
  
  if (!fs.existsSync(samplePath)) {
    console.error("Sample document not found at:", samplePath);
    return;
  }

  const buffer = fs.readFileSync(samplePath);
  
  try {
    console.log("Starting test analysis...");
    const result = await analyzeDocument(
      buffer,
      "sample-contract.txt",
      buffer.length,
      "text/plain",
      ai
    );
    
    console.log("Test Analysis Result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
