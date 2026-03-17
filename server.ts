import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import { analyzeDocument } from "./src/lib/analysis-engine";
import { documentStore } from "./src/lib/document-store";
import { askDocument } from "./src/lib/qa-engine";
import { userStore } from "./src/lib/user-store";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const upload = multer({
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  });

  // API Routes
  app.get("/api/user/status", (req, res) => {
    res.json(userStore.getUserStatus());
  });

  app.post("/api/user/plan", (req, res) => {
    const { plan } = req.body;
    if (!['free', 'pro', 'business'].includes(plan)) {
      return res.status(400).json({ error: "Invalid plan" });
    }
    userStore.updateUser({ 
      plan, 
      usageCount: 0,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    res.json(userStore.getUserStatus());
  });

  // ==============================================================
  // Lemon Squeezy Webhook Scaffold
  // POST /api/webhook/lemonsqueezy
  //
  // For MVP: payload is logged and a simple lookup is performed.
  // In production: replace manual activation with webhook-driven
  // plan upgrades using X-Signature header verification.
  //
  // Future events to handle:
  //   - subscription_created  → activate plan
  //   - subscription_updated  → update plan
  //   - subscription_cancelled → downgrade to free
  //   - order_created         → one-time purchase activation
  // ==============================================================
  app.post("/api/webhook/lemonsqueezy", express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      // TODO (production): Verify X-Signature-256 header against LEMONSQUEEZY_WEBHOOK_SECRET
      // const signature = req.headers['x-signature-256'];
      // if (!verifyWebhookSignature(req.body, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET)) {
      //   return res.status(401).json({ error: 'Invalid signature' });
      // }

      const payload = JSON.parse(req.body.toString());
      const eventName = payload?.meta?.event_name;
      const email = payload?.data?.attributes?.user_email || payload?.data?.attributes?.billing_address?.email;
      const plan = payload?.meta?.custom_data?.plan; // Set this in Lemon Squeezy checkout custom data

      console.log(`[Webhook] Received: ${eventName} for ${email}, plan: ${plan}`);

      // TODO (production): Lookup user by billingEmail in Firestore and update their plan
      // switch (eventName) {
      //   case 'subscription_created':
      //   case 'order_created':
      //     // await upgradeUserByEmail(email, plan);
      //     break;
      //   case 'subscription_cancelled':
      //     // await downgradeUserByEmail(email);
      //     break;
      // }

      res.status(200).json({ received: true, event: eventName });
    } catch (error: any) {
      console.error('[Webhook] Error:', error.message);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  app.post("/api/analyze", upload.single('file'), async (req, res) => {
    try {
      const status = userStore.getUserStatus();
      if (status.isLimitReached) {
        return res.status(403).json({ 
          error: "You have reached your document limit. Upgrade your plan to continue.",
          limitReached: true
        });
      }

      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const result = await analyzeDocument(
        req.file.buffer,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        ai
      );

      userStore.incrementUsage();
      res.json(result);
    } catch (error: any) {
      console.error("[Server] Analysis error:", error);
      res.status(500).json({ error: "Analysis failed: " + (error.message || "Unknown error") });
    }
  });

  app.get("/api/documents", (req, res) => {
    const docs = documentStore.list().map(d => ({
      id: d.id,
      fileName: d.fileName,
      fileSize: d.fileSize,
      uploadDate: d.uploadDate,
      documentType: d.analysis.documentType
    }));
    res.json(docs);
  });

  app.get("/api/documents/:id", (req, res) => {
    const doc = documentStore.get(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc.analysis);
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { question, documentId } = req.body;
      const doc = documentStore.get(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      const answer = await askDocument(
        question,
        doc.chunks,
        doc.analysis.summary,
        ai
      );
      
      res.json({ answer });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
