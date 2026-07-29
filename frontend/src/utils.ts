export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const formatCurrency = (val: number) => new Intl.NumberFormat('ru-RU').format(Math.round(val)) + ' ₽';
export const formatPct = (val: number) => (val > 0 ? '+' : '') + val.toFixed(1).replace('.', ',') + '%';
export const formatPP = (val: number) => (val > 0 ? '+' : '') + val.toFixed(1).replace('.', ',') + ' п.п.';
