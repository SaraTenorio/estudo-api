import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { LangProvider } from "@/lib/context";
import { LangSelector } from "@/components/LangSelector";
import { storySurface } from "../pages/Products/fixtures";

const LangSelectorWithProvider = () => (
  <LangProvider>
    <LangSelector />
  </LangProvider>
);

const meta = {
  title: "Components/LangSelector",
  component: LangSelectorWithProvider,
  decorators: [
    (Story) =>
      storySurface(
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Story />
        </div>,
      ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof LangSelectorWithProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
