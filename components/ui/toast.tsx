"use client";

import * as React from "react";
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: string;
  tone: ToastTone;
  title?: string;
  message: string;
}

interface ToastContextValue {
  push: (tone: ToastTone, message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const push = React.useCallback(
    (tone: ToastTone, message: string, title?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setItems((prev) => [...prev.slice(-3), { id, tone, title, message }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 4500);
    },
    [],
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({
      push,
      success: (message, title) => push("success", message, title),
      error: (message, title) => push("error", message, title),
      info: (message, title) => push("info", message, title),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notificări"
        className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2.5 sm:bottom-5 sm:left-auto sm:right-5 sm:w-[380px]"
      >
        {items.map((item) => {
          const isError = item.tone === "error";
          const isSuccess = item.tone === "success";
          const Icon = isError
            ? ExclamationTriangleIcon
            : isSuccess
              ? CheckCircleIcon
              : InformationCircleIcon;
          return (
            <div
              key={item.id}
              role={isError ? "alert" : "status"}
              className={`pointer-events-auto flex items-start gap-3 rounded-lg border-2 p-3.5 shadow-[0_12px_28px_rgba(24,32,43,0.18)] ${
                isError
                  ? "border-danger bg-[#fdf3f2] text-asphalt"
                  : isSuccess
                    ? "border-ok bg-[#eef6f1] text-asphalt"
                    : "border-asphalt bg-surface text-asphalt"
              }`}
            >
              <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  isError ? "text-danger" : isSuccess ? "text-ok" : "text-sign"
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1 text-xs leading-relaxed">
                {item.title ? <p className="font-semibold text-asphalt">{item.title}</p> : null}
                <p className="text-asphalt">{item.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Închide notificarea"
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-mute hover:bg-chalk hover:text-asphalt"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return {
      push: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
    };
  }
  return ctx;
}
