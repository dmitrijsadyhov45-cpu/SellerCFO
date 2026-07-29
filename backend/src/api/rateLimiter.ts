export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly maxTokens: number,
    private readonly refillRatePerSecond: number
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  async waitForToken(count: number = 1): Promise<void> {
    while (!this.tryConsume(count)) {
      // Sleep for a short duration before checking again
      await new Promise((resolve) => setTimeout(resolve, 100)); 
    }
  }

  private tryConsume(count: number): boolean {
    this.refill();
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const timePassedSeconds = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassedSeconds * this.refillRatePerSecond;
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }
  
  /**
   * Used for explicit penalty deduction (e.g. Wildberries 4XX errors)
   */
  deductTokens(count: number): void {
      this.tokens = Math.max(0, this.tokens - count);
  }
}
