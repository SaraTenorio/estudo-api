import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CopyButton } from "@/components/buttons";

const meta = {
  title: "Components/Buttons/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    text: "Hello World",
    label: "📋",
  },
  argTypes: {
    text: {
      control: "text",
    },
    label: {
      control: "text",
    },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
