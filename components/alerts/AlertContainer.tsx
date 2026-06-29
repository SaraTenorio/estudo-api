import { useAlert } from "@/lib/context";
import { Alert } from "@/components/alerts";
import styles from "@/styles/alerts/AlertContainer.module.css";

export function AlertContainer() {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className={styles.container}>
      {alerts.map((alert) => (
        <div key={alert.id} className={styles.alertWrapper}>
          <Alert
            variant={alert.variant}
            title={alert.title}
            closable={alert.closable}
            onClose={() => removeAlert(alert.id)}
          >
            {alert.message}
          </Alert>
        </div>
      ))}
    </div>
  );
}
