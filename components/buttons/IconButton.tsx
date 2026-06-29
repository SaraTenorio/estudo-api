import type { ReactNode } from "react";
import styles from "@/styles/buttons/IconButton.module.css";

type IconButtonVariant = "primary" | "secondary" | "danger";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  ariaLabel: string;
}

export function IconButton({
  children,
  variant = "secondary",
  size = "md",
  isLoading = false,
  disabled = false,
  ariaLabel,
  ...props
}: IconButtonProps) {
  const variantClass = styles[`iconButton-${variant}`];
  const sizeClass = styles[`iconButton-${size}`];

  return (
    <button
      className={`${styles.iconButton} ${variantClass} ${sizeClass}`}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      title={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
