/**
 * Simulates network delay for demo mode. No persistence, no PII logging.
 */
const MIN_MS = 300;
const MAX_MS = 800;

export function simulateDelay(ms?: number): Promise<void> {
  const duration = ms ?? MIN_MS + Math.random() * (MAX_MS - MIN_MS);
  return new Promise((resolve) => setTimeout(resolve, duration));
}
