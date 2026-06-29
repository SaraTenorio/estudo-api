import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactElement } from "react";
import { LangProvider } from "@/lib/context";
import { storySurface } from "../products/fixtures";

const methodColor: Record<string, string> = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  PATCH: "#50e3c2",
  DELETE: "#f93e3e",
};

interface EndpointGroup {
  title: string;
  resource: string;
  endpoints: Array<{
    method: string;
    description: string;
    body: string | null;
  }>;
}

const sampleGroups: EndpointGroup[] = [
  {
    title: "Authentication",
    resource: "/api/auth/login",
    endpoints: [
      {
        method: "POST",
        description: "Login endpoint",
        body: JSON.stringify(
          { username: "admin", password: "your-password" },
          null,
          2,
        ),
      },
    ],
  },
  {
    title: "Collection",
    resource: "/api/products",
    endpoints: [
      { method: "GET", description: "List all products", body: null },
      {
        method: "POST",
        description: "Create a new product",
        body: JSON.stringify(
          {
            name: "New product",
            description: "Description",
            price: 9.99,
            quantity: 5,
            active: true,
            createdAt: "2026-05-12T10:00:00.000Z",
          },
          null,
          2,
        ),
      },
    ],
  },
];

interface HomePageProps {
  baseUrl?: string;
  groups?: EndpointGroup[];
}

function HomePageComponent({
  baseUrl = "https://localhost:3000",
  groups = sampleGroups,
}: HomePageProps): ReactElement {
  const styles = {
    page: {
      "--background": "#0d1117",
      "--foreground": "#161b22",
      "--border": "#30363d",
      "--text-primary": "#e6edf3",
      "--text-secondary": "#8b949e",
      "--code-bg": "#1c2128",
      display: "flex",
      minHeight: "100vh",
      alignItems: "flex-start",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      backgroundColor: "var(--background)",
    } as React.CSSProperties,
    main: {
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      maxWidth: "860px",
      flexDirection: "column" as const,
      alignItems: "flex-start",
      gap: "40px",
      backgroundColor: "var(--foreground)",
      padding: "60px 48px",
      borderLeft: "1px solid var(--border)",
      borderRight: "1px solid var(--border)",
    } as React.CSSProperties,
    intro: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "flex-start",
      textAlign: "left" as const,
      gap: "12px",
    } as React.CSSProperties,
    heading: {
      fontSize: "36px",
      fontWeight: 700,
      lineHeight: "44px",
      letterSpacing: "-1.5px",
      color: "var(--text-primary)",
      margin: 0,
    } as React.CSSProperties,
    paragraph: {
      fontSize: "16px",
      lineHeight: "28px",
      color: "var(--text-secondary)",
      margin: 0,
    } as React.CSSProperties,
    code: {
      fontFamily: "monospace",
      fontSize: "13px",
      backgroundColor: "var(--code-bg)",
      border: "1px solid var(--border)",
      borderRadius: "4px",
      padding: "1px 6px",
      color: "var(--text-primary)",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.intro}>
          <h1 style={styles.heading}>Estudo API</h1>
          <p style={styles.paragraph}>
            Documentation for REST API endpoints with <code style={styles.code}>/api/products</code>.
            <br />
            Base URL: <code style={styles.code}>{baseUrl}</code>
          </p>
          <p style={{ ...styles.paragraph, fontSize: "13px" }}>
            Make authenticated calls to API endpoints
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
          {groups.map((group) => (
            <div
              key={group.resource}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                border: "1px solid var(--border)",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 18px",
                  backgroundColor: "#0d1117",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {group.title}
                </span>
                <code
                  style={{
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    flex: 1,
                  }}
                >
                  {group.resource}
                </code>
              </div>

              <div>
                {group.endpoints.map((ep) => (
                  <div
                    key={ep.method}
                    style={{
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 18px",
                        backgroundColor: "var(--code-bg)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "3px 8px",
                          minWidth: "60px",
                          textAlign: "center",
                          letterSpacing: "0.5px",
                          backgroundColor: methodColor[ep.method],
                        }}
                      >
                        {ep.method}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {ep.description}
                      </span>
                    </div>
                    {ep.body && (
                      <div
                        style={{
                          borderTop: "1px solid var(--border)",
                          padding: "14px 18px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Body (JSON)
                        </span>
                        <pre
                          style={{
                            margin: 0,
                            fontFamily: "monospace",
                            fontSize: "13px",
                            color: "var(--text-primary)",
                            lineHeight: "20px",
                          }}
                        >
                          {ep.body}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const meta = {
  title: "Pages/Home",
  component: HomePageComponent,
  decorators: [
    (Story) => (
      <LangProvider>
        <Story />
      </LangProvider>
    ),
  ],
} satisfies Meta<typeof HomePageComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithMultipleGroups: Story = {
  args: {
    groups: [
      ...sampleGroups,
      {
        title: "Random",
        resource: "/api/products/random",
        endpoints: [
          {
            method: "POST",
            description: "Create a random product",
            body: null,
          },
        ],
      },
      {
        title: "Reset",
        resource: "/api/products/reset",
        endpoints: [
          { method: "POST", description: "Reset the product store", body: null },
        ],
      },
    ],
  },
};

export const SingleGroup: Story = {
  args: {
    groups: [sampleGroups[0]],
  },
};

export const ProductionURL: Story = {
  args: {
    baseUrl: "https://api.example.com",
  },
};
