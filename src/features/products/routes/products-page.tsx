import { useState, useMemo } from "react";
import { Package } from "lucide-react";
import { useProductsQuery } from "../hooks/use-products-query";
import { DataTable } from "../../../components/ui/DataTable";
import { getProductColumns } from "../components/products-table";

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isFetching } = useProductsQuery({
    pageNumber: page,
    pageSize,
    sortBy: "id",
    sortOrder: "desc",
  });

  const products = data?.data ?? []
  const totalCount = data?.totalCount ?? 0

  const columns = useMemo(() => getProductColumns(), [])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="p-2">
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products..."
        title="Products Management"
        subtitle="View and manage cement products"
        icon={<Package size={24} />}
        isLoading={isLoading || isFetching}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        currentPage={page}
      />
    </div>
  );
}
