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
  try {
    // 1. Validate Method — return 200 for PING/OPTIONS/GET health checks
    if (req.method !== 'POST') {
      return res.status(200).json({ received: true, message: 'Non-POST requests safely ignored' });
    }

    // 2. Safely read raw body regardless of Vercel runtime config
    let rawBody: Buffer;
    if (req.body instanceof Buffer) {
      rawBody = req.body;
    } else if (typeof req.body === 'string') {
      rawBody = Buffer.from(req.body, 'utf8');
    } else if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      // Vercel body parser triggered early — stringification fallback
      rawBody = Buffer.from(JSON.stringify(req.body), 'utf8');
    } else {
      // Consume incoming message stream safely with timeout
      rawBody = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        let timeout = setTimeout(() => reject(new Error('req stream timeout')), 5000);
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          clearTimeout(timeout);
          resolve(Buffer.concat(chunks));
        });
        req.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    }

    // 3. Verify HMAC-SHA256 signature using the correct header: X-Signature
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';
    const signature = req.headers['x-signature'];

    if (!verifySignature(rawBody, signature, secret)) {
      console.warn('[LS Webhook] Signature mismatch. Header present:', !!signature, '| Secret set:', !!secret);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 4. Safely parse JSON payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload format' });
    }

    // 5. Extract strictly guarded properties (Defensive extraction)
    const eventName: string = payload?.meta?.event_name || 'unknown';
    // Lemon Squeezy wraps resource data in 'data'
    const objData = payload?.data || {};
    const attrs = objData?.attributes || {};
    const rels = objData?.relationships || {};

    // Prioritize custom_data.userId over string matching the billing email
    const customDataUserId = payload?.meta?.custom_data?.user_id || payload?.meta?.custom_data?.userId;

    const userEmail: string | undefined =
      attrs.user_email ||
      attrs.billing_address?.email ||
      rels.customer?.data?.email;

    const variantId: string | number | undefined =
      attrs.variant_id ||
      rels.variant?.data?.id ||
      payload?.meta?.custom_data?.variant_id;

    console.log(`[LS Webhook] Event: ${eventName} | Email: ${userEmail} | custom_id: ${customDataUserId} | Variant: ${variantId}`);

    // If no recognizable event, safely exit with 200
    if (!eventName || eventName === 'unknown') {
      return res.status(200).json({ received: true, ignored: 'Unknown event name' });
    }

    // 6. Initialize Firebase Admin lazily
    const app = getAdminApp();
    const db = admin.firestore(app);

    // Helper: find user doc ID
    async function resolveUserId(): Promise<string | null> {
      if (customDataUserId) {
        // Direct ID lookup ensures we match exactly the user who paid, regardless of their Apple Pay/PayPal email
        const docRef = await db.collection('users').doc(String(customDataUserId)).get();
        if (docRef.exists) return String(customDataUserId);
      }
      if (userEmail) {
        // Fallback to email match
        const snap = await db.collection('users').where('email', '==', String(userEmail)).limit(1).get();
        if (!snap.empty) return snap.docs[0].id;
      }
      return null;
    }

    // 7. Process recognized events safely
    switch (eventName) {
      case 'order_created':
      case 'subscription_created':
      case 'subscription_payment_success':
      case 'subscription_updated': {
        const userId = await resolveUserId();
        if (!userId) {
          console.warn(`[LS Webhook] Ignored ${eventName} - user not found. Extracted Email: ${userEmail}, Custom ID: ${customDataUserId}`);
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
        // Optionally lock them out here, or wait for subscription_expired.
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        const userId = await resolveUserId();
        if (!userId) {
          console.warn(`[LS Webhook] Ignored ${eventName} - user not found to cancel. Email: ${userEmail}`);
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

    // ALWAYS RETURN 200 IF WE MADE IT THIS FAR
    return res.status(200).json({ received: true, event: eventName, processed: true });

  } catch (globalError: any) {
    // 8. Trap ALL fatal exceptions so we NEVER throw HTTP 500 randomly.
    // If we throw 5xx, Lemon Squeezy retries for 3 days and generates noise.
    console.error('[LS Webhook] Global Fatal Crash:', globalError?.message || String(globalError));
    return res.status(200).json({ received: true, error_suppressed: true, message: globalError?.message });
  }
}
// Required for Vercel to pass raw body correctly
export const config = {
  api: {
    bodyParser: false,
  },
};
