import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductsPageView } from "@/components/products";
import {
  getDictionary,
  getStoryLocale,
  getToolbarSlot,
  sampleProduct,
  storySurface,
} from "./fixtures";

const meta = {
  title: "Pages/Products/ProductsPageView",
  component: ProductsPageView,
  decorators: [(Story) => storySurface(<Story />)],
  parameters: {
    layout: "padded",
  },
  args: {
    products: [sampleProduct],
    locale: "en-US",
    labels: {
      backToApi: "← Back to API",
      productsHeading: "Products",
      hint: "This page consumes /api/products directly. Use the controls above to explore different UI states.",
      refreshTitle: "Refresh data",
      addRandom: "+ Random product",
      addingRandom: "Adding…",
      resetStore: "Reset store",
      resetting: "Resetting…",
      loadingProducts: "Loading products…",
      noProducts: "No products found.",
      active: "Active",
      inactive: "Inactive",
      labelId: "ID",
      labelPrice: "Price",
      labelQuantity: "Quantity",
      labelCreatedAt: "Created at",
      viewDetails: "View details →",
      removeProductTitle: "Remove product",
    },
    isLoading: false,
    errorMessage: null,
    isRefreshing: false,
    isAdding: false,
    isResetting: false,
    deletingId: null,
    onRefresh: fn(),
    onAddRandom: fn(),
    onReset: fn(),
    onDelete: fn(),
    toolbarSlot: <div />,
  },
  argTypes: {
    products: { control: false },
    labels: { control: false },
    onRefresh: { control: false },
    onAddRandom: { control: false },
    onReset: { control: false },
    onDelete: { control: false },
    toolbarSlot: { control: false },
    locale: { control: false },
    isLoading: { control: "boolean" },
    errorMessage: { control: "text" },
    isRefreshing: { control: "boolean" },
    isAdding: { control: "boolean" },
    isResetting: { control: "boolean" },
    deletingId: { control: false },
  },
  render: (args, context) => {
    const locale = getStoryLocale(context.globals.locale);
    const dictionary = getDictionary(locale);

    return (
      <ProductsPageView
        {...args}
        locale={dictionary.locale}
        labels={dictionary.productsPageLabels}
        toolbarSlot={getToolbarSlot(locale)}
      />
    );
  },
} satisfies Meta<typeof ProductsPageView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
