import { TokenBucket } from './rateLimiter';

export class OzonClient {
  private limiter: TokenBucket;

  constructor(private clientId: string, private apiKey: string) {
    // Ozon generally has stricter limits, e.g. ~1000 per minute or varies by method.
    this.limiter = new TokenBucket(50, 5); 
  }

  private async fetchWithRateLimit(url: string, options: RequestInit = {}): Promise<Response> {
    await this.limiter.waitForToken(1);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Client-Id': this.clientId,
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.status === 429) {
          console.warn(`[Ozon Client] Rate limit exceeded (HTTP 429). Throttling...`);
          // Could expand to implement automatic retry-after parsing
      }

      return response;
    } catch (error) {
      console.error(`[Ozon Client] Request failed:`, error);
      throw error;
    }
  }

  /**
   * POST /v2/finance/realization
   * Fetch realization report.
   */
  async getRealizationReport(dateFrom: string, dateTo: string) {
    const url = 'https://api-seller.ozon.ru/v2/finance/realization';
    const body = JSON.stringify({
      date: {
        from: dateFrom,
        to: dateTo
      }
    });

    const response = await this.fetchWithRateLimit(url, {
      method: 'POST',
      body
    });

    if (!response.ok) {
      throw new Error(`Ozon API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
