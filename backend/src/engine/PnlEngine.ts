export interface SkuPnlParams {
  retailPrice: number;
  cogsUnit: number;
  commissions: number;
  logistics: number;
  taxRate: number; // e.g., 0.06 or 0.15
}

export class PnlEngine {
  /**
   * Calculates the Contribution Margin (на уровне 1 SKU)
   * Formula: retail_price_withdisc_rub − COGS_Unit − (Комиссии + Логистика) − (retail_price_withdisc_rub * Tax_Rate)
   */
  public static calculateContributionMargin(params: SkuPnlParams): number {
    const taxAmount = params.retailPrice * params.taxRate;
    return params.retailPrice - params.cogsUnit - (params.commissions + params.logistics) - taxAmount;
  }
}
