"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      dir="rtl"
      position="bottom-left"
      className="toaster group"
      richColors
      closeButton
      expand={false}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-brand-primary shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-brand-primary animate-spin shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group font-[family-name:var(--font-montserrat-arabic)] text-right border rounded-[22px] shadow-2xl p-4 gap-3.5 backdrop-blur-2xl transition-all duration-300 bg-surface/95 dark:bg-[#151525]/95 border-border/60 text-text-primary select-none",
          title: "font-black text-sm text-text-primary leading-tight",
          description: "text-xs font-semibold text-text-secondary leading-relaxed mt-1",
          actionButton:
            "bg-brand-primary hover:bg-brand-primary/90 text-white font-black rounded-xl px-3.5 py-2 text-xs shadow-md shadow-brand-primary/20 transition-all active:scale-95",
          cancelButton:
            "bg-surface border border-border/50 text-text-secondary hover:text-text-primary font-bold rounded-xl px-3.5 py-2 text-xs transition-colors",
          closeButton:
            "!left-2.5 !right-auto !top-2.5 !bg-surface/80 hover:!bg-surface !border-border/50 !text-text-secondary hover:!text-text-primary !rounded-xl !transition-all !p-1.5",
          success:
            "!border-emerald-500/30 !bg-gradient-to-r !from-emerald-500/5 !to-transparent shadow-emerald-500/5",
          error:
            "!border-brand-primary/30 !bg-gradient-to-r !from-brand-primary/5 !to-transparent shadow-brand-primary/5",
          warning:
            "!border-amber-500/30 !bg-gradient-to-r !from-amber-500/5 !to-transparent shadow-amber-500/5",
          info:
            "!border-sky-500/30 !bg-gradient-to-r !from-sky-500/5 !to-transparent shadow-sky-500/5",
        },
      }}
      {...props}
    />
  );
}

/**
 * Custom Toast Helpers with Clean Arabic Presets
 */
export const notify = {
  success: (title: string, description?: string) => {
    return toast.success(title, {
      description,
    });
  },

  error: (title: string, description?: string) => {
    return toast.error(title, {
      description,
    });
  },

  info: (title: string, description?: string) => {
    return toast.info(title, {
      description,
    });
  },

  warning: (title: string, description?: string) => {
    return toast.warning(title, {
      description,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    data: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, data);
  },
};

export { toast };
