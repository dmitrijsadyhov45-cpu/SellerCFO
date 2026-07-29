import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, ShieldCheck, FileText, CheckCircle, 
  Copy, X, ArrowUpRight, ArrowDownRight, RussianRuble, 
  Activity, ShoppingCart, Percent, Home, Search, 
  Bell, Settings, Loader2, ChevronDown, Package,
  TrendingUp, TrendingDown, Minus, ChevronLeft, Calendar, SlidersHorizontal, ArrowLeftRight
} from 'lucide-react';

// --- Утилиты ---
const cn = (...classes) => classes.filter(Boolean).join(' ');

const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(Math.round(val)) + ' ₽';
const formatPct = (val) => (val > 0 ? '+' : '') + val.toFixed(1).replace('.', ',') + '%';
const formatPP = (val) => (val > 0 ? '+' : '') + val.toFixed(1).replace('.', ',') + ' п.п.';

// --- КОМПОНЕНТЫ: СПЛЭШ-ЭКРАН ---
const SplashScreen = ({ onFinish }) => {
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

const DockIconButton = React.forwardRef(({ icon: Icon, label, onClick, isActive, className }, ref) => {
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

const Dock = React.forwardRef(({ items, activeTab, onTabChange, className }, ref) => {
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
        {items.map((item) => (
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

// --- КОМПОНЕНТ: МОДАЛЬНОЕ ОКНО ПРЕТЕНЗИИ ---
const ClaimModal = ({ isOpen, onClose, amount, sku }) => {
  const [copied, setCopied] = useState(false);

  const claimText = `В Службу поддержки ООО "Вайлдберриз"\nОт ИП Иванова И.И. (ИНН 1234567890)\n\nДОСУДЕБНАЯ ПРЕТЕНЗИЯ\n\nМною был обнаружен факт некорректного удержания денежных средств за услуги логистики по артикулу ${sku}.\nРанее штраф за несоответствие габаритов по данному артикулу был успешно оспорен и сторнирован. Однако, система продолжила тарифицировать логистику по ошибочному коэффициенту (х25).\n\nОбщая сумма излишне удержанных средств за период составляет: ${amount} руб.\n\nТребую произвести перерасчет стоимости логистики согласно базовым тарифам оферты и вернуть незаконно удержанные денежные средства на мой расчетный счет в течение 10 календарных дней.\n\nВ случае отказа или игнорирования претензии, буду вынужден обратиться в суд с взысканием суммы долга, пеней, а также расходов на юридические услуги.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(claimText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-2 text-lime-400">
            <FileText className="w-5 h-5" />
            <h3 className="font-medium">Шаблон претензии</h3>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-xs text-zinc-400 mb-3">
            Скопируйте текст ниже и отправьте в поддержку WB (Категория: "Финансы и взаиморасчеты"). Данные подставлены автоматически.
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-sm text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
            {claimText}
          </div>
        </div>
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <button 
            onClick={handleCopy}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
              copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "bg-lime-400 text-zinc-950 hover:bg-lime-300"
            )}
          >
            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? "Скопировано в буфер" : "Скопировать текст"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- КОМПОНЕНТ: ИНТЕРАКТИВНЫЙ SVG ГРАФИК СРАВНЕНИЯ ---
const CompareChart = ({ data, type = 'revenue' }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const maxVal = Math.max(...data.map(d => Math.max(d.curr, d.prev)));
  const minVal = Math.min(...data.map(d => Math.min(d.curr, d.prev, 0)));
  const range = maxVal - minVal || 1;
  const len = data.length - 1 || 1;

  const getPt = (val, idx) => {
    const x = (idx / len) * 100;
    const y = 40 - ((val - minVal) / range) * 35; 
    return { x, y };
  };

  let currPathD = `M ${getPt(data[0].curr, 0).x},${getPt(data[0].curr, 0).y}`;
  let prevPathD = `M ${getPt(data[0].prev, 0).x},${getPt(data[0].prev, 0).y}`;
  
  for (let i = 1; i <= len; i++) {
    const ptC = getPt(data[i].curr, i);
    const ptP = getPt(data[i].prev, i);
    currPathD += ` L ${ptC.x},${ptC.y}`;
    prevPathD += ` L ${ptP.x},${ptP.y}`;
  }

  return (
    <div className="relative w-full h-40 mt-4 select-none" onMouseLeave={() => setActiveIndex(null)}>
      <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
        {[0,1,2,3].map(i => <div key={i} className="w-full h-px bg-zinc-800/50" />)}
      </div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full absolute inset-0 z-10 overflow-visible">
        <path d={prevPathD} fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        <path d={currPathD} fill="none" stroke="#a3e635" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_4px_rgba(163,230,53,0.5)]" />
        {data.map((_, i) => (
          <rect 
            key={i} x={`${(i / len) * 100 - (50/len)}%`} y="0" width={`${100/len}%`} height="100%" fill="transparent"
            className="cursor-crosshair" onTouchStart={() => setActiveIndex(i)} onMouseEnter={() => setActiveIndex(i)}
          />
        ))}
      </svg>
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="absolute inset-y-0 z-20 pointer-events-none" style={{ left: `${(activeIndex / len) * 100}%` }}
          >
            <div className="absolute inset-y-0 -ml-px w-px bg-zinc-700/80" />
            <div className="absolute w-2 h-2 rounded-full border-2 border-zinc-950 bg-zinc-500 -ml-1" style={{ top: `${getPt(data[activeIndex].prev, activeIndex).y / 40 * 100}%` }} />
            <div className="absolute w-2.5 h-2.5 rounded-full border-2 border-zinc-950 bg-lime-400 -ml-[5px] shadow-[0_0_8px_rgba(163,230,53,0.8)]" style={{ top: `${getPt(data[activeIndex].curr, activeIndex).y / 40 * 100}%` }} />
            
            <div className={cn("absolute top-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 shadow-2xl w-36", activeIndex > len / 2 ? "right-3" : "left-3")}>
              <div className="text-[10px] text-zinc-500 mb-1.5 uppercase font-medium">{data[activeIndex].date}</div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-1.5 text-xs text-zinc-100"><div className="w-1.5 h-1.5 rounded-full bg-lime-400"/>Текущий</span>
                <span className="text-xs font-semibold text-zinc-100">{formatCurrency(data[activeIndex].curr)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400"><div className="w-1.5 h-1.5 rounded-full bg-zinc-500"/>Прошлый</span>
                <span className="text-xs font-medium text-zinc-400">{formatCurrency(data[activeIndex].prev)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-1.5 flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Разница</span>
                <span className={cn("text-[10px] font-bold", data[activeIndex].curr >= data[activeIndex].prev ? "text-lime-400" : "text-rose-400")}>
                  {data[activeIndex].curr >= data[activeIndex].prev ? '+' : ''}{formatCurrency(data[activeIndex].curr - data[activeIndex].prev)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- СЛОЙ ДАННЫХ (MOCKS) ---
const compareMetrics = {
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

const generateChartData = (days) => Array.from({ length: days }, (_, i) => ({
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


// --- ВКЛАДКА: ОБЗОР И СРАВНЕНИЕ (DASHBOARD & COMPARE) ---
const OverviewTab = () => {
  const [viewMode, setViewMode] = useState('normal'); // 'normal' | 'compare'
  const [period, setPeriod] = useState('30d');
  const [expenseView, setExpenseView] = useState('percent'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [skuSearch, setSkuSearch] = useState('');

  // Helpers
  const calcTrend = (curr, prev, isPctType = false) => {
    if (isPctType) return curr - prev;
    return prev === 0 ? 0 : ((curr - prev) / prev) * 100;
  };

  const getTrendStyle = (diff, reverse = false) => {
    if (Math.abs(diff) < 0.1) return { color: 'text-zinc-400', bg: 'bg-zinc-800', icon: Minus };
    const isPositive = diff > 0;
    const isGood = reverse ? !isPositive : isPositive;
    return isGood 
      ? { color: 'text-lime-400', bg: 'bg-lime-400/10 border-lime-400/20', icon: TrendingUp }
      : { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', icon: TrendingDown };
  };

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === 'compare') {
      setViewMode('compare');
    } else {
      setPeriod(newPeriod);
      setViewMode('normal');
    }
  };

  if (viewMode === 'compare') {
    return (
      <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* COMPARE HEADER */}
        <div className="space-y-4">
          <button onClick={() => setViewMode('normal')} className="flex items-center gap-1.5 text-lime-400 text-sm font-medium hover:text-lime-300 transition-colors w-fit bg-lime-400/10 px-3 py-1.5 rounded-lg border border-lime-400/20">
            <ChevronLeft className="w-4 h-4" /> Назад к обзору
          </button>
          
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">Сравнение</h2>
            <p className="text-zinc-500 text-sm mt-1">Финансовые показатели за разные периоды</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsPeriodSelectorOpen(true)} className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-3 rounded-xl flex flex-col items-center justify-center transition-colors">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Текущий период</span>
              <span className="text-sm font-bold text-zinc-100">01.07 — 30.07</span>
            </button>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-black text-zinc-500 z-10 -mx-4 shadow-xl">VS</div>
            <button onClick={() => setIsPeriodSelectorOpen(true)} className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-3 rounded-xl flex flex-col items-center justify-center transition-colors">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Предыдущий</span>
              <span className="text-sm font-bold text-zinc-400">01.06 — 30.06</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 w-fit">
            {[ { id: '7d', label: '7D' }, { id: '30d', label: '30D' }, { id: '90d', label: '90D' } ].map(p => (
              <button key={p.id} className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold transition-all", p.id === '30d' ? "bg-zinc-800 text-lime-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* KEY CHANGES */}
        <div>
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-lime-400 rounded-full" /> Ключевые изменения
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[ { key: 'revenue', data: compareMetrics.revenue }, { key: 'profit', data: compareMetrics.profit }, { key: 'margin', data: compareMetrics.margin }, { key: 'orders', data: compareMetrics.orders } ].map((item) => {
              const diff = calcTrend(item.data.curr, item.data.prev, item.data.isPct);
              const style = getTrendStyle(diff, item.data.reverse);
              return (
                <div key={item.key} className="bg-zinc-900/50 border border-zinc-800 p-2.5 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-zinc-500 font-medium mb-1 truncate w-full">{item.data.name}</span>
                  <span className={cn("text-xs font-bold", style.color)}>{item.data.isPct ? formatPP(diff) : formatPct(diff)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 10 METRICS CARDS */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(compareMetrics).map(([key, m]) => {
            const diffAbs = m.curr - m.prev;
            const diffPct = calcTrend(m.curr, m.prev, m.isPct);
            const style = getTrendStyle(diffPct, m.reverse);
            const Icon = style.icon;
            return (
              <div key={key} className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">{m.name}</div>
                <div className="flex flex-col gap-0.5 mb-3">
                  <div className="text-zinc-100 font-semibold text-lg md:text-xl">{m.isPct ? `${m.curr}%` : m.isCount ? m.curr : formatCurrency(m.curr)}</div>
                  <div className="text-zinc-500 text-xs font-medium">{m.isPct ? `${m.prev}%` : m.isCount ? m.prev : formatCurrency(m.prev)}</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className={cn("flex items-center w-fit px-1.5 py-0.5 rounded text-[10px] font-bold border", style.bg, style.color)}>
                    <Icon className="w-3 h-3 mr-1" strokeWidth={3} />
                    {m.isPct ? formatPP(diffPct) : formatPct(diffPct)}
                  </div>
                  {!m.isPct && <div className={cn("text-[10px] font-medium pl-1", style.color)}>{diffAbs > 0 ? '+' : ''}{m.isCount ? diffAbs : formatCurrency(diffAbs)}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-zinc-100 font-medium">Динамика выручки</h3>
              <div className="flex gap-3 text-[10px] font-medium">
                <span className="flex items-center gap-1 text-zinc-100"><div className="w-2 h-2 rounded-full bg-lime-400"/> Текущий</span>
                <span className="flex items-center gap-1 text-zinc-500"><div className="w-2 h-2 rounded-full border border-zinc-500"/> Прошлый</span>
              </div>
            </div>
            <CompareChart data={revChartData} type="revenue" />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
            <h3 className="text-zinc-100 font-medium">Динамика прибыли</h3>
            <CompareChart data={profitChartData} type="profit" />
          </div>
        </div>

        {/* EXPENSE STRUCTURE */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-5 rounded-2xl">
          <h3 className="text-zinc-100 font-medium mb-6">Структура расходов</h3>
          <div className="space-y-5">
            {expenseCategories.map(cat => {
              const diffAbs = cat.curr - cat.prev;
              const diffPct = calcTrend(cat.curr, cat.prev);
              const style = getTrendStyle(diffPct, true); 
              return (
                <div key={cat.id} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="text-zinc-100 text-sm font-medium mb-0.5">{cat.name}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-300">{formatCurrency(cat.curr)} <span className="text-zinc-600">({cat.currPct}%)</span></span>
                        <span className="text-zinc-600">vs</span>
                        <span className="text-zinc-500">{formatCurrency(cat.prev)} <span className="text-zinc-700">({cat.prevPct}%)</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-xs font-bold", style.color)}>{diffAbs > 0 ? '+' : ''}{formatCurrency(diffAbs)}</div>
                      <div className={cn("text-[10px] font-medium", style.color)}>{formatPct(diffPct)}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-400 rounded-full shadow-[0_0_8px_rgba(163,230,53,0.3)]" style={{ width: `${Math.min(cat.currPct * 2, 100)}%` }} />
                    </div>
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${Math.min(cat.prevPct * 2, 100)}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MARGIN */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-zinc-100 font-medium mb-4">Маржинальность</h3>
            <div className="flex items-end gap-3 mb-1">
              <span className="text-3xl font-bold text-zinc-100">{compareMetrics.margin.curr}%</span>
              <span className="text-sm font-medium text-zinc-500 line-through pb-1">{compareMetrics.margin.prev}%</span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center">
            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-1">Изменение</div>
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg text-rose-400 font-bold text-sm">
              <TrendingDown className="w-4 h-4" strokeWidth={3} />
              {formatPP(calcTrend(compareMetrics.margin.curr, compareMetrics.margin.prev, true))}
            </div>
          </div>
        </div>

        {/* SKU CHANGES */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-zinc-100 font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-lime-400" /> Изменения по товарам
            </h3>
            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg hover:text-zinc-200 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Фильтры
            </button>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Поиск по артикулу или названию..." value={skuSearch} onChange={(e) => setSkuSearch(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700" />
          </div>
          <div className="space-y-3">
            {skuData.filter(item => item.name.toLowerCase().includes(skuSearch.toLowerCase()) || item.sku.toLowerCase().includes(skuSearch.toLowerCase())).map(item => {
              const diffAbs = item.profit - item.prevProfit;
              const diffPct = calcTrend(item.profit, item.prevProfit);
              const style = getTrendStyle(diffPct);
              return (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[10px] text-zinc-500 font-mono mb-0.5">{item.sku}</div>
                      <div className="text-sm font-medium text-zinc-200 line-clamp-1">{item.name}</div>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-bold bg-zinc-950 px-2 py-1 rounded-lg border", style.color, style.bg)}>
                      {diffAbs > 0 ? '+' : ''}{formatCurrency(diffAbs)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-zinc-950/50 p-2.5 rounded-lg">
                    <div>
                      <div className="text-[10px] text-zinc-500 mb-0.5">Выручка</div>
                      <div className="text-xs font-medium text-zinc-300">{formatCurrency(item.rev)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 mb-0.5">Прибыль</div>
                      <div className={cn("text-xs font-bold", item.profit < 0 ? "text-rose-400" : "text-zinc-300")}>{formatCurrency(item.profit)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 mb-0.5">Динамика</div>
                      <div className={cn("text-xs font-bold", style.color)}>{formatPct(diffPct)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODALS FOR COMPARE (Filters & Periods) */}
        <AnimatePresence>
          {isFilterOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-md bg-zinc-900 border-t border-x sm:border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl pb-safe">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 sm:hidden" />
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-zinc-100">Фильтры сравнения</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X className="w-4 h-4"/></button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">Маркетплейс</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="bg-lime-400/10 text-lime-400 border border-lime-400/30 py-2 rounded-xl text-sm font-medium">Все</button>
                      <button className="bg-zinc-950 text-zinc-400 border border-zinc-800 py-2 rounded-xl text-sm font-medium hover:text-zinc-200">Wildberries</button>
                      <button className="bg-zinc-950 text-zinc-400 border border-zinc-800 py-2 rounded-xl text-sm font-medium hover:text-zinc-200">Ozon</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">Динамика SKU</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-lime-400/10 text-lime-400 border border-lime-400/30 py-2 rounded-xl text-sm font-medium">Все товары</button>
                      <button className="bg-zinc-950 text-zinc-400 border border-zinc-800 py-2 rounded-xl text-sm font-medium flex justify-center items-center gap-1 hover:text-zinc-200"><TrendingUp className="w-3.5 h-3.5"/> С ростом</button>
                      <button className="bg-zinc-950 text-zinc-400 border border-zinc-800 py-2 rounded-xl text-sm font-medium flex justify-center items-center gap-1 hover:text-zinc-200"><TrendingDown className="w-3.5 h-3.5"/> С падением</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsFilterOpen(false)} className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold py-3.5 rounded-xl mt-8 transition-colors">Применить фильтры</button>
              </motion.div>
            </div>
          )}
          {isPeriodSelectorOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPeriodSelectorOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-md bg-zinc-900 border-t border-x sm:border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl pb-safe flex flex-col max-h-[80vh]">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 sm:hidden shrink-0" />
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2"><Calendar className="w-5 h-5 text-lime-400"/> Выбор периода</h3>
                  <button onClick={() => setIsPeriodSelectorOpen(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X className="w-4 h-4"/></button>
                </div>
                <div className="overflow-y-auto space-y-1.5 -mx-2 px-2 flex-1 pb-4">
                  {[ { label: 'Сегодня', sub: 'vs Вчера' }, { label: 'Последние 7 дней', sub: 'vs Предыдущие 7 дней' }, { label: 'Последние 30 дней', sub: 'vs Предыдущие 30 дней', active: true }, { label: 'Последние 90 дней', sub: 'vs Предыдущие 90 дней' }, { label: 'Этот месяц', sub: 'vs Прошлый месяц' }, { label: 'Этот год', sub: 'vs Прошлый год' }, { label: 'Пользовательский период...', sub: 'Выбрать даты вручную' } ].map((p, idx) => (
                    <button key={idx} onClick={() => setIsPeriodSelectorOpen(false)} className={cn("w-full text-left px-4 py-3.5 rounded-xl border transition-colors flex justify-between items-center", p.active ? "bg-lime-400/10 border-lime-400/30" : "bg-zinc-950 border-zinc-800/50 hover:bg-zinc-800")}>
                      <div className="flex flex-col"><span className={cn("text-sm font-semibold", p.active ? "text-lime-400" : "text-zinc-100")}>{p.label}</span><span className="text-xs text-zinc-500 mt-0.5">{p.sub}</span></div>
                      {p.active && <CheckCircle className="w-5 h-5 text-lime-400" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // NORMAL MODE (EXISTING OVERVIEW)
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Greeting & Horizontal Switcher */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Финансы</h2>
          <p className="text-zinc-500 text-sm mt-0.5">Обзор за {period === '7d' ? '7 дней' : period === '30d' ? '30 дней' : '90 дней'}</p>
        </div>
        
        {/* Horizontal Period Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { id: '7d', label: '7 дней' },
            { id: '30d', label: '30 дней' },
            { id: '90d', label: '90 дней' },
            { id: 'compare', label: 'Сравнить' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => handlePeriodChange(p.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border",
                period === p.id 
                  ? "bg-lime-400/10 text-lime-400 border-lime-400/30 shadow-[0_0_10px_rgba(163,230,53,0.15)]" 
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800"
              )}
            >
              {p.id === 'compare' ? <span className="flex items-center gap-1.5"><ArrowLeftRight className="w-3.5 h-3.5"/> {p.label}</span> : p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {basicMetrics.map((m, i) => (
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Структура доходов */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-center">
          <h3 className="text-zinc-100 font-medium mb-5">Структура доходов</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-zinc-400">Органические продажи</span><span className="text-zinc-100 font-medium">65%</span></div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden"><div className="h-full bg-lime-400 rounded-full shadow-[0_0_8px_rgba(163,230,53,0.3)]" style={{ width: '65%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-zinc-400">Рекламные продажи (Трафареты)</span><span className="text-zinc-100 font-medium">25%</span></div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{ width: '25%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-zinc-400">Компенсации площадки</span><span className="text-zinc-100 font-medium">10%</span></div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden"><div className="h-full bg-zinc-600 rounded-full" style={{ width: '10%' }}></div></div>
            </div>
          </div>
        </div>

        {/* Donut Chart (Структура удержаний) */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-100 font-medium">Структура расходов</h3>
            <div className="flex bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
              <button onClick={() => setExpenseView('currency')} className={cn("px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors", expenseView === 'currency' ? "bg-zinc-800 text-lime-400" : "text-zinc-500 hover:text-zinc-300")}>₽</button>
              <button onClick={() => setExpenseView('percent')} className={cn("px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors", expenseView === 'percent' ? "bg-zinc-800 text-lime-400" : "text-zinc-500 hover:text-zinc-300")}>%</button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full drop-shadow-[0_0_8px_rgba(163,230,53,0.3)]">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#27272a" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a3e635" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="100.48" className="transition-all duration-1000" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ecfccb" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="200.96" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] text-zinc-500 mb-0.5">Логистика</span>
                <span className="text-sm font-bold text-zinc-100">{expenseView === 'percent' ? '40%' : '560к ₽'}</span>
              </div>
            </div>
            <div className="space-y-3 flex-1 ml-6">
              <div className="flex justify-between text-sm"><div className="flex items-center gap-2 text-zinc-400"><div className="w-2 h-2 rounded-full bg-lime-400"/>Логистика</div><span className="text-zinc-100">{expenseView === 'percent' ? '40%' : '560 400 ₽'}</span></div>
              <div className="flex justify-between text-sm"><div className="flex items-center gap-2 text-zinc-400"><div className="w-2 h-2 rounded-full bg-lime-100"/>Комиссия</div><span className="text-zinc-100">{expenseView === 'percent' ? '30%' : '420 300 ₽'}</span></div>
              <div className="flex justify-between text-sm"><div className="flex items-center gap-2 text-zinc-400"><div className="w-2 h-2 rounded-full bg-zinc-700"/>Штрафы</div><span className="text-zinc-100">{expenseView === 'percent' ? '30%' : '420 300 ₽'}</span></div>
            </div>
          </div>
        </div>

        {/* Динамика прибыли (Smooth / Dots внизу) */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col md:col-span-2">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-zinc-100 font-semibold text-lg tracking-wide">Динамика прибыли</h3>
            <button className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800 transition shadow-sm">
              Эта неделя <ChevronDown className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
          <div className="relative w-full h-44 flex flex-col">
             <div className="flex-1 relative w-full mb-4">
                <div className="absolute inset-0 flex justify-between z-0">{[0, 1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="h-full w-px bg-white/5" />))}</div>
                <div className="absolute inset-0 z-0">
                  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                     <defs><linearGradient id="glowAreaBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a3e635" stopOpacity="0.4" /><stop offset="100%" stopColor="#a3e635" stopOpacity="0" /></linearGradient></defs>
                     <path d="M 0,32 C 8.33,32 8.33,20 16.66,20 C 25,20 25,26 33.33,26 C 41.66,26 41.66,12 50,12 C 58.33,12 58.33,24 66.66,24 C 75,24 75,10 83.33,10 C 91.66,10 91.66,4 100,4 L 100,40 L 0,40 Z" fill="url(#glowAreaBlue)" />
                     <path d="M 0,32 C 8.33,32 8.33,20 16.66,20 C 25,20 25,26 33.33,26 C 41.66,26 41.66,12 50,12 C 58.33,12 58.33,24 66.66,24 C 75,24 75,10 83.33,10 C 91.66,10 91.66,4 100,4" fill="none" stroke="#a3e635" strokeWidth="1.5" className="drop-shadow-[0_0_5px_rgba(163,230,53,0.8)]" />
                  </svg>
                </div>
                <div className="absolute inset-0 z-10">
                  {[{ x: 0, y: 32 }, { x: 16.66, y: 20 }, { x: 33.33, y: 26 }, { x: 50, y: 12 }, { x: 66.66, y: 24 }, { x: 83.33, y: 10 }, { x: 100, y: 4 }].map((pt, i) => (
                    <div key={i} className="absolute w-2.5 h-2.5 bg-zinc-900 border-[2px] border-lime-400 rounded-full shadow-[0_0_8px_rgba(163,230,53,0.9)] transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${pt.x}%`, top: `${(pt.y / 40) * 100}%` }} />
                  ))}
                </div>
             </div>
             <div className="flex justify-between w-full text-[12px] text-zinc-500 font-medium relative z-20">
               {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (<div key={day} className="flex justify-center w-0 overflow-visible"><span className="w-8 text-center">{day}</span></div>))}
             </div>
          </div>
        </div>

        {/* Радар рекламной нагрузки (ДРР / TACoS) */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col md:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-zinc-100 font-medium">Радар рекламной нагрузки</h3>
              <p className="text-zinc-500 text-xs mt-1">Доля рекламных расходов (TACoS)</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-2xl font-bold text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">24,5%</span>
              <div className="flex items-center gap-1 text-rose-400 text-[10px] md:text-xs font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +4,5 п.п. к прошлому периоду
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div className="relative">
              <div className="w-full h-3 rounded-full bg-gradient-to-r from-lime-400 via-amber-400 to-rose-500 overflow-hidden shadow-inner" />
              <div className="absolute -top-1.5 -bottom-1.5 w-1.5 bg-zinc-100 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] border border-zinc-900 z-10" style={{ left: '70%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-medium px-1"><span>0%</span><span>10%</span><span>20% (Лимит)</span><span>35%+</span></div>
          </div>
        </div>

        {/* Cash Flow Block */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-100 font-medium">Прогноз Cash Flow</h3>
              <p className="text-zinc-500 text-xs mt-1">Горизонт: 30 дней</p>
            </div>
            <span className="bg-rose-500/10 text-rose-400 text-xs px-2 py-1 rounded-md font-medium border border-rose-500/20 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Риск разрыва</span>
          </div>
          <div className="flex flex-col gap-5 mt-1">
            <div className="grid grid-cols-2 gap-4">
               <div><span className="text-zinc-400 text-xs">Доступно сейчас</span><div className="text-zinc-100 font-semibold mt-0.5">145 000 ₽</div></div>
               <div><span className="text-zinc-400 text-xs">Заморожено (Холд WB)</span><div className="text-zinc-100 font-semibold mt-0.5">850 000 ₽</div></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span className="text-zinc-400">Плановые выплаты (Закупки, Налоги)</span><span className="text-rose-400 font-medium">-420 000 ₽</span></div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden flex">
                <div className="h-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.3)]" style={{ width: '35%' }}></div>
                <div className="h-full bg-rose-500" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-zinc-500 pt-1">Прогнозируемый дефицит ликвидности <span className="text-rose-400 font-medium">275 000 ₽</span> на 15 число.</p>
            </div>
          </div>
        </div>

        {/* Оборотный капитал */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-zinc-100 font-medium">Оборотный капитал</h3>
              <p className="text-zinc-500 text-xs mt-1">Заморожено в стоке (FBO + FBS)</p>
            </div>
            <div className="text-right"><span className="text-xl font-bold text-zinc-100">1 200 000 ₽</span></div>
          </div>
          <div className="space-y-4">
            <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden flex border border-zinc-800">
              <div className="h-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.3)]" style={{ width: '55%' }}></div>
              <div className="h-full bg-amber-400" style={{ width: '15%' }}></div>
              <div className="h-full bg-zinc-700" style={{ width: '30%' }}></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div><div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-lime-400" /><span className="text-zinc-400 text-[10px] md:text-xs">Ликвидный</span></div><div className="text-zinc-100 text-xs md:text-sm font-medium">660 000 ₽</div></div>
              <div><div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-zinc-400 text-[10px] md:text-xs">Средний</span></div><div className="text-zinc-100 text-xs md:text-sm font-medium">180 000 ₽</div></div>
              <div><div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-zinc-700" /><span className="text-zinc-400 text-[10px] md:text-xs">Неликвид</span></div><div className="text-zinc-100 text-xs md:text-sm font-medium">360 000 ₽</div></div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Premium Banner */}
      <div className="bg-gradient-to-br from-lime-500/20 to-zinc-900 border border-lime-500/30 p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-lime-400/20 blur-2xl rounded-full" />
        <h3 className="text-lime-400 font-semibold mb-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Seller CFO Premium</h3>
        <p className="text-zinc-300 text-sm mb-4 max-w-[80%]">Защитите свою прибыль от скрытых удержаний и кассовых разрывов.</p>
        <div className="flex items-end gap-2 mb-4"><span className="text-3xl font-bold text-white">4 990 ₽</span><span className="text-zinc-400 text-sm pb-1">/ мес</span></div>
        <button className="bg-lime-400 text-zinc-950 font-medium py-2 px-6 rounded-xl text-sm hover:bg-lime-300 transition">Оформить подписку</button>
      </div>
    </div>
  );
};


// --- ВКЛАДКА: СКАНЕР АНОМАЛИЙ (ALERTS) ---
const AlertsTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="mb-6"><h2 className="text-2xl font-bold text-zinc-100">Сканер утечек</h2><p className="text-zinc-500 text-sm">Найдены критические аномалии за 30 дней</p></div>
        
        <div className="bg-zinc-900 border border-rose-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2"><div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><AlertTriangle className="w-5 h-5" /></div><h3 className="font-semibold text-zinc-100">Непересчитанная логистика WB</h3></div>
            <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-1 rounded-md font-medium border border-rose-500/20">Критично</span>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-zinc-400">Штраф по артикулу <span className="text-zinc-200 bg-zinc-800 px-1 rounded">11223344</span> был отменен, но платформа продолжает удерживать логистику по тарифу <span className="text-rose-400">х25</span>.</p>
            <div className="flex justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800"><span className="text-zinc-400 text-sm">Сумма переплаты:</span><span className="text-rose-400 font-bold">42 500 ₽</span></div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-3 rounded-xl text-sm font-medium transition-colors border border-zinc-700">Сгенерировать претензию</button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><ShieldCheck className="w-5 h-5" /></div><h3 className="font-semibold text-zinc-100">Авто-услуги Ozon</h3></div>
            <span className="text-zinc-500 text-xs">Сегодня</span>
          </div>
          <p className="text-sm text-zinc-400 mb-3">Обнаружено автоматическое списание за услугу «Страхование остатков» (0.0035% в день).</p>
          <div className="flex justify-between items-center"><span className="text-zinc-300 font-medium">Потеряно: 1 240 ₽</span><button className="text-lime-400 text-sm font-medium hover:underline">Инструкция по отключению</button></div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && <ClaimModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} amount="42 500" sku="11223344" />}
      </AnimatePresence>
    </>
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
                  {activeTab === 'alerts' && <AlertsTab />}
                  {(activeTab === 'search' || activeTab === 'settings') && (
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

            {/* Bottom Dock Navigation */}
            <Dock items={dockItems} activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}