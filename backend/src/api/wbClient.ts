import { TokenBucket } from './rateLimiter';

export class WildberriesClient {
  private limiter: TokenBucket;

  constructor(private apiKey: string) {
    // Base limits for WB API (Adjustable based on specific endpoint requirements)
    this.limiter = new TokenBucket(100, 1);
  }

  private async fetchWithRateLimit(url: string, options: RequestInit = {}): Promise<Response> {
    await this.limiter.waitForToken(1);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Wildberries penalty: 4xx errors deduct 10 requests from limits
      if (response.status >= 400 && response.status < 500) {
        console.warn(`[WB Client] 4XX Error on ${url}. Applying penalty deduction of 10 tokens.`);
        this.limiter.deductTokens(10);
      }

      return response;
    } catch (error) {
      console.error(`[WB Client] Request failed:`, error);
      throw error;
    }
  }

  /**
   * POST /api/finance/v1/sales-reports/detailed
   * Fetch detailed sales reports. Base for revenue calculations.
   */
  async getDetailedSalesReports(dateFrom: string, dateTo: string, limit: number = 1000, rrdid: number = 0) {
    const url = 'https://statistics-api.wildberries.ru/api/finance/v1/sales-reports/detailed';
    const body = JSON.stringify({
        dateFrom,
        dateTo,
        limit,
        rrdid
    });
    
    const response = await this.fetchWithRateLimit(url, {
        method: 'POST',
        body
    });

    if (!response.ok) {
        throw new Error(`WB API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
