import { Activity, Percent, RussianRuble, ShoppingCart } from 'lucide-react';

export const compareMetrics = {
  revenue: { name: 'Выручка', curr: 3131021, prev: 2784320, reverse: false },
  profit: { name: 'Чистая прибыль', curr: 136755, prev: 148960, reverse: false },
  margin: { name: 'Маржа', curr: 4.3, prev: 6.4, reverse: false, isPct: true },
  orders: { name: 'Заказы', curr: 1240, prev: 1180, reverse: false, isCount: true },
  aov: { name: 'Средний чек', curr: 2525, prev: 2359, reverse: false },
  expenses: { name: 'Все расходы', curr: 2994266, prev: 2635360, reverse: true },
  commission: { name: 'Комиссия МП', curr: 876685, prev: 751766, reverse: true },
  logistics: { name: 'Логистика', curr: 1252408, prev: 1058041, reverse: true },
  ads: { name: 'Реклама', curr: 767098, prev: 696080, reverse: true },
  returns: { name: 'Возвраты', curr: 98075, prev: 129473, reverse: true },
};

export const expenseCategories = [
  { id: 'commission', name: 'Комиссия', curr: 876685, currPct: 29, prev: 751766, prevPct: 28 },
  { id: 'logistics', name: 'Логистика', curr: 1252408, currPct: 42, prev: 1058041, prevPct: 40 },
  { id: 'ads', name: 'Реклама', curr: 767098, currPct: 26, prev: 696080, prevPct: 26 },
  { id: 'storage', name: 'Хранение', curr: 45000, currPct: 1.5, prev: 35000, prevPct: 1.3 },
  { id: 'fines', name: 'Штрафы', curr: 35000, currPct: 1.2, prev: 70000, prevPct: 2.7 },
  { id: 'returns', name: 'Возвраты', curr: 18000, currPct: 0.3, prev: 24473, prevPct: 2 },
];

export const skuData = [
  { id: '1', sku: 'TSH-01', name: 'Футболка базовая оверсайз', rev: 450000, profit: 85000, prevProfit: 52000, margin: 18.8 },
  { id: '2', sku: 'JNS-02', name: 'Джинсы Wide Leg', rev: 820000, profit: -12500, prevProfit: 45000, margin: -1.5 },
  { id: '3', sku: 'SHT-03', name: 'Шорты льняные', rev: 210000, profit: 42000, prevProfit: 48000, margin: 20.0 },
  { id: '4', sku: 'JKT-04', name: 'Куртка демисезонная', rev: 1100000, profit: 115000, prevProfit: 80000, margin: 10.4 },
];

const generateChartData = (days: number) => Array.from({ length: days }, (_, i) => ({
  date: `День ${i + 1}`,
  curr: 100000 + Math.sin(i / 2) * 20000 + Math.random() * 10000,
  prev: 90000 + Math.sin(i / 2) * 15000 + Math.random() * 8000,
}));

export const revChartData = generateChartData(30);
export const profitChartData = generateChartData(30).map(d => ({...d, curr: d.curr * 0.1, prev: d.prev * 0.12}));

export const basicMetrics = [
  { title: "Выручка", value: "3 131 021 ₽", trend: "+12.4%", isPositive: true, icon: RussianRuble },
  { title: "Чистая прибыль", value: "136 755 ₽", trend: "-8.2%", isPositive: false, icon: Activity },
  { title: "Текущая маржа", value: "4.3%", trend: "-2.1%", isPositive: false, icon: Percent },
  { title: "Заказов", value: "1 240", trend: "+5.1%", isPositive: true, icon: ShoppingCart },
];
