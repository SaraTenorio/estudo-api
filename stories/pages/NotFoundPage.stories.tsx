import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactElement } from "react";
import {
  getDictionary,
  getStoryLocale,
  storySurface,
} from "./Products/fixtures";

interface NotFoundPageProps {
  locale?: string;
}

function NotFoundPageComponent({
  locale = "en-US",
}: NotFoundPageProps): ReactElement {
  const isPortuguese = locale === "pt-PT";
  const labels = isPortuguese
    ? {
        backHome: "← Voltar a casa",
        heading: "Página não encontrada",
        message: "A página que procura não existe ou foi movida.",
      }
    : {
        backHome: "← Back to home",
        heading: "Page Not Found",
        message:
          "The page you are looking for does not exist or has been moved.",
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
    body: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      padding: "60px 48px",
      textAlign: "center" as const,
    } as React.CSSProperties,
    code: {
      fontSize: "120px",
      fontWeight: 700,
      color: "#58a6ff",
      lineHeight: 1,
      margin: "0 0 20px 0",
    } as React.CSSProperties,
    title: {
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
    <div style={styles.page}>
      <main style={styles.main}>
        <header style={styles.header}>
          <a href="/" style={styles.backLink}>
            {labels.backHome}
          </a>
        </header>

        <div style={styles.body}>
          <p style={styles.code}>404</p>
          <h1 style={styles.title}>{labels.heading}</h1>
          <p style={styles.message}>{labels.message}</p>
        </div>
      </main>
    </div>
  );
}

const meta = {
  title: "Pages/404 Not Found",
  component: NotFoundPageComponent,
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
} satisfies Meta<typeof NotFoundPageComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    locale: "en-US",
  },
};
