"use client";
import clsx from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  full?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  full,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-all hover:scale-[1.02] active:scale-[0.98]";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }[size];

  const styles = {
    primary: "bg-foreground text-background hover:opacity-90",
    secondary: "bg-secondary text-accent hover:opacity-90",
    ghost:
      "bg-transparent border border-foreground/15 text-foreground hover:bg-foreground/5",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }[variant];

  return (
    <button
      className={clsx(base, sizes, styles, full && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}
