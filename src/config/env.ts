// =============================================================
// Environment Variable Configuration
// =============================================================

export const env = {
  // We use process.env to bridge Vite defines setup in vite.config.ts
  APP_URL: (typeof process !== "undefined" && process.env.APP_URL) || import.meta.env?.VITE_APP_URL || window.location.origin,
};

// Check if critical env variables needed server-side are documented
// Note: Frontend does NOT need GEMINI_API_KEY anymore. The backend needs it.

export function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    console.warn(`Environment variable \${name} is missing. If required by frontend, unexpected behavior may occur.`);
  }
  return value as string;
}
