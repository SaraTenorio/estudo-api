import styles from "@/styles/badge/Badge.module.css";

interface BadgeProps {
  variant?: "active" | "inactive" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "info",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
