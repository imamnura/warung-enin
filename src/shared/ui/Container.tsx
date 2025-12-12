export function Container({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <div
      className={`mx-auto max-w-6xl px-4 sm:px-6 ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
