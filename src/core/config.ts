/**
 * App config. DEMO_MODE controls whether the API client uses mock or real backend.
 * Defaults to true (demo/mock) when unset. Set NEXT_PUBLIC_DEMO_MODE=false for real backend.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
