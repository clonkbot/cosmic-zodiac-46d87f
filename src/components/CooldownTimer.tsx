import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface CooldownTimerProps {
  lastFortuneTime: number;
  cooldownDuration?: number; // in milliseconds, default 24 hours
}

export function CooldownTimer({
  lastFortuneTime,
  cooldownDuration = 24 * 60 * 60 * 1000,
}: CooldownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const nextFortuneTime = lastFortuneTime * 1000 + cooldownDuration;
      const remaining = Math.max(0, nextFortuneTime - now);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastFortuneTime, cooldownDuration]);

  const isReady = timeRemaining === 0;
  const progress = isReady
    ? 100
    : ((cooldownDuration - timeRemaining) / cooldownDuration) * 100;

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (isReady) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2 text-emerald-400"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Clock className="w-4 h-4 md:w-5 md:h-5" />
        </motion.div>
        <span className="font-medium text-sm md:text-base">Fortune Ready!</span>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="rgba(255, 215, 0, 0.1)"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="url(#cooldownGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          <defs>
            <linearGradient id="cooldownGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ff7b00" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-500/50" />
        </div>
      </div>

      <div className="text-center">
        <div className="text-amber-200/60 text-xs uppercase tracking-wider mb-1">
          Next Fortune
        </div>
        <div className="font-mono text-amber-100 text-base md:text-lg font-medium">
          {formatTime()}
        </div>
      </div>
    </div>
  );
}
