import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Star, Sparkles, Heart, Zap, X } from "lucide-react";

export type ToastType = "success" | "error" | "levelUp" | "fortune" | "match" | "energy";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface EventToastProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  error: {
    icon: XCircle,
    bgColor: "from-rose-500/20 to-red-500/20",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
  },
  levelUp: {
    icon: Star,
    bgColor: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  fortune: {
    icon: Sparkles,
    bgColor: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  match: {
    icon: Heart,
    bgColor: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-400",
  },
  energy: {
    icon: Zap,
    bgColor: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
};

export function EventToast({ toasts, onDismiss }: EventToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full px-4 md:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`
                bg-gradient-to-r ${config.bgColor}
                backdrop-blur-xl border ${config.borderColor}
                rounded-2xl p-4 shadow-2xl
              `}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={
                    toast.type === "levelUp" ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-amber-100 text-sm">{toast.title}</p>
                  <p className="text-amber-200/70 text-xs mt-0.5">{toast.message}</p>
                </div>
                <button
                  onClick={() => onDismiss(toast.id)}
                  className="text-amber-200/50 hover:text-amber-200 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
