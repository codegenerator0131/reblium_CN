import ProductDetailView from "@/sections/store/detail";

export const metadata = {
  title: "Product Details",
};

export default function Page({ params }: { params: { sku: string } }) {
  return <ProductDetailView sku={params.sku} />;
}
