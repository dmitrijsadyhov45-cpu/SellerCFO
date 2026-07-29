import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/dashboard', (req, res) => {
  // TODO: Connect to PnlEngine and CashFlowEngine
  res.json({
    metrics: {
      revenue: { curr: 3131021, prev: 2784320 },
      profit: { curr: 136755, prev: 148960 },
      margin: { curr: 4.3, prev: 6.4 }
    }
  });
});

app.get('/api/anomalies', (req, res) => {
  res.json({
    anomalies: [
      { id: 1, message: "Обнаружено скрытое удержание 'antifraud' на сумму 50 000 ₽", severity: "high" }
    ]
  });
});

app.listen(port, () => {
  console.log(`[Backend API] Server is running on port ${port}`);
});

// Init Telegram Bot
import './bot/bot';
