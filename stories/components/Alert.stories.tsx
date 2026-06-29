import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "@/components/alerts";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    variant: "success",
    title: "Alert Title",
    children: "This is an alert message.",
    closable: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
    title: {
      control: "text",
    },
    children: {
      control: "text",
    },
    closable: {
      control: "boolean",
    },
    onClose: {
      action: "closed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
