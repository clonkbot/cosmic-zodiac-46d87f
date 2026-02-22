import { useConnect, useAccount, useDisconnect } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, LogOut, ChevronDown, Check, X } from "lucide-react";
import { useState } from "react";

export function WalletConnect() {
  const { connectors, connect, isPending, error } = useConnect();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setShowDropdown(!showDropdown)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-300"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs md:text-sm">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
          <ChevronDown className="w-4 h-4 text-emerald-400/70" />
        </motion.button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 md:w-64 bg-slate-900/95 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4 border-b border-amber-500/10">
                <p className="text-amber-200/50 text-xs uppercase tracking-wider mb-1">
                  Connected to
                </p>
                <p className="font-mono text-amber-100 text-sm truncate">{address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-xs">{chain?.name || "Base"}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full p-3 flex items-center gap-3 text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={isPending}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold text-slate-900 shadow-lg shadow-amber-500/25 disabled:opacity-50 text-sm md:text-base"
      >
        <Wallet className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden md:inline">{isPending ? "Connecting..." : "Connect Wallet"}</span>
        <span className="md:hidden">{isPending ? "..." : "Connect"}</span>
      </motion.button>

      <AnimatePresence>
        {showConnectors && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 md:w-72 bg-slate-900/95 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-amber-500/10 flex items-center justify-between">
              <p className="text-amber-100 font-medium">Connect Wallet</p>
              <button
                onClick={() => setShowConnectors(false)}
                className="text-amber-200/50 hover:text-amber-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              {connectors.map((connector) => (
                <motion.button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setShowConnectors(false);
                  }}
                  whileHover={{ x: 4 }}
                  className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-amber-500/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-amber-100 font-medium text-sm">{connector.name}</p>
                    <p className="text-amber-200/50 text-xs">Click to connect</p>
                  </div>
                </motion.button>
              ))}
            </div>
            {error && (
              <div className="p-3 bg-rose-500/10 border-t border-rose-500/20">
                <p className="text-rose-400 text-xs">{error.message}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
