# Seller CFO — Data Model

## 1. Основные сущности

User
SellerAccount
Marketplace
Product
SKU
Order
Sale
Return
Transaction
Commission
Logistics
Storage
Advertising
Penalty
Adjustment
Payout
Inventory
Expense
Tax
Alert

---

# 2. User

id
email
telegram_id
created_at
subscription_plan

---

# 3. SellerAccount

id
user_id
marketplace
marketplace_account_id
api_connection_status
last_sync_at

---

# 4. Product

id
seller_account_id
sku
name
brand
category

---

# 5. SKU

id
product_id
sku
purchase_cost
selling_price
tax_rate
minimum_margin_target

---

# 6. Transaction

id
seller_account_id
marketplace
transaction_date
transaction_type
amount
currency
source
external_id

Все транзакции должны иметь external_id для предотвращения дублирования.

---

# 7. Financial Transaction Types

SALE
RETURN
COMMISSION
LOGISTICS
STORAGE
ADVERTISING
PENALTY
ADJUSTMENT
COMPENSATION
PAYOUT
OTHER

---

# 8. Data Provenance

Каждая финансовая запись должна хранить:

source
source_report
source_api
source_external_id
imported_at

Это необходимо для объяснения пользователю:

"Откуда взялась эта цифра?"

---

# 9. Data Status

Каждая запись:

RAW
NORMALIZED
VALIDATED
RECONCILED

---

# 10. Reconciliation

Система должна сравнивать:

Expected Amount
vs
Actual Amount

Разница:

Variance
=
Actual Amount
-
Expected Amount

Если:

abs(Variance) > Threshold

создаётся потенциальная аномалия.

---

# 11. Alert

Alert:

id
type
severity
confidence
amount
currency
detected_at
period
sku
description
evidence
recommended_action
status

Статусы:

NEW
VIEWED
CONFIRMED
DISMISSED
RESOLVED

---

# 12. Evidence

Каждый alert должен содержать:

- источник данных;
- период;
- SKU;
- транзакции;
- расчёт;
- формулу;
- сравниваемые значения.

Пример:

Expected Logistics:
1 700 ₽

Actual Logistics:
44 200 ₽

Variance:
42 500 ₽

Evidence:
Finance Report
Period:
01.07.2026–30.07.2026

---

# 13. API Sync

Каждый marketplace connector должен поддерживать:

connect()
authenticate()
sync()
normalize()
validate()
reconcile()

---

# 14. Idempotency

Повторная синхронизация не должна создавать дубликаты.

Использовать:

marketplace
+
external_transaction_id

как уникальный ключ.

---

# 15. Sync Status

IDLE
SYNCING
SUCCESS
PARTIAL_SUCCESS
ERROR

Пользователь должен видеть:

Последняя синхронизация:
Сегодня, 12:42

Данные актуальны:
Да

---

# 16. Missing Data

Если данных недостаточно:

НЕ рассчитывать показатель как точный.

Показывать:

"Недостаточно данных"

или:

"Оценка"

---

# 17. Financial Data Layers

RAW DATA
↓
NORMALIZATION
↓
RECONCILIATION
↓
FINANCIAL ENGINE
↓
ANOMALY ENGINE
↓
ALERT ENGINE
↓
USER INTERFACE