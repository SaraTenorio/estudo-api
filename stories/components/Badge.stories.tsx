import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/components/badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    variant: "info",
    children: "Badge",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["active", "inactive", "success", "warning", "error", "info"],
    },
    children: {
      control: "text",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
