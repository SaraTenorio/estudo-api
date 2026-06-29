import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonWithIcon } from "@/components/buttons";
import { storySurface } from "../pages/Products/fixtures";

const meta = {
  title: "Components/Buttons/ButtonWithIcon",
  component: ButtonWithIcon,
  decorators: [
    (Story) =>
      storySurface(
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <Story />
        </div>,
      ),
  ],
  args: {
    icon: "📋",
    children: "Button",
    variant: "secondary",
    iconPosition: "left",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ButtonWithIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
