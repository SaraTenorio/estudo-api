import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Link from "next/link";
import { Card } from "@/components/cards";
import { Badge } from "@/components/badge";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    title: "Card Title",
    description: "This is a card description",
  },
  argTypes: {
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
    children: {
      control: false,
    },
    actions: {
      control: false,
    },
    footer: {
      control: false,
    },
    onClick: {
      control: false,
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    title: "Card with Actions",
    description: "This card demonstrates action badges.",
    actions: (
      <div style={{ display: "flex", gap: 6 }}>
        <Badge variant="success">Tag 1</Badge>
        <Badge variant="warning">Tag 2</Badge>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: "Card with Footer",
    description: "This card has a footer section.",
    footer: (
      <div style={{ fontSize: 12, color: "#8b949e" }}>
        Last updated: 2026-06-29
      </div>
    ),
  },
};

export const Complete: Story = {
  args: {
    title: "Complete Card Example",
    description: "A card demonstrating all available features.",
    actions: (
      <div style={{ display: "flex", gap: 4 }}>
        <Badge variant="active">Active</Badge>
      </div>
    ),
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#8b949e" }}>ID</span>
          <span style={{ color: "#e6edf3" }}>#42</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#8b949e" }}>Price</span>
          <span style={{ color: "#e6edf3" }}>$99.99</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#8b949e" }}>Quantity</span>
          <span style={{ color: "#e6edf3" }}>10</span>
        </div>
      </div>
    ),
    footer: (
      <button
        style={{
          padding: "6px 12px",
          background: "#58a6ff",
          color: "#0d1117",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        View Details
      </button>
    ),
  },
};

export const ProductComplete: Story = {
  args: {
    title: "Mechanical Keyboard Pro",
    description: "Limited edition with premium finish.",
    actions: (
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <Badge variant="active">Active</Badge>
        <button
          type="button"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#8b949e",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Remove product"
          title="Remove product"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    ),
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#8b949e" }}>ID</span>
          <span style={{ color: "#e6edf3" }}>#42</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#8b949e" }}>Price</span>
          <span style={{ color: "#e6edf3" }}>$129.99</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#8b949e" }}>Quantity</span>
          <span style={{ color: "#e6edf3" }}>7</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#8b949e" }}>Created at</span>
          <span style={{ color: "#e6edf3" }}>May 12, 2026</span>
        </div>
      </div>
    ),
    footer: (
      <a
        href="/products/42"
        style={{
          padding: "6px 12px",
          background: "#58a6ff",
          color: "#0d1117",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          display: "inline-block",
          textDecoration: "none",
        }}
      >
        View details →
      </a>
    ),
  },
};
