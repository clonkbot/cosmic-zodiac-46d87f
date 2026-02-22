import { motion } from "framer-motion";
import { Flame, Droplets, Wind, Mountain, Zap, Star, Heart, Sparkles } from "lucide-react";
import { getElementColor, getElementEmoji } from "../lib/contract";

interface ProfileCardProps {
  element: string;
  level: number;
  xp: number;
  energy: number;
  luckyNumber: number;
  winStreak: number;
  walletAddress: string;
}

function ElementIcon({ element, className, color }: { element: string; className?: string; color?: string }) {
  const style = color ? { color } : undefined;
  switch (element.toLowerCase()) {
    case "fire":
      return <Flame className={className} style={style} />;
    case "water":
      return <Droplets className={className} style={style} />;
    case "air":
      return <Wind className={className} style={style} />;
    case "earth":
      return <Mountain className={className} style={style} />;
    default:
      return <Sparkles className={className} style={style} />;
  }
}

export function ProfileCard({
  element,
  level,
  xp,
  energy,
  luckyNumber,
  winStreak,
  walletAddress,
}: ProfileCardProps) {
  const colors = getElementColor(element);
  const xpForNextLevel = level * 100;
  const xpProgress = (xp / xpForNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(15, 15, 35, 0.95), rgba(26, 10, 46, 0.95))`,
        boxShadow: `0 0 60px ${colors.glow}`,
      }}
    >
      {/* Glowing border effect */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}30, transparent 50%, ${colors.secondary}30)`,
          padding: "1px",
        }}
      />

      {/* Content */}
      <div className="relative p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <ElementIcon
                element={element}
                className="w-6 h-6 md:w-7 md:h-7"
                color={colors.primary}
              />
            </motion.div>
            <div>
              <h2 className="font-display text-xl md:text-2xl text-amber-100 flex items-center gap-2">
                {element} {getElementEmoji(element)}
              </h2>
              <p className="text-amber-200/50 text-xs md:text-sm font-mono truncate max-w-[120px] md:max-w-[180px]">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-2xl md:text-3xl font-display font-bold"
              style={{ color: colors.primary }}
            >
              Lv.{level}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs md:text-sm mb-2">
            <span className="text-amber-200/60">Experience</span>
            <span className="text-amber-200/80">
              {xp} / {xpForNextLevel} XP
            </span>
          </div>
          <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(xpProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <StatBox
            icon={<Zap className="w-4 h-4 md:w-5 md:h-5" />}
            label="Energy"
            value={energy}
            color={colors.primary}
          />
          <StatBox
            icon={<Star className="w-4 h-4 md:w-5 md:h-5" />}
            label="Lucky #"
            value={luckyNumber}
            color="#ffd700"
          />
          <StatBox
            icon={<Heart className="w-4 h-4 md:w-5 md:h-5" />}
            label="Win Streak"
            value={winStreak}
            color="#ff6b6b"
          />
        </div>
      </div>
    </motion.div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-800/40 rounded-xl p-3 md:p-4 text-center border border-amber-500/10"
    >
      <div className="flex justify-center mb-1 md:mb-2" style={{ color }}>
        {icon}
      </div>
      <div className="text-lg md:text-2xl font-bold text-amber-100">{value}</div>
      <div className="text-[10px] md:text-xs text-amber-200/50 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}
