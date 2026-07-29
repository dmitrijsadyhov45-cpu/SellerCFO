import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
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
