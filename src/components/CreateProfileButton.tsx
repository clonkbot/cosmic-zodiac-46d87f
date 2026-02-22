import { motion } from "framer-motion";
import { UserPlus, Sparkles, Flame, Droplets, Wind, Mountain } from "lucide-react";

interface CreateProfileButtonProps {
  onCreateProfile: () => Promise<void>;
  isLoading: boolean;
}

export function CreateProfileButton({ onCreateProfile, isLoading }: CreateProfileButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-6 md:p-8 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="inline-block mb-6"
      >
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-amber-400" />
          </div>
          {/* Orbiting elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Flame className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-orange-400" />
            <Droplets className="absolute top-1/2 -right-2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <Wind className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 text-purple-400" />
            <Mountain className="absolute top-1/2 -left-2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
          </motion.div>
        </div>
      </motion.div>

      <h2 className="font-display text-2xl md:text-3xl text-amber-100 mb-3 md:mb-4">
        Discover Your Element
      </h2>
      <p className="text-amber-200/60 mb-6 md:mb-8 max-w-sm mx-auto text-sm md:text-base">
        Create your cosmic profile to unlock your elemental destiny, daily fortunes, and celestial
        matches.
      </p>

      <div className="grid grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8 max-w-xs mx-auto">
        {[
          { icon: Flame, color: "#ff7b00", label: "Fire" },
          { icon: Droplets, color: "#00d4ff", label: "Water" },
          { icon: Wind, color: "#b388ff", label: "Air" },
          { icon: Mountain, color: "#4caf50", label: "Earth" },
        ].map(({ icon: Icon, color, label }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.1, y: -5 }}
            className="flex flex-col items-center gap-1 md:gap-2"
          >
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
            </div>
            <span className="text-amber-200/60 text-[10px] md:text-xs">{label}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={onCreateProfile}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold text-slate-900 flex items-center justify-center gap-2 md:gap-3 mx-auto shadow-lg shadow-amber-500/25 disabled:opacity-50 text-sm md:text-base"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            Create My Profile
          </>
        )}
      </motion.button>

      <p className="text-amber-200/40 text-xs mt-4">
        Requires Base network gas • No extra fees
      </p>
    </motion.div>
  );
}
