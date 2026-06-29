import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactElement } from "react";
import { storySurface } from "./Products/fixtures";

interface MaintenancePageProps {
  locale?: string;
}

function GearIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MaintenancePageComponent({
  locale = "en-US",
}: MaintenancePageProps): ReactElement {
  const isPortuguese = locale === "pt-PT";
  const labels = isPortuguese
    ? {
        backHome: "← Voltar a casa",
        heading: "Em Manutenção",
        message:
          "Estamos realizando manutenção. Por favor, verifique novamente em breve.",
      }
    : {
        backHome: "← Back to home",
        heading: "Under Maintenance",
        message:
          "We are currently performing maintenance. Please check back soon.",
      };

  const styles = {
    page: {
      "--background": "#0d1117",
      "--foreground": "#161b22",
      "--text-primary": "#e6edf3",
      "--text-secondary": "#8b949e",
      display: "flex",
      minHeight: "100vh",
      alignItems: "flex-start",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      backgroundColor: "var(--background)",
    } as React.CSSProperties,
    main: {
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      maxWidth: "860px",
      flexDirection: "column" as const,
      backgroundColor: "var(--foreground)",
      borderLeft: "1px solid #30363d",
      borderRight: "1px solid #30363d",
    } as React.CSSProperties,
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "60px 48px",
      borderBottom: "1px solid #30363d",
    } as React.CSSProperties,
    backLink: {
      fontSize: "14px",
      color: "#58a6ff",
      textDecoration: "none",
      cursor: "pointer",
    } as React.CSSProperties,
    title: {
      fontSize: "24px",
      fontWeight: 700,
      color: "var(--text-primary)",
      margin: 0,
      marginLeft: "16px",
    } as React.CSSProperties,
    body: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      padding: "60px 48px",
      textAlign: "center" as const,
    } as React.CSSProperties,
    gearStack: {
      position: "relative" as const,
      width: "120px",
      height: "120px",
      marginBottom: "40px",
    } as React.CSSProperties,
    gear: {
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      color: "#58a6ff",
      animation: "spin 4s linear infinite",
    } as React.CSSProperties,
    gearLarge: {
      animation: "spin 4s linear infinite",
    } as React.CSSProperties,
    gearSmall: {
      width: "60px",
      height: "60px",
      right: 0,
      bottom: 0,
      animation: "spin-reverse 3s linear infinite",
    } as React.CSSProperties,
    heading: {
      fontSize: "32px",
      fontWeight: 700,
      color: "var(--text-primary)",
      margin: "0 0 16px 0",
    } as React.CSSProperties,
    message: {
      fontSize: "16px",
      color: "var(--text-secondary)",
      margin: 0,
      maxWidth: "400px",
    } as React.CSSProperties,
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
        `}
      </style>
      <div style={styles.page}>
        <main style={styles.main}>
          <header style={styles.header}>
            <a href="/" style={styles.backLink}>
              {labels.backHome}
            </a>
            <h1 style={styles.title}>{labels.heading}</h1>
          </header>

          <div style={styles.body}>
            <div style={styles.gearStack}>
              <GearIcon className="gear-large" />
              <GearIcon className="gear-small" />
            </div>
            <p style={styles.message}>{labels.message}</p>
          </div>
        </main>
      </div>
    </>
  );
}

const meta = {
  title: "Pages/Maintenance",
  component: MaintenancePageComponent,
  decorators: [
    (Story) =>
      storySurface(
        <div style={{ padding: 0, margin: 0, minHeight: "100vh" }}>
          <Story />
        </div>,
      ),
  ],
  argTypes: {
    locale: {
      control: "select",
      options: ["en-US", "pt-PT"],
    },
  },
} satisfies Meta<typeof MaintenancePageComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    locale: "en-US",
  },
};
