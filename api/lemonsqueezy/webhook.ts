// ==========================================================
// api/lemonsqueezy/webhook.ts
// Vercel serverless function — Lemon Squeezy webhook handler
//
// Route: POST /api/lemonsqueezy/webhook
// Verifies X-Signature via HMAC-SHA256 and updates
// Firestore user plan via Firebase Admin SDK.
// ==========================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';
import admin from 'firebase-admin';

// ── Plan Configuration ──────────────────────────────────────

const PLAN_CONFIG = {
  free: { usageLimit: 1 },
  pro: { usageLimit: 2 },
  business: { usageLimit: 15 }
} as const;

// ── Firebase Admin SDK singleton ────────────────────────────

function getAdminApp(): admin.app.App {
  // Guard against undefined admin or admin.apps runtime error in ESM
  if (admin?.apps?.length) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Explicit environment variable validation (Fail fast)
  if (!projectId || !clientEmail || !privateKey) {
    console.error('[LS Webhook] FATAL: Missing Firebase environment variables. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');
    throw new Error('Firebase Admin initialization failed: Missing required environment variables.');
  }

  // Vercel env vars store \n as a literal backslash+n — fix it:
  privateKey = privateKey.replace(/\\n/g, '\n');

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// ── Signature verification ──────────────────────────────────

function verifySignature(rawBody: Buffer, signatureHeader: string | string[] | undefined, secret: string): boolean {
  if (!signatureHeader || !secret) return false;
  
  const sig = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');

  try {
    if (sig.length !== digest.length) return false;
    return crypto.timingSafeEqual(Buffer.from(digest, 'utf8'), Buffer.from(sig, 'utf8'));
  } catch {
    return false;
  }
}

// ── Plan mapping ────────────────────────────────────────────

function resolvePlan(variantId: string | number | undefined): 'pro' | 'business' | null {
  const PRO_VARIANT_IDS = (process.env.LS_PRO_VARIANT_IDS || '').split(',').map(s => s.trim());
  const BIZ_VARIANT_IDS = (process.env.LS_BIZ_VARIANT_IDS || '').split(',').map(s => s.trim());
  
  const id = String(variantId || '');
  
  // Explicitly map the new variant
  if (id === '1414356' || PRO_VARIANT_IDS.includes(id)) return 'pro';
  if (BIZ_VARIANT_IDS.includes(id)) return 'business';
  
  return null;
}

// ── Firestore helpers ───────────────────────────────────────

async function activateUserPlan(db: admin.firestore.Firestore, userId: string, plan: 'pro' | 'business'): Promise<void> {
  const now = admin.firestore.Timestamp.now().toDate();
  const end = new Date(now);
  end.setMonth(end.getMonth() + 1);

  await db.collection('users').doc(userId).update({
    plan,
    usageLimit: PLAN_CONFIG[plan].usageLimit,
    usageCount: 0,
    usedAnalysesInPeriod: 0,
    subscriptionStatus: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: end.toISOString(),
    usageResetDate: end.toISOString(),
  });
}

async function downgradeUserToFree(db: admin.firestore.Firestore, userId: string): Promise<void> {
  await db.collection('users').doc(userId).update({
    plan: 'free',
    usageLimit: PLAN_CONFIG.free.usageLimit,
    usageCount: 0,
    usedAnalysesInPeriod: 0,
    subscriptionStatus: 'inactive',
  });
}

// ── Main handler ────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Validate Method — return 200 for PING/OPTIONS/GET health checks
    if (req.method !== 'POST') {
      return res.status(200).json({ received: true, message: 'Non-POST requests safely ignored' });
    }

    // 2. Safely read EXACT raw body
    let rawBody: Buffer = Buffer.from('');
    
    if ((req as any).rawBody instanceof Buffer) {
      rawBody = (req as any).rawBody;
    } else if (Buffer.isBuffer(req.body)) {
      rawBody = req.body;
    } else if (typeof req.body === 'string') {
      rawBody = Buffer.from(req.body, 'utf8');
    } else {
      // Must consume the stream
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      rawBody = Buffer.concat(chunks);
    }

    // 3. Verify HMAC-SHA256 signature
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';
    const signature = req.headers['x-signature'];

    if (!verifySignature(rawBody, signature, secret)) {
      console.warn('[LS Webhook] Signature mismatch. Header present:', !!signature, '| Secret set:', !!secret);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 4. Safely parse JSON payload AFTER successful verification
    let payload: any;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload format' });
    }

    // 5. Extract guarded properties
    const eventName: string = payload?.meta?.event_name || 'unknown';
    const objData = payload?.data || {};
    const attrs = objData?.attributes || {};
    const rels = objData?.relationships || {};

    const customDataUserId = payload?.meta?.custom_data?.user_id || payload?.meta?.custom_data?.userId;
    const userEmail: string | undefined = attrs.user_email || attrs.billing_address?.email || rels.customer?.data?.email;
    const variantId: string | number | undefined = attrs.variant_id || rels.variant?.data?.id || payload?.meta?.custom_data?.variant_id;

    console.log(`[LS Webhook] Validated Event: ${eventName} | custom_id: ${customDataUserId} | Email: ${userEmail} | Variant: ${variantId}`);

    if (!eventName || eventName === 'unknown') {
      return res.status(200).json({ received: true, ignored: 'Unknown event name' });
    }

    // 6. Init DB (will fail fast if env vars are missing)
    const app = getAdminApp();
    const db = admin.firestore(app);

    // Helper: find user doc ID prioritizing customDataUserId
    async function resolveUserId(): Promise<string | null> {
      if (customDataUserId) {
        const docRef = await db.collection('users').doc(String(customDataUserId)).get();
        if (docRef.exists) return String(customDataUserId);
      }
      if (userEmail) {
        const snap = await db.collection('users').where('email', '==', String(userEmail)).limit(1).get();
        if (!snap.empty) return snap.docs[0].id;
      }
      return null;
    }

    // 7. Process recognized events
    switch (eventName) {
      case 'order_created':
      case 'subscription_created':
      case 'subscription_payment_success':
      case 'subscription_updated': {
        const userId = await resolveUserId();
        if (!userId) {
          console.warn(`[LS Webhook] Ignored ${eventName} - user not found. ID: ${customDataUserId}, Email: ${userEmail}`);
          break;
        }

        const plan = resolvePlan(variantId);
        if (!plan) {
          console.warn(`[LS Webhook] Ignored ${eventName} - unmapped variant ${variantId}`);
          break;
        }

        await activateUserPlan(db, userId, plan);
        console.log(`[LS Webhook] ✅ Success: Activated ${plan} for user ${userId}`);
        break;
      }

      case 'subscription_payment_failed': {
        const userId = await resolveUserId();
        console.warn(`[LS Webhook] Alert: Payment failed for user ${userId || userEmail || 'unknown'}`);
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        const userId = await resolveUserId();
        if (!userId) {
          console.warn(`[LS Webhook] Ignored ${eventName} - cancel user not found. Email: ${userEmail}`);
          break;
        }

        await downgradeUserToFree(db, userId);
        console.log(`[LS Webhook] ℹ️ Success: Downgraded ${userId} to free (${eventName})`);
        break;
      }

      default:
        console.log(`[LS Webhook] Safely ignored unhandled event: ${eventName}`);
        break;
    }

    return res.status(200).json({ received: true, event: eventName, processed: true });

  } catch (globalError: any) {
    console.error('[LS Webhook] Global Fatal Crash:', globalError?.message || String(globalError));
    // Must return 200 so Lemon Squeezy doesn't keep retrying crashed webhooks endlessly
    return res.status(200).json({ received: true, error_suppressed: true, message: globalError?.message });
  }
}

// Required for Vercel Serverless to pass the raw stream correctly
export const config = {
  api: {
    bodyParser: false,
  },
};
