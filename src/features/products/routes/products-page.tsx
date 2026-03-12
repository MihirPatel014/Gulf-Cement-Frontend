import { toast } from "sonner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect } from "react";
import { useProductsQuery } from "../hooks/use-products-query";
import { ProductsTable } from "../components/products-table";

export function ProductsPage() {
  const productsQuery = useProductsQuery();

  useEffect(() => {
    if (productsQuery.isError) {
      const message =
        productsQuery.error instanceof Error
          ? productsQuery.error.message
          : "Unknown error";
      toast.error(`Failed to load products: ${message}`);
    }
  }, [productsQuery.error, productsQuery.isError]);

  if (productsQuery.isLoading) {
    return (
      <div className="card">
        <h2 className="title">Products</h2>
        <Skeleton height={24} count={5} />
      </div>
    );
  }

  if (productsQuery.isError) {
    return (
      <div className="card">
        <h2 className="title">Products</h2>
        <p className="subtitle">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="title">Products</h2>
      <p className="subtitle">Data is provided by the configured service adapter.</p>
      <ProductsTable data={productsQuery.data ?? []} />
    </div>
  );
}
