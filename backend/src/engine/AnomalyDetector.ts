export interface MarketplaceTransaction {
  revenue: number;
  marketplaceCosts: number;
  actualPayout: number; // ppvz_for_pay (WB) or accruals_for_sale (Ozon)
  marketplace: 'WB' | 'OZON';
  deductions?: Record<string, number>;
  expectedDeliveryCost?: number;
  actualDeliveryCost?: number;
}

export interface AnomalyReport {
  hasAnomaly: boolean;
  discrepancyAmount: number; // diff between REVENUE - COSTS and ACTUAL PAYOUT
  hiddenDeductions: string[];
}

export class AnomalyDetector {
  /**
   * Detects hidden deductions and payout discrepancies based on Financial Model
   */
  public static detectAnomalies(tx: MarketplaceTransaction): AnomalyReport {
    const report: AnomalyReport = {
      hasAnomaly: false,
      discrepancyAmount: 0,
      hiddenDeductions: [],
    };

    // 1. Check Accruals Math: REVENUE - MARKETPLACE COSTS == ACTUAL PAYOUT (ppvz_for_pay / accruals_for_sale)
    const expectedPayout = tx.revenue - tx.marketplaceCosts;
    const diff = Math.abs(expectedPayout - tx.actualPayout);
    
    // Float precision safety (e.g. 0.01 tolerance)
    if (diff > 0.01) {
      report.hasAnomaly = true;
      report.discrepancyAmount = diff;
    }

    // 2. Identify specific hidden deductions (e.g., Antifraud on Ozon, generic deductions)
    if (tx.deductions) {
      for (const [key, value] of Object.entries(tx.deductions)) {
        if (value > 0) {
           const lowerKey = key.toLowerCase();
           if (lowerKey.includes('antifraud') || lowerKey.includes('deduction') || lowerKey.includes('penalty')) {
             report.hasAnomaly = true;
             report.hiddenDeductions.push(`${key}: ${value}`);
           }
        }
      }
    }

    // 3. Check for delivery_rub discrepancies (e.g., on WB delivery costs changed unexpectedly)
    if (tx.marketplace === 'WB' && tx.expectedDeliveryCost !== undefined && tx.actualDeliveryCost !== undefined) {
      if (tx.actualDeliveryCost > tx.expectedDeliveryCost) {
        report.hasAnomaly = true;
        report.hiddenDeductions.push(`Delivery cost changed: expected ${tx.expectedDeliveryCost}, got ${tx.actualDeliveryCost}`);
      }
    }

    return report;
  }
}
