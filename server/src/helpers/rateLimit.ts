export function createRateLimiter(max: number, windowMs: number) {
  const hits: number[] = [];

  return function allow(): boolean {
    const now = Date.now();

    while (hits.length > 0 && now - hits[0] > windowMs) {
      hits.shift();
    }

    if (hits.length >= max) return false;

    hits.push(now);
    return true;
  };
}
