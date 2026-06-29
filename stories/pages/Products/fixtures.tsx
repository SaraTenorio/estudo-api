import type { ReactElement, ReactNode } from "react";
import type { Product } from "@/lib/store";

export type StoryLocale = "en" | "pt";

export const sampleProduct: Product = {
  id: 42,
  name: "Mechanical Keyboard Pro",
  description: "Limited edition with premium finish.",
  price: 129.99,
  quantity: 7,
  active: true,
  createdAt: "2026-05-12T10:00:00.000Z",
};

export const inactiveProduct: Product = {
  ...sampleProduct,
  id: 43,
  name: "Archive Storage Unit",
  description: "",
  active: false,
  quantity: 0,
};

const dictionaries = {
  en: {
    locale: "en-US",
    productCardLabels: {
      active: "Active",
      inactive: "Inactive",
      id: "ID",
      price: "Price",
      quantity: "Quantity",
      createdAt: "Created at",
      viewDetails: "View details →",
      removeProduct: "Remove product",
    },
    productsPageLabels: {
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
    productDetailLabels: {
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
      toggleActivateTitle: "Click to activate",
    },
    statusBadge: {
      activeLabel: "Active",
      inactiveLabel: "Inactive",
    },
    errors: {
      products401: "Error loading products (401)",
    },
  },
  pt: {
    locale: "pt-PT",
    productCardLabels: {
      active: "Ativo",
      inactive: "Inativo",
      id: "ID",
      price: "Preco",
      quantity: "Quantidade",
      createdAt: "Criado em",
      viewDetails: "Ver detalhes →",
      removeProduct: "Remover produto",
    },
    productsPageLabels: {
      backToApi: "← Voltar a API",
      productsHeading: "Produtos",
      hint: "Esta pagina consome /api/products diretamente. Use os controlos acima para explorar os estados visuais.",
      refreshTitle: "Atualizar dados",
      addRandom: "+ Produto aleatorio",
      addingRandom: "A adicionar…",
      resetStore: "Repor store",
      resetting: "A repor…",
      loadingProducts: "A carregar produtos…",
      noProducts: "Nenhum produto encontrado.",
      active: "Ativo",
      inactive: "Inativo",
      labelId: "ID",
      labelPrice: "Preco",
      labelQuantity: "Quantidade",
      labelCreatedAt: "Criado em",
      viewDetails: "Ver detalhes →",
      removeProductTitle: "Remover produto",
    },
    productDetailLabels: {
      backToProducts: "← Voltar aos produtos",
      removeBtn: "Remover",
      removeProductTitle: "Remover produto",
      refreshTitle: "Atualizar dados",
      loadingProduct: "A carregar produto…",
      notFoundHeading: "Pagina Nao Encontrada",
      notFoundMessage: "A pagina que procura nao existe ou foi movida.",
      active: "Ativo",
      inactive: "Inativo",
      identification: "Identificacao",
      inventory: "Inventario",
      metadata: "Metadados",
      labelId: "ID",
      labelName: "Nome",
      labelPrice: "Preco",
      labelQuantity: "Quantidade",
      labelStatus: "Estado",
      labelCreatedAt: "Criado em",
      labelCreatedAtIso: "createdAt (ISO)",
      toggleTitle: "Clique para desativar",
      toggleActivateTitle: "Clique para ativar",
    },
    statusBadge: {
      activeLabel: "Ativo",
      inactiveLabel: "Inativo",
    },
    errors: {
      products401: "Erro ao carregar produtos (401)",
    },
    notFoundLabels: {
      backHome: "← Voltar a casa",
      heading: "Página não encontrada",
      message: "A página que procura não existe ou foi movida.",
    },
    maintenanceLabels: {
      backHome: "← Voltar a casa",
      heading: "Em Manutenção",
      message: "Estamos realizando manutenção. Por favor, verifique novamente em breve.",
    },
  },
} as const;

export const getStoryLocale = (value?: string): StoryLocale =>
  value === "pt" ? "pt" : "en";

export const getDictionary = (locale: StoryLocale) => dictionaries[locale];

export const getToolbarSlot = (locale: StoryLocale): ReactElement => {
  const buttonBase = {
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    padding: "2px 6px",
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: 600,
  } as const;

  const activeStyle = { borderColor: "#58a6ff", color: "#58a6ff" };
  const inactiveStyle = { borderColor: "transparent", color: "#8b949e" };

  return (
    <div
      style={{ display: "flex", gap: 2, alignItems: "center" }}
      aria-label="Story language selector"
    >
      <span
        style={{
          ...buttonBase,
          ...(locale === "en" ? activeStyle : inactiveStyle),
        }}
      >
        EN
      </span>
      <span
        style={{
          ...buttonBase,
          ...(locale === "pt" ? activeStyle : inactiveStyle),
        }}
      >
        PT
      </span>
    </div>
  );
};

export const storySurface = (story: ReactNode): ReactElement => (
  <div
    style={{
      minHeight: "100vh",
      padding: "32px",
      background: "#0d1117",
      color: "#ededed",
    }}
  >
    {story}
  </div>
);
