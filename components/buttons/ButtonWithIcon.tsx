import type { ReactNode } from "react";
import styles from "@/styles/buttons/ButtonWithIcon.module.css";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonWithIconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  children: ReactNode;
  variant?: ButtonVariant;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export function ButtonWithIcon({
  icon,
  children,
  variant = "secondary",
  iconPosition = "left",
  isLoading = false,
  disabled = false,
  ...props
}: ButtonWithIconProps) {
  const variantClass = styles[`buttonWithIcon-${variant}`];
  const positionClass = styles[`iconPosition-${iconPosition}`];

  return (
    <button
      className={`${styles.buttonWithIcon} ${variantClass} ${positionClass}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>{children}</span>
    </button>
  );
}
