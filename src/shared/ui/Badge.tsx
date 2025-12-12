import clsx from "classnames";

type BadgeProps = {
  children: React.ReactNode;
  variant?:
    | "spicy"
    | "best"
    | "new"
    | "primary"
    | "warning"
    | "destructive"
    | "success"
    | "danger";
  color?:
    | "spicy"
    | "best"
    | "new"
    | "primary"
    | "warning"
    | "destructive"
    | "success"
    | "danger";
  className?: string;
};

export function Badge({
  children,
  variant,
  color = "new",
  className,
}: BadgeProps) {
  const activeColor = variant || color;
  const map = {
    spicy: "bg-red-100 text-red-700",
    best: "bg-yellow-100 text-yellow-700",
    new: "bg-green-100 text-green-700",
    primary: "bg-primary-100 text-primary-700",
    warning: "bg-yellow-100 text-yellow-700",
    destructive: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={clsx(
        "inline-block rounded px-2 py-1 text-xs font-medium",
        map[activeColor],
        className
      )}
    >
      {children}
    </span>
  );
}
