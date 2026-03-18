import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import "./orders-table.css";
import { useNavigate } from "@tanstack/react-router";
import { formatDate } from "../../../lib/utils/date";
import { Eye, Truck, Factory } from "lucide-react"
type Order = {
  id: number;
  customerName?: string;
  productName: string;
  packaging: string;
  quantity: number;
  totalAmount: number;
  status: string;
  transportOption: string;
  createdAt: string;
};

function formatCurrency(value: number) {
  return `AED ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
}

function getStatusClass(status: string) {
  switch (status) {
    case "Submitted":
      return "badge-gray";
    case "Approved":
      return "badge-green";
    case "TokenIssued":
      return "badge-blue";
    case "ZoneAssigned":
      return "badge-purple";
    case "Loading":
      return "badge-yellow";
    case "VoucherReady":
      return "badge-teal";
    case "GateExit":
      return "badge-indigo";
    case "InTransit":
      return "badge-orange";
    case "Arrived":
      return "badge-cyan";
    case "Delivered":
      return "badge-green";
    default:
      return "badge-gray";
  }
}

export function OrdersTable({
  data,
  isStaff,
  onViewOrder
}: {
  data: Order[]
  isStaff: boolean
  onViewOrder?: (order: Order) => void
}) {
  const navigate = useNavigate();

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ORDER #",
      cell: ({ row }) => (
        <span className="order-id">ORD-{2000 + row.original.id}</span>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "DATE",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },

    ...(isStaff
      ? [
          {
            accessorKey: "customerName",
            header: "CUSTOMER",
            cell: ({ row }: any) => (
              <span>{row.original.customerName || "-"}</span>
            ),
          },
        ]
      : []),

    {
      accessorKey: "productName",
      header: "PRODUCT",
      cell: ({ row }) => (
        <div>
          <div className="product-name">{row.original.productName}</div>
          <div className="product-type">{row.original.packaging}</div>
        </div>
      ),
    },

    {
      accessorKey: "quantity",
      header: "QTY",
      cell: ({ row }) => <span>{row.original.quantity}</span>,
    },

    {
  accessorKey: "transportOption",
  header: "TRANSPORT",
  cell: ({ row }) => {

    const isCustomerTransport = row.original.transportOption === "Customer"

    // STAFF VIEW (new UI like screenshot)
    if (isStaff) {
      return (
        <span
          className={`transport-pill ${
            isCustomerTransport ? "transport-own" : "transport-company"
          }`}
        >
          {isCustomerTransport ? (
            <>
              <Truck size={14} />
              Own
            </>
          ) : (
            <>
              <Factory size={14} />
              Company
            </>
          )}
        </span>
      )
    }

    // CUSTOMER VIEW (existing UI unchanged)
    return (
      <span
        className={`badge ${
          isCustomerTransport ? "badge-blue" : "badge-light"
        }`}
      >
        {isCustomerTransport ? "Own Transport" : "Company"}
      </span>
    )
  },
},

    {
      accessorKey: "totalAmount",
      header: "AMOUNT",
      cell: ({ row }) => (
        <span className="amount">
          {formatCurrency(row.original.totalAmount)}
        </span>
      ),
    },

    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => (
        <span className={`badge ${getStatusClass(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },

    {
  id: "actions",
  header: "ACTIONS",
  cell: ({ row }) => {

    if (isStaff) {
      return (
        <button
          className="action-btn"
          onClick={() => onViewOrder?.(row.original)}
        >
         <Eye size={18} />
        </button>
      )
    }

    return (
      <button
        className="action-btn"
        onClick={() =>
          navigate({
            to: "/orders/$orderId",
            params: { orderId: `${row.original.id}` }
          })
        }
      >
        Details →
      </button>
    )
  }
},
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <table className="orders-table">
        <thead>
          {table.getHeaderGroups().map((h) => (
            <tr key={h.id}>
              {h.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}