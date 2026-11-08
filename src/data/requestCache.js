const cachedValues = new Map();
const pendingRequests = new Map();
const CACHE_TTL_MS = 60_000;

export const getCachedRequest = (key, request) => {
  const cached = cachedValues.get(key);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value);
  if (!pendingRequests.has(key)) {
    const pending = request()
      .then((value) => {
        cachedValues.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
        return value;
      })
      .finally(() => pendingRequests.delete(key));
    pendingRequests.set(key, pending);
  }
  return pendingRequests.get(key);
};

export const invalidateCachedRequests = (keyPrefix) => {
  for (const key of cachedValues.keys()) {
    if (key.startsWith(keyPrefix)) cachedValues.delete(key);
  }
};
