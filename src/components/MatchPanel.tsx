import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, Sparkles, X } from "lucide-react";
import { getElementColor } from "../lib/contract";

interface MatchResult {
  partnerAddress: string;
  compatibilityScore: number;
  matchType: string;
  timestamp: number;
}

interface MatchPanelProps {
  onMatch: (address: string) => Promise<void>;
  isMatching: boolean;
  matchHistory: MatchResult[];
  userElement: string;
  hasProfile: boolean;
}

export function MatchPanel({
  onMatch,
  isMatching,
  matchHistory,
  userElement,
  hasProfile,
}: MatchPanelProps) {
  const [partnerAddress, setPartnerAddress] = useState("");
  const [showResult, setShowResult] = useState<MatchResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerAddress || !hasProfile) return;

    await onMatch(partnerAddress);
    setPartnerAddress("");
  };

  const colors = getElementColor(userElement);
  const latestMatch = matchHistory[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-xl rounded-3xl border border-amber-500/20 overflow-hidden"
    >
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
          </div>
          <div>
            <h3 className="font-display text-lg md:text-xl text-amber-100">Cosmic Match</h3>
            <p className="text-amber-200/50 text-xs md:text-sm">Find your celestial partner</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50" />
            <input
              type="text"
              value={partnerAddress}
              onChange={(e) => setPartnerAddress(e.target.value)}
              placeholder="Enter wallet address (0x...)"
              disabled={!hasProfile}
              className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-800/50 border border-amber-500/20 rounded-xl text-amber-100 placeholder:text-amber-200/30 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isMatching || !partnerAddress || !hasProfile}
            whileHover={{ scale: hasProfile ? 1.02 : 1 }}
            whileTap={{ scale: hasProfile ? 0.98 : 1 }}
            className="w-full py-3 md:py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25 text-sm md:text-base"
          >
            {isMatching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Match Now
              </>
            )}
          </motion.button>

          {!hasProfile && (
            <p className="text-amber-400/70 text-xs md:text-sm text-center">
              Create your profile first to match with others
            </p>
          )}
        </form>
      </div>

      {/* Match History */}
      {matchHistory.length > 0 && (
        <div className="border-t border-amber-500/10 p-5 md:p-6">
          <h4 className="text-amber-200/60 text-xs uppercase tracking-wider mb-3 md:mb-4">
            Recent Matches
          </h4>
          <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-64 overflow-y-auto">
            {matchHistory.map((match, index) => (
              <motion.div
                key={match.timestamp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setShowResult(match)}
                className="bg-slate-800/40 rounded-xl p-3 md:p-4 cursor-pointer hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-amber-100 text-xs md:text-sm truncate">
                      {match.partnerAddress.slice(0, 10)}...{match.partnerAddress.slice(-6)}
                    </p>
                    <p className="text-amber-200/50 text-[10px] md:text-xs mt-1">{match.matchType}</p>
                  </div>
                  <div
                    className="text-lg md:text-xl font-bold ml-3"
                    style={{
                      color:
                        match.compatibilityScore >= 75
                          ? "#22c55e"
                          : match.compatibilityScore >= 50
                            ? "#fbbf24"
                            : "#ef4444",
                    }}
                  >
                    {match.compatibilityScore}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Match Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-6 md:p-8 max-w-sm w-full border border-amber-500/20 relative"
            >
              <button
                onClick={() => setShowResult(null)}
                className="absolute top-4 right-4 text-amber-200/50 hover:text-amber-200"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
                  }}
                >
                  <Heart className="w-10 h-10 text-pink-400" />
                </motion.div>

                <h3 className="font-display text-2xl text-amber-100 mb-2">Match Result</h3>
                <p className="font-mono text-amber-200/60 text-sm mb-6 break-all">
                  {showResult.partnerAddress}
                </p>

                <div
                  className="text-6xl font-bold mb-4"
                  style={{
                    color:
                      showResult.compatibilityScore >= 75
                        ? "#22c55e"
                        : showResult.compatibilityScore >= 50
                          ? "#fbbf24"
                          : "#ef4444",
                  }}
                >
                  {showResult.compatibilityScore}%
                </div>

                <p className="text-amber-200/80 text-lg">{showResult.matchType}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
