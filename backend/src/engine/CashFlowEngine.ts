export interface WorkingCapitalParams {
  cash: number;
  accountsReceivable: number;
  inventoryValue: number;
  accountsPayable: number;
}

export interface CashGapPredictionParams {
  currentCash: number;
  projectedInflows: number;
  projectedOutflows: number;
}

export class CashFlowEngine {
  /**
   * Calculates Working Capital
   * Formula: Cash + Accounts Receivable + Inventory Value - Accounts Payable
   */
  public static calculateWorkingCapital(params: WorkingCapitalParams): number {
    return params.cash + params.accountsReceivable + params.inventoryValue - params.accountsPayable;
  }

  /**
   * Predicts if there will be a cash gap (cash dropping below 0)
   */
  public static predictCashGap(params: CashGapPredictionParams): boolean {
    const futureCash = params.currentCash + params.projectedInflows - params.projectedOutflows;
    return futureCash < 0;
  }
}
