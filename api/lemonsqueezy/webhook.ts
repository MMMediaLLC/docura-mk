// ==========================================================
// api/lemonsqueezy/webhook.ts
// Vercel serverless function — Lemon Squeezy webhook handler
//
// Route: POST /api/lemonsqueezy/webhook
// Verifies X-Signature-256 via HMAC-SHA256 and updates
// Firestore user plan via Firebase Admin SDK.
// ==========================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';
import * as admin from 'firebase-admin';

// ── Firebase Admin SDK singleton ────────────────────────────

function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) return admin.apps[0]!;

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Vercel env vars store \n as a literal backslash+n — fix it:
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// ── Signature verification ──────────────────────────────────

function verifySignature(rawBody: Buffer, signatureHeader: string | string[] | undefined, secret: string): boolean {
  if (!signatureHeader || !secret) return false;
  const sig = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(sig, 'hex'));
  } catch {
    return false;
  }
}

// ── Plan mapping ────────────────────────────────────────────

function resolvePlan(variantId: string | number | undefined): 'pro' | 'business' | null {
  const PRO_VARIANT_IDS = (process.env.LS_PRO_VARIANT_IDS || '').split(',').map(s => s.trim());
  const BIZ_VARIANT_IDS = (process.env.LS_BIZ_VARIANT_IDS || '').split(',').map(s => s.trim());
  const id = String(variantId || '');
  if (PRO_VARIANT_IDS.includes(id)) return 'pro';
  if (BIZ_VARIANT_IDS.includes(id)) return 'business';
  return null;
}

// ── Firestore helpers ───────────────────────────────────────

async function getUserDocIdByEmail(db: admin.firestore.Firestore, email: string): Promise<string | null> {
  const snap = await db.collection('users').where('email', '==', email).limit(1).get();
  if (snap.empty) return null;
  return snap.docs[0].id;
}

async function activateUserPlan(db: admin.firestore.Firestore, userId: string, plan: 'pro' | 'business'): Promise<void> {
  const now = admin.firestore.Timestamp.now().toDate();
  const end = new Date(now);
  end.setMonth(end.getMonth() + 1);

  await db.collection('users').doc(userId).update({
    plan,
    usageCount: 0,
    usedAnalysesInPeriod: 0,
    subscriptionStatus: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: end.toISOString(),
  });
}

async function downgradeUserToFree(db: admin.firestore.Firestore, userId: string): Promise<void> {
  await db.collection('users').doc(userId).update({
    plan: 'free',
    usageCount: 0,
    usedAnalysesInPeriod: 0,
    subscriptionStatus: 'inactive',
  });
}

// ── Main handler ────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Read raw body (Vercel buffers it automatically)
  const rawBody = req.body instanceof Buffer
    ? req.body
    : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

  // 2. Verify HMAC signature
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';
  const signature = req.headers['x-signature-256'];

  if (!verifySignature(rawBody, signature, secret)) {
    console.warn('[LS Webhook] Invalid signature — rejecting');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 3. Parse payload
  let payload: any;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const eventName: string = payload?.meta?.event_name || '';
  const attrs = payload?.data?.attributes || {};

  // Extract the billing/user email
  const userEmail: string | undefined =
    attrs.user_email ||
    attrs.billing_address?.email ||
    payload?.data?.relationships?.customer?.data?.email;

  // Extract Lemon Squeezy variant ID (used to map to pro/business)
  const variantId: string | number | undefined =
    attrs.variant_id ||
    payload?.data?.relationships?.variant?.data?.id;

  console.log(`[LS Webhook] Event: ${eventName} | Email: ${userEmail} | Variant: ${variantId}`);

  // 4. Initialize Firebase Admin
  const app = getAdminApp();
  const db = admin.firestore(app);

  // 5. Process events
  try {
    switch (eventName) {
      case 'order_created':
      case 'subscription_created':
      case 'subscription_payment_success':
      case 'subscription_updated': {
        if (!userEmail) {
          console.warn(`[LS Webhook] No email found for event ${eventName}`);
          break;
        }
        const plan = resolvePlan(variantId);
        if (!plan) {
          console.warn(`[LS Webhook] Unknown variant ${variantId} — cannot map to plan`);
          break;
        }
        const userId = await getUserDocIdByEmail(db, userEmail);
        if (!userId) {
          console.warn(`[LS Webhook] No user found with email ${userEmail}`);
          break;
        }
        await activateUserPlan(db, userId, plan);
        console.log(`[LS Webhook] ✅ Activated ${plan} for user ${userId} (${userEmail})`);
        break;
      }

      case 'subscription_payment_failed': {
        // Payment failed — do not immediately downgrade, just log
        console.warn(`[LS Webhook] Payment failed for ${userEmail} — monitoring`);
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        if (!userEmail) break;
        const userId = await getUserDocIdByEmail(db, userEmail);
        if (!userId) {
          console.warn(`[LS Webhook] No user found with email ${userEmail}`);
          break;
        }
        await downgradeUserToFree(db, userId);
        console.log(`[LS Webhook] ℹ️ Downgraded ${userId} to free (${eventName})`);
        break;
      }

      default:
        console.log(`[LS Webhook] Unhandled event: ${eventName}`);
    }
  } catch (err: any) {
    console.error('[LS Webhook] Firestore error:', err.message);
    // Still return 200 so Lemon Squeezy does not retry indefinitely
    return res.status(200).json({ received: true, warning: 'Firestore update failed' });
  }

  return res.status(200).json({ received: true, event: eventName });
}

// Required for Vercel to pass raw body correctly
export const config = {
  api: {
    bodyParser: false,
  },
};
