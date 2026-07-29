import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, ShieldCheck, FileText, CheckCircle, 
  Copy, X, ArrowUpRight, ArrowDownRight, RussianRuble, 
  Activity, ShoppingCart, Percent, Home, Search, 
  Bell, Settings, Loader2, ChevronDown, Package,
  TrendingUp, TrendingDown, Minus, ChevronLeft, Calendar, SlidersHorizontal, ArrowLeftRight
} from 'lucide-react';
import { getDashboardMetrics } from './api/client';

// --- Утилиты ---
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const formatCurrency = (val: number) => new Intl.NumberFormat('ru-RU').format(Math.round(val)) + ' ₽';
const formatPct = (val: number) => (val > 0 ? '+' : '') + val.toFixed(1).replace('.', ',') + '%';
const formatPP = (val: number) => (val > 0 ? '+' : '') + val.toFixed(1).replace('.', ',') + ' п.п.';

// --- КОМПОНЕНТЫ: СПЛЭШ-ЭКРАН ---
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [text, setText] = useState("");
  const fullText = "Seller CFO";
  const [status, setStatus] = useState("Инициализация алгоритмов...");

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 120);

    const statusTimer1 = setTimeout(() => setStatus("Подключение к API Wildberries..."), 1200);
    const statusTimer2 = setTimeout(() => setStatus("Анализ скрытых списаний..."), 2200);
    const finishTimer = setTimeout(() => onFinish(), 3200);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950"
    >
      <div className="flex flex-col items-center">
        <div className="text-4xl md:text-5xl font-mono font-bold text-lime-400 tracking-wider mb-8 drop-shadow-[0_0_12px_rgba(163,230,53,0.4)] flex items-center h-16">
          {text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="ml-1 inline-block w-4 h-8 md:h-10 bg-lime-400"
          />
        </div>
        <div className="text-zinc-500 font-mono text-xs md:text-sm h-6 flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-lime-400/70" />
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="tracking-wide"
          >
            {status}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

// --- КОМПОНЕНТЫ: ДОК-ПАНЕЛЬ (НИЖНЕЕ МЕНЮ) ---
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

const DockIconButton = React.forwardRef<HTMLButtonElement, any>(({ icon: Icon, label, onClick, isActive, className }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative group p-3 rounded-xl transition-all duration-300",
        isActive ? "bg-lime-400/10 text-lime-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
        className
      )}
    >
      <Icon className="w-6 h-6" />
      {isActive && (
        <motion.div 
          layoutId="activeTabIndicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-lime-400" 
        />
      )}
      <span className={cn(
        "absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs",
        "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xl",
        "opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
      )}>
        {label}
      </span>
    </motion.button>
  );
});
DockIconButton.displayName = "DockIconButton";

const Dock = React.forwardRef<HTMLDivElement, any>(({ items, activeTab, onTabChange, className }, ref) => {
  return (
    <div ref={ref} className={cn("fixed bottom-6 left-0 w-full flex items-center justify-center p-2 z-50 pointer-events-none", className)}>
      <motion.div
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        className={cn(
          "flex items-center gap-2 p-2 rounded-2xl pointer-events-auto",
          "backdrop-blur-xl border border-zinc-800 shadow-2xl",
          "bg-zinc-900/80"
        )}
      >
        {items.map((item: any) => (
          <DockIconButton 
            key={item.id} 
            icon={item.icon} 
            label={item.label} 
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)} 
          />
        ))}
      </motion.div>
    </div>
  );
});
Dock.displayName = "Dock";

// --- СЛОЙ ДАННЫХ (MOCKS) ---
const compareMetrics: Record<string, any> = {
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

const expenseCategories = [
  { id: 'commission', name: 'Комиссия', curr: 876685, currPct: 29, prev: 751766, prevPct: 28 },
  { id: 'logistics', name: 'Логистика', curr: 1252408, currPct: 42, prev: 1058041, prevPct: 40 },
  { id: 'ads', name: 'Реклама', curr: 767098, currPct: 26, prev: 696080, prevPct: 26 },
  { id: 'storage', name: 'Хранение', curr: 45000, currPct: 1.5, prev: 35000, prevPct: 1.3 },
  { id: 'fines', name: 'Штрафы', curr: 35000, currPct: 1.2, prev: 70000, prevPct: 2.7 },
  { id: 'returns', name: 'Возвраты', curr: 18000, currPct: 0.3, prev: 24473, prevPct: 2 },
];

const skuData = [
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
const revChartData = generateChartData(30);
const profitChartData = generateChartData(30).map(d => ({...d, curr: d.curr * 0.1, prev: d.prev * 0.12}));

const basicMetrics = [
  { title: "Выручка", value: "3 131 021 ₽", trend: "+12.4%", isPositive: true, icon: RussianRuble },
  { title: "Чистая прибыль", value: "136 755 ₽", trend: "-8.2%", isPositive: false, icon: Activity },
  { title: "Текущая маржа", value: "4.3%", trend: "-2.1%", isPositive: false, icon: Percent },
  { title: "Заказов", value: "1 240", trend: "+5.1%", isPositive: true, icon: ShoppingCart },
];

// --- ВКЛАДКА: ОБЗОР И СРАВНЕНИЕ ---
const OverviewTab = () => {
  const [period, setPeriod] = useState('30d');
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    getDashboardMetrics().then(data => setMetrics(data.metrics)).catch(console.error);
  }, []);

  const displayMetrics = metrics ? [
    { title: "Выручка", value: formatCurrency(metrics.revenue.curr), trend: formatPct((metrics.revenue.curr - metrics.revenue.prev) / metrics.revenue.prev * 100), isPositive: metrics.revenue.curr >= metrics.revenue.prev, icon: RussianRuble },
    { title: "Чистая прибыль", value: formatCurrency(metrics.profit.curr), trend: formatPct((metrics.profit.curr - metrics.profit.prev) / Math.abs(metrics.profit.prev) * 100), isPositive: metrics.profit.curr >= metrics.profit.prev, icon: Activity },
    { title: "Текущая маржа", value: metrics.margin.curr.toFixed(1) + "%", trend: formatPP(metrics.margin.curr - metrics.margin.prev), isPositive: metrics.margin.curr >= metrics.margin.prev, icon: Percent },
    { title: "Заказов", value: "1 240", trend: "+5.1%", isPositive: true, icon: ShoppingCart }, // mocked
  ] : basicMetrics;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Финансы</h2>
          <p className="text-zinc-500 text-sm mt-0.5">Обзор за {period === '7d' ? '7 дней' : period === '30d' ? '30 дней' : '90 дней'}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {displayMetrics.map((m, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><m.icon className="w-24 h-24 text-lime-400" /></div>
            <p className="text-zinc-400 text-xs md:text-sm mb-1">{m.title}</p>
            <h3 className="text-lg md:text-2xl font-semibold text-zinc-100 mb-2">{m.value}</h3>
            <div className={cn("flex items-center gap-1 text-xs font-medium w-fit px-2 py-1 rounded-md", m.isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
              {m.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {m.trend}
            </div>
          </div>
        ))}
      </div>
      
      {/* Premium Banner */}
      <div className="bg-gradient-to-br from-lime-500/20 to-zinc-900 border border-lime-500/30 p-5 rounded-2xl relative overflow-hidden mt-6">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-lime-400/20 blur-2xl rounded-full" />
        <h3 className="text-lime-400 font-semibold mb-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Seller CFO Premium</h3>
        <p className="text-zinc-300 text-sm mb-4 max-w-[80%]">Защитите свою прибыль от скрытых удержаний и кассовых разрывов.</p>
        <div className="flex items-end gap-2 mb-4"><span className="text-3xl font-bold text-white">4 990 ₽</span><span className="text-zinc-400 text-sm pb-1">/ мес</span></div>
        <button className="bg-lime-400 text-zinc-950 font-medium py-2 px-6 rounded-xl text-sm hover:bg-lime-300 transition">Оформить подписку</button>
      </div>
    </div>
  );
};

// --- APP ENTRY ---
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAppLoading, setIsAppLoading] = useState(true);

  const dockItems = [
    { id: 'overview', icon: Home, label: 'Обзор' },
    { id: 'alerts', icon: AlertTriangle, label: 'Утечки' },
    { id: 'search', icon: Search, label: 'Анализ' },
    { id: 'settings', icon: Settings, label: 'Настройки' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-lime-400/30">
      <AnimatePresence mode="wait">
        {isAppLoading ? (
          <SplashScreen key="splash" onFinish={() => setIsAppLoading(false)} />
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-md mx-auto p-4 pt-8 pb-32 min-h-screen relative"
          >
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <span className="text-lime-400 font-mono font-bold text-xl tracking-tight">Seller CFO</span>
                <span className="text-zinc-500 text-xs">Zero-click analytics</span>
              </div>
              <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-zinc-900"></span>
              </button>
            </header>

            {/* Content Area */}
            <main>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'overview' && <OverviewTab />}
                  {(activeTab === 'alerts' || activeTab === 'search' || activeTab === 'settings') && (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                      <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
                        {activeTab === 'search' ? <Search className="w-8 h-8" /> : <Settings className="w-8 h-8" />}
                      </div>
                      <p>Раздел в разработке (MVP)</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            <Dock items={dockItems} activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
