import { motion } from "framer-motion";
import { Sparkles, Sun, Moon, Star } from "lucide-react";
import { CooldownTimer } from "./CooldownTimer";

interface FortuneButtonProps {
  onGetFortune: () => Promise<void>;
  isLoading: boolean;
  canGetFortune: boolean;
  lastFortuneTime: number;
  hasProfile: boolean;
}

export function FortuneButton({
  onGetFortune,
  isLoading,
  canGetFortune,
  lastFortuneTime,
  hasProfile,
}: FortuneButtonProps) {
  const isDisabled = !hasProfile || !canGetFortune || isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-5 md:p-6"
    >
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Sun className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
        </div>
        <div>
          <h3 className="font-display text-lg md:text-xl text-amber-100">Daily Fortune</h3>
          <p className="text-amber-200/50 text-xs md:text-sm">Reveal your cosmic destiny</p>
        </div>
      </div>

      {/* Cooldown Timer */}
      {hasProfile && !canGetFortune && lastFortuneTime > 0 && (
        <div className="flex justify-center mb-4 md:mb-6">
          <CooldownTimer lastFortuneTime={lastFortuneTime} />
        </div>
      )}

      {/* Fortune Button */}
      <motion.button
        onClick={onGetFortune}
        disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        className={`
          relative w-full py-4 md:py-5 rounded-2xl font-semibold text-base md:text-lg
          flex items-center justify-center gap-3
          overflow-hidden transition-all duration-300
          ${
            isDisabled
              ? "bg-slate-800/50 text-amber-200/30 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-900 shadow-lg shadow-amber-500/30"
          }
        `}
        style={
          !isDisabled
            ? {
                backgroundSize: "200% 100%",
                animation: "shimmer 3s linear infinite",
              }
            : undefined
        }
      >
        {/* Animated stars background */}
        {!isDisabled && (
          <>
            <motion.div
              className="absolute top-2 left-4"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              <Star className="w-3 h-3 text-white/30" />
            </motion.div>
            <motion.div
              className="absolute bottom-2 right-6"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Moon className="w-3 h-3 text-white/30" />
            </motion.div>
            <motion.div
              className="absolute top-3 right-4"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Star className="w-2 h-2 text-white/30" />
            </motion.div>
          </>
        )}

        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        ) : (
          <>
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            <span>
              {!hasProfile
                ? "Create Profile First"
                : canGetFortune
                  ? "Reveal Today's Fortune"
                  : "Fortune on Cooldown"}
            </span>
          </>
        )}
      </motion.button>

      {!hasProfile && (
        <p className="text-amber-400/70 text-xs md:text-sm text-center mt-3 md:mt-4">
          You need to create a profile before getting your daily fortune
        </p>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.div>
  );
}
