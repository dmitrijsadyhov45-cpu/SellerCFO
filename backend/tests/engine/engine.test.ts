import { PnlEngine } from '../../src/engine/PnlEngine';

describe('PnlEngine Tests', () => {
  it('should correctly calculate positive contribution margin', () => {
    const result = PnlEngine.calculateContributionMargin({
      retailPrice: 1000,
      cogsUnit: 300,
      commissions: 150,
      logistics: 100,
      taxRate: 0.06
    });
    // 1000 - 300 - 250 - 60 = 390
    expect(result).toBe(390);
  });

  it('should correctly identify negative margin due to high penalties/logistics', () => {
    const result = PnlEngine.calculateContributionMargin({
      retailPrice: 500,
      cogsUnit: 200,
      commissions: 100,
      logistics: 300, // Very high logistics (e.g. dimensional penalty)
      taxRate: 0.06
    });
    // 500 - 200 - 400 - 30 = -130
    expect(result).toBe(-130);
  });

  it('should handle zero revenue correctly', () => {
    const result = PnlEngine.calculateContributionMargin({
      retailPrice: 0,
      cogsUnit: 500,
      commissions: 0,
      logistics: 100, // return logistics
      taxRate: 0.06
    });
    // 0 - 500 - 100 - 0 = -600
    expect(result).toBe(-600);
  });
});
