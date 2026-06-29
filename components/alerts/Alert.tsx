import type { ReactNode } from "react";
import styles from "@/styles/alerts/Alert.module.css";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: ReactNode;
  onClose?: () => void;
  icon?: ReactNode;
  closable?: boolean;
}

function getDefaultIcon(variant: AlertVariant) {
  switch (variant) {
    case "success":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "error":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case "warning":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "info":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

export function Alert({
  children,
  variant = "info",
  title,
  onClose,
  icon,
  closable = false,
}: AlertProps) {
  const displayIcon = icon ?? getDefaultIcon(variant);

  return (
    <div
      className={`${styles.alert} ${styles[`alert-${variant}`]}`}
      role="alert"
    >
      <div className={styles.alertContent}>
        <div className={styles.alertIcon}>{displayIcon}</div>
        <div className={styles.alertBody}>
          {title && <div className={styles.alertTitle}>{title}</div>}
          <div className={styles.alertMessage}>{children}</div>
        </div>
        {closable && (
          <button
            className={styles.alertClose}
            onClick={onClose}
            aria-label="Fechar alerta"
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
