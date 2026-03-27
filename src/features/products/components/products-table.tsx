import type { ProductDto } from "../../../services/contracts/product";
import type { ColumnDef } from "@tanstack/react-table";

function formatCurrency(value: number) {
  return `AED ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
}

export function getProductColumns(): ColumnDef<ProductDto>[] {
  return [
    {
      accessorKey: "code",
      header: "CODE",
    },
    {
      accessorKey: "name",
      header: "PRODUCT NAME",
      cell: ({ row }) => (
        <div>
          <div className="product-name">{row.original.name}</div>     
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "PRICE",
      cell: ({ row }) => (
        <span className="amount">{formatCurrency(row.original.price)}</span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "QTY",
    },
    {
      accessorKey: "unitName",
      header: "UNIT",
      cell: ({ row }) => (
        <span>{row.original.unitCode || row.original.unit || '-'}</span>
      ),
    },
    {
      accessorKey: "packaging",
      header: "PACKAGING",
    },
    {
      accessorKey: "isActive",
      header: "STATUS",
      cell: ({ row }) => (
        <span className={`badge ${row.original.isActive ? "badge-green" : "badge-gray"}`}>
          {row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];
}
