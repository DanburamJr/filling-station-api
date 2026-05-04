/**
 * Quick deploy check without Postman.
 * Usage:
 *   npm run smoke -- https://your-service.up.railway.app
 *   npm run smoke -- http://localhost:5000
 *   set API_URL=https://...&& npm run smoke   (Windows CMD)
 */

const baseArg = process.argv[2]?.trim();
const baseEnv = process.env.API_URL?.trim();
const base = baseArg || baseEnv;

if (!base) {
  console.error("Missing URL.");
  console.error("  npm run smoke -- https://<your-railway-host>");
  console.error("  API_URL=https://<host> npm run smoke");
  process.exit(1);
}

const origin = base.replace(/\/$/, "");
const healthUrl = `${origin}/health`;

try {
  const res = await fetch(healthUrl);
  const text = await res.text();
  console.log(`GET ${healthUrl}`);
  console.log(`HTTP ${res.status}`);
  console.log(text);
  process.exit(res.ok ? 0 : 1);
} catch (err) {
  console.error("Request failed:", err.message);
  process.exit(1);
}
