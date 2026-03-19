import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";

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

  // Legacy Analysis API endpoints removed in favor of client-side architecture
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
