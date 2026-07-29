# Seller CFO — Marketplace Data Sources

## Стратегия

Первый marketplace:

Wildberries.

Второй:

Ozon.

Нельзя строить финансовую модель на предположении, что одинаковые поля WB и Ozon означают одно и то же.

Каждый marketplace имеет собственный accounting model.

---

# WILDBERRIES

## Основные группы данных

1. Sales Reports
2. Financial Reports
3. Retentions
4. Payout / Balance
5. Logistics
6. Penalties
7. Advertising
8. Products
9. Stocks

---

# WB Financial Engine

Минимально необходимые данные:

- gross sales;
- returns;
- commission;
- logistics;
- storage;
- penalties;
- other deductions;
- compensation;
- payout.

---

# WB Reconciliation

Основная задача:

Сравнить:

Sales Report
+
Financial Reports
+
Retentions
+
Balance / Payout

и найти расхождения.

---

# WB Hidden Deduction Scanner

Первый приоритет:

1. Identify penalty.
2. Check reversal / cancellation.
3. Check subsequent logistics charges.
4. Compare logistics before / after.
5. Detect abnormal tariff.
6. Calculate variance.
7. Create alert.

Нельзя автоматически утверждать:

"WB украл деньги."

Правильная формулировка:

"Обнаружено потенциальное несоответствие начислений."

---

# WB API Constraints

API rate limits должны храниться в отдельном configuration layer.

Нельзя хардкодить лимиты без проверки актуальной официальной документации.

При изменении API:

API Adapter обновляется отдельно от Financial Engine.

---

# OZON

Ozon подключается после стабилизации WB.

Основные группы:

- transactions;
- cash flow;
- payouts;
- commissions;
- logistics;
- advertising;
- returns;
- services;
- other charges.

---

# Ozon Financial Engine

Не копировать WB-модель.

Создать отдельный adapter:

OzonAdapter

Он преобразует данные Ozon в:

NormalizedTransaction

---

# Unified Transaction Model

После нормализации:

MarketplaceTransaction

Fields:

id
marketplace
external_id
date
type
amount
currency
sku
order_id
source
raw_data

---

# Marketplace Adapter Architecture

interface MarketplaceAdapter {

connect()

getAccounts()

getSales()

getTransactions()

getPayouts()

getFees()

getLogistics()

getReturns()

getAdvertising()

}

---

# Critical Rule

Financial Engine не должен знать:

WB API
или
Ozon API.

Он работает только с:

Normalized Financial Data.

---

# Source of Truth

Каждый показатель должен иметь:

source_type:

API
REPORT
USER_INPUT
CALCULATED
ESTIMATED

---

# API Verification Rule

Перед реализацией каждого endpoint:

1. Проверить официальную документацию.
2. Проверить актуальность endpoint.
3. Проверить дату обновления.
4. Проверить rate limit.
5. Проверить pagination.
6. Проверить data availability.
7. Проверить формат денежных значений.
8. Создать integration test.

---

# MVP API Strategy

Не подключать все API сразу.

Этап 1:

WB Financial Data.

Этап 2:

WB Advertising.

Этап 3:

WB Inventory.

Этап 4:

Ozon Financial Data.

Этап 5:

Ozon Advertising / Inventory.