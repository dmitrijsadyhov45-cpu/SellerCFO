import { Telegraf } from 'telegraf';

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || 'https://your-ngrok-url.ngrok.app';

if (!token) {
  console.warn('[Telegram Bot] No token provided, skipping bot initialization.');
} else {
  const bot = new Telegraf(token);

  bot.command('start', (ctx) => {
    ctx.reply('Привет! Я твой финансовый ассистент Seller CFO 📊\n\nНажми на кнопку ниже, чтобы открыть финансовый дашборд и проанализировать маржинальность.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 Открыть Seller CFO', web_app: { url: webAppUrl } }]
        ]
      }
    });
  });

  bot.launch().then(() => {
    console.log('[Telegram Bot] Started successfully');
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
