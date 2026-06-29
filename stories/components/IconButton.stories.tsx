import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "@/components/buttons";

const meta = {
  title: "Components/Buttons/IconButton",
  component: IconButton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    ariaLabel: "Icon button",
    children: "⚙",
    variant: "secondary",
    size: "md",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
