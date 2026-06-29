import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductDetailView } from "@/components/products";
import {
  getDictionary,
  getStoryLocale,
  getToolbarSlot,
  sampleProduct,
  storySurface,
} from "./fixtures";

const meta = {
  title: "Pages/Products/ProductDetailView",
  component: ProductDetailView,
  decorators: [
    (Story) =>
      storySurface(
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Story />
        </div>,
      ),
  ],
  parameters: {
    layout: "padded",
  },
  args: {
    product: sampleProduct,
    locale: "en-US",
    labels: {
      backToProducts: "← Back to products",
      removeBtn: "Remove",
      removeProductTitle: "Remove product",
      refreshTitle: "Refresh data",
      loadingProduct: "Loading product…",
      notFoundHeading: "Page Not Found",
      notFoundMessage:
        "The page you are looking for does not exist or has been moved.",
      active: "Active",
      inactive: "Inactive",
      identification: "Identification",
      inventory: "Inventory",
      metadata: "Metadata",
      labelId: "ID",
      labelName: "Name",
      labelPrice: "Price",
      labelQuantity: "Quantity",
      labelStatus: "Status",
      labelCreatedAt: "Created at",
      labelCreatedAtIso: "createdAt (ISO)",
      toggleTitle: "Click to deactivate",
    },
    isLoading: false,
    isNotFound: false,
    isRefreshing: false,
    isDeleting: false,
    isToggling: false,
    onDelete: fn(),
    onRefresh: fn(),
    onToggleActive: fn(),
    toolbarSlot: <div />,
  },
  argTypes: {
    product: { control: false },
    labels: { control: false },
    onDelete: { control: false },
    onRefresh: { control: false },
    onToggleActive: { control: false },
    toolbarSlot: { control: false },
    locale: { control: false },
    isLoading: { control: "boolean" },
    isNotFound: { control: "boolean" },
    isRefreshing: { control: "boolean" },
    isDeleting: { control: "boolean" },
    isToggling: { control: "boolean" },
  },
  render: (args, context) => {
    const locale = getStoryLocale(context.globals.locale);
    const dictionary = getDictionary(locale);
    const active = args.product?.active ?? false;

    return (
      <ProductDetailView
        {...args}
        locale={dictionary.locale}
        labels={{
          ...dictionary.productDetailLabels,
          toggleTitle: active
            ? dictionary.productDetailLabels.toggleTitle
            : dictionary.productDetailLabels.toggleActivateTitle,
        }}
        toolbarSlot={getToolbarSlot(locale)}
      />
    );
  },
} satisfies Meta<typeof ProductDetailView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
