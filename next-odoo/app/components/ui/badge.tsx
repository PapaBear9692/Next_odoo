import { cn } from "@/app/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200":
            variant === "default",
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200":
            variant === "primary",
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200":
            variant === "success",
          "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200":
            variant === "warning",
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200":
            variant === "danger",
          "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200":
            variant === "info",
        },
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
