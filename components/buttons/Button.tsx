import type { ReactNode } from "react";
import styles from "@/styles/buttons/Button.module.css";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "secondary",
  isLoading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const variantClass = styles[`button-${variant}`];

  return (
    <button
      className={`${styles.button} ${variantClass}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
}
