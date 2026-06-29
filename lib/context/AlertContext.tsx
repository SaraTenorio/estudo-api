import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertMessage {
  id: string;
  variant: AlertVariant;
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
}

interface AlertContextType {
  alerts: AlertMessage[];
  addAlert: (
    message: string,
    variant?: AlertVariant,
    options?: {
      title?: string;
      duration?: number;
      closable?: boolean;
    }
  ) => string;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const addAlert = useCallback(
    (
      message: string,
      variant: AlertVariant = "info",
      options?: {
        title?: string;
        duration?: number;
        closable?: boolean;
      }
    ): string => {
      const id = `alert-${Date.now()}-${Math.random()}`;
      const duration = options?.duration ?? 3000;

      const newAlert: AlertMessage = {
        id,
        variant,
        title: options?.title,
        message,
        duration,
        closable: options?.closable ?? false,
      };

      setAlerts((prev) => [...prev, newAlert]);

      if (duration > 0) {
        setTimeout(() => {
          removeAlert(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAlerts }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
}
