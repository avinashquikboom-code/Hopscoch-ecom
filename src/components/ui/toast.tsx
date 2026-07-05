"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// A listener system to allow triggering toasts from outside the React component tree (e.g. API clients)
type ToastListener = (toast: Omit<Toast, "id">) => string;
type DismissListener = (id: string) => void;

let globalAddToast: ToastListener | null = null;
let globalRemoveToast: DismissListener | null = null;
const recentToasts = new Set<string>();

export const toast = {
  success: (message: string, options?: Omit<Toast, "id" | "type" | "message">) => {
    if (globalAddToast) return globalAddToast({ type: "success", message, ...options });
    console.warn("ToastProvider not mounted");
    return "";
  },
  error: (message: string, options?: Omit<Toast, "id" | "type" | "message">) => {
    if (globalAddToast) return globalAddToast({ type: "error", message, ...options });
    console.warn("ToastProvider not mounted");
    return "";
  },
  warning: (message: string, options?: Omit<Toast, "id" | "type" | "message">) => {
    if (globalAddToast) return globalAddToast({ type: "warning", message, ...options });
    console.warn("ToastProvider not mounted");
    return "";
  },
  info: (message: string, options?: Omit<Toast, "id" | "type" | "message">) => {
    if (globalAddToast) return globalAddToast({ type: "info", message, ...options });
    console.warn("ToastProvider not mounted");
    return "";
  },
  loading: (message: string, options?: Omit<Toast, "id" | "type" | "message">) => {
    if (globalAddToast) return globalAddToast({ type: "loading", message, ...options });
    console.warn("ToastProvider not mounted");
    return "";
  },
  dismiss: (id: string) => {
    if (globalRemoveToast) globalRemoveToast(id);
  }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toastData: Omit<Toast, "id">) => {
    // Prevent duplicate alerts in quick succession
    const toastKey = `${toastData.type}:${toastData.message}`;
    if (recentToasts.has(toastKey)) {
      return "";
    }
    recentToasts.add(toastKey);
    setTimeout(() => recentToasts.delete(toastKey), 1500);

    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts(prev => {
      const newToastList = [...prev, { id, ...toastData }];
      if (newToastList.length > 3) {
        return newToastList.slice(newToastList.length - 3); // Max 3 toasts at a time
      }
      return newToastList;
    });

    return id;
  }, []);

  useEffect(() => {
    globalAddToast = addToast;
    globalRemoveToast = removeToast;
    return () => {
      globalAddToast = null;
      globalRemoveToast = null;
    };
  }, [addToast, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      className="fixed z-[100] pointer-events-none flex flex-col gap-3 w-full max-w-sm px-4 py-6 top-0 right-0 md:top-4 md:right-4 left-0 mx-auto md:left-auto md:mx-0 items-center md:items-end"
    >
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const defaultDurations = {
    success: 3000,
    info: 3000,
    warning: 4000,
    error: 5000,
    loading: 0
  };

  const duration = t.duration !== undefined ? t.duration : defaultDurations[t.type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(t.id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss, t.id]);

  const config = {
    success: {
      bg: "bg-[#f0fdfa]/95 dark:bg-[#022c2a]/95",
      border: "border-[#14b8a6]/25 dark:border-[#14b8a6]/40",
      titleText: "text-[#0f766e] dark:text-[#2dd4bf]",
      msgText: "text-[#115e59] dark:text-[#99f6e4]/80",
      icon: <CheckCircle className="h-5 w-5 text-[#14b8a6] shrink-0" />,
      title: t.title || "Success",
      progressBg: "bg-[#14b8a6]"
    },
    error: {
      bg: "bg-rose-50/95 dark:bg-rose-950/20",
      border: "border-rose-500/20 dark:border-rose-500/40",
      titleText: "text-rose-800 dark:text-rose-200",
      msgText: "text-rose-600/90 dark:text-rose-300/80",
      icon: <XCircle className="h-5 w-5 text-rose-500 shrink-0" />,
      title: t.title || "Error",
      progressBg: "bg-rose-500"
    },
    warning: {
      bg: "bg-amber-50/95 dark:bg-amber-950/20",
      border: "border-amber-500/20 dark:border-amber-500/40",
      titleText: "text-amber-800 dark:text-amber-200",
      msgText: "text-amber-600/90 dark:text-amber-300/80",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
      title: t.title || "Warning",
      progressBg: "bg-amber-500"
    },
    info: {
      bg: "bg-sky-50/95 dark:bg-sky-950/20",
      border: "border-sky-500/20 dark:border-sky-500/40",
      titleText: "text-sky-800 dark:text-sky-200",
      msgText: "text-sky-600/90 dark:text-sky-300/80",
      icon: <Info className="h-5 w-5 text-sky-500 shrink-0" />,
      title: t.title || "Information",
      progressBg: "bg-sky-500"
    },
    loading: {
      bg: "bg-muted/95 dark:bg-muted/30",
      border: "border-border/30 dark:border-border/50",
      titleText: "text-foreground",
      msgText: "text-muted-foreground",
      icon: <Loader2 className="h-5 w-5 text-[#14b8a6] animate-spin shrink-0" />,
      title: t.title || "Please Wait...",
      progressBg: "bg-[#14b8a6]"
    }
  }[t.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className={`pointer-events-auto relative w-full max-w-sm rounded-2xl border ${config.border} ${config.bg} p-4 shadow-xl backdrop-blur-md overflow-hidden flex flex-col gap-2`}
    >
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1 space-y-0.5 min-w-0">
          <p className={`text-sm font-bold tracking-tight ${config.titleText}`}>{config.title}</p>
          <p className={`text-xs ${config.msgText} leading-relaxed`}>{t.message}</p>
        </div>
        <button
          onClick={() => onDismiss(t.id)}
          aria-label="Dismiss toast"
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-lg hover:bg-muted/50 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {t.action && (
        <div className="flex justify-end gap-2 pl-8">
          <button
            onClick={() => {
              t.action?.onClick();
              onDismiss(t.id);
            }}
            className="text-[11px] font-bold text-[#14b8a6] hover:text-[#0f766e] transition-colors bg-[#14b8a6]/10 px-2.5 py-1 rounded-lg cursor-pointer"
          >
            {t.action.label}
          </button>
        </div>
      )}

      {duration > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-muted-foreground/10">
          <div
            className={`h-full ${config.progressBg}`}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
