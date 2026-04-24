/**
 * Server-side fetch with friendly error handling, retries, and a tiny
 * in-process cache so flaky upstream APIs (hello, NASA) don't nuke the UI.
 *
 * - Retries on network errors / 5xx (default 2 retries with exponential backoff).
 * - Each attempt gets its own AbortController timeout (default 8s).
 * - On success, caches the parsed JSON for `cacheMs`. On upstream failure,
 *   if a cached value exists — even if stale — we serve it as a graceful
 *   fallback so the page still renders.
 *
 * `null` is only returned when there is no cached fallback AND all retries
 * failed.
 */

interface SafeFetchOptions extends RequestInit {
  /** Next.js ISR hint — forwarded untouched to the fetch call. */
  revalidate?: number | false;
  /** Per-attempt timeout. */
  timeoutMs?: number;
  /** How many additional attempts after the first. */
  retries?: number;
  /** Base delay between retries in ms (exponential: base, base*2, base*4 …). */
  retryDelayMs?: number;
  /**
   * If > 0, successful responses are cached in-process for this many ms.
   * Stale cache is still served as a fallback when the upstream is down.
   * Defaults to the value of `revalidate` (seconds) * 1000, or 1h.
   */
  cacheMs?: number;
}

interface CacheEntry<T> {
  value: T;
  expires: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

function cacheKey(url: string): string {
  // Strip api_key so identical requests share the same slot.
  return url.replace(/([?&])api_key=[^&]+/g, "$1api_key=KEY");
}

export async function safeFetch<T = unknown>(
  url: string,
  init?: SafeFetchOptions,
): Promise<T | null> {
  const {
    revalidate,
    timeoutMs = 8_000,
    retries = 2,
    retryDelayMs = 400,
    cacheMs,
    ...rest
  } = init ?? {};

  const key = cacheKey(url);
  const effectiveCacheMs =
    cacheMs ?? (typeof revalidate === "number" ? revalidate * 1000 : 60 * 60 * 1000);

  // Serve from fresh cache straight away.
  const cached = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }

  let lastErr: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...rest,
        signal: controller.signal,
        next: revalidate === undefined ? undefined : { revalidate: revalidate || 0 },
      });
      if (res.ok) {
        const data = (await res.json()) as T;
        if (effectiveCacheMs > 0) {
          memoryCache.set(key, { value: data, expires: Date.now() + effectiveCacheMs });
        }
        return data;
      }
      if (res.status === 429 || res.status === 403) {
        console.warn(
          `[safeFetch] rate-limited (${res.status}) :: ${redact(url)} — attempt ${attempt + 1}/${retries + 1}`,
        );
      } else if (res.status >= 500) {
        console.warn(
          `[safeFetch] ${res.status} ${res.statusText} :: ${redact(url)} — attempt ${attempt + 1}/${retries + 1}`,
        );
      } else {
        // 4xx (non-rate-limit) — don't retry, it's a client-side issue.
        console.warn(`[safeFetch] ${res.status} ${res.statusText} :: ${redact(url)}`);
        lastErr = res.status;
        break;
      }
      lastErr = res.status;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[safeFetch] failed :: ${redact(url)} — ${msg} — attempt ${attempt + 1}/${retries + 1}`,
      );
    } finally {
      clearTimeout(timer);
    }
    if (attempt < retries) {
      await sleep(retryDelayMs * Math.pow(2, attempt));
    }
  }

  // All attempts failed — fall back to stale cache if we have one.
  if (cached) {
    console.warn(`[safeFetch] serving stale cache :: ${redact(url)}`);
    return cached.value;
  }
  void lastErr;
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Strip the api_key parameter from URLs before logging. */
function redact(url: string): string {
  return url.replace(/api_key=[^&]+/g, "api_key=***");
}
