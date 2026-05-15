import { cn } from "@/app/lib/utils";
import type { ReactNode } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  icon?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function isValidImageSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("data:")) {
    const base64Part = src.split(",")[1];
    return !!base64Part && base64Part.length > 20 && base64Part !== "false";
  }
  return true;
}

export function Avatar({
  src,
  alt,
  fallback,
  icon,
  size = "md",
  className,
}: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const bgColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  const colorIndex = fallback
    ? fallback.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      bgColors.length
    : 0;

  if (isValidImageSrc(src || "")) {
    return (
      <img
        src={src}
        alt={alt || fallback}
        className={cn(
          "inline-block rounded-full object-cover ring-2 ring-white dark:ring-zinc-800",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium text-white ring-2 ring-white dark:ring-zinc-800",
        sizeClasses[size],
        icon ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400" : bgColors[colorIndex],
        className
      )}
      title={alt || fallback}
    >
      {icon || initials}
    </div>
  );
}
