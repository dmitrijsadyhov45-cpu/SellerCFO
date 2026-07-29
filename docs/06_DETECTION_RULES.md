# Seller CFO — Detection Engine

## Principle

Система не должна выдавать тревогу без объяснения.

Каждый alert:

Problem
+
Evidence
+
Calculation
+
Impact
+
Action

---

# RULE 001

## Abnormal Logistics

Condition:

Actual Logistics significantly exceeds historical baseline.

Baseline:

Median logistics cost for comparable SKU / order.

Trigger:

Actual > Baseline × configurable multiplier

---

# RULE 002

## Logistics After Penalty Reversal

Steps:

1. Find penalty.
2. Find reversal.
3. Find logistics transactions after reversal.
4. Compare with historical logistics.
5. Detect abnormal increase.

Output:

"Обнаружено потенциальное несоответствие начислений."

---

# RULE 003

## Commission Anomaly

Compare:

Current Commission %

vs

Historical Commission %

If deviation > threshold:

Create Alert.

---

# RULE 004

## Advertising Load Spike

TACoS:

Advertising Spend / Revenue

Compare:

Current TACoS
vs
Previous Period TACoS

If:

Delta > Threshold

Alert.

---

# RULE 005

## Return Spike

Return Rate:

Returns / Orders

Compare:

Current Period
vs
Previous Period

Alert if statistically significant increase.

---

# RULE 006

## Cash Gap

Calculate:

Projected Cash Balance

If:

Projected Cash Balance < Minimum Cash Buffer

Create:

Cash Gap Risk

---

# RULE 007

## Frozen Capital

Calculate:

Inventory Value

Segment:

Fast Moving
Normal
Slow Moving
Dead Stock

Alert:

"В товарных остатках заморожено X ₽."

---

# RULE 008

## Margin Collapse

If:

Current Margin < Target Margin

Alert.

Severity:

Info
Warning
Critical

---

# RULE 009

## SKU Loss

Calculate:

Revenue
- Marketplace Costs
- COGS
- Advertising
- Taxes

If:

Net Profit < 0

SKU = Loss Making

---

# RULE 010

## Money at Risk

Aggregate:

Confirmed Loss
+
Probable Loss
+
Suspicious Loss

Do NOT present as one guaranteed loss.

Display:

Confirmed:
X ₽

Probable:
Y ₽

Suspicious:
Z ₽

---

# ALERT PRIORITY

Critical

Potential confirmed financial discrepancy
High cash gap risk
Loss-making SKU

Warning

Abnormal logistics
Margin collapse
TACoS spike
Return spike

Info

Slow-moving inventory
Capital concentration
Minor variance

---

# EXPLANATION TEMPLATE

Что произошло:

[Description]

Почему это важно:

[Business impact]

Сумма:

[X ₽]

Как мы это нашли:

[Calculation]

Источник:

[Data source]

Уровень уверенности:

High / Medium / Low

Что делать:

[Recommended action]

---

# IMPORTANT

Не использовать:

"Вы потеряли 42 500 ₽"

если система не доказала потерю.

Использовать:

"Обнаружено потенциальное несоответствие на сумму 42 500 ₽."

---

# Evidence First

Каждый alert должен быть воспроизводим.

Пользователь должен иметь возможность открыть:

"Показать расчёт"

и увидеть исходные данные.