import styles from "@/styles/cards/Card.module.css";

interface CardProps {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  title,
  description,
  footer,
  children,
  actions,
  className = "",
  onClick,
}: CardProps) {
  return (
    <article
      className={`${styles.card} ${className}`.trim()}
      onClick={onClick}
      role={onClick ? "button" : "article"}
    >
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        {actions && <div className={styles.cardActions}>{actions}</div>}
      </div>

      {description && (
        <p className={styles.cardDescription}>{description}</p>
      )}

      {children && <div className={styles.cardContent}>{children}</div>}

      {footer && <div className={styles.cardFooter}>{footer}</div>}
    </article>
  );
}
