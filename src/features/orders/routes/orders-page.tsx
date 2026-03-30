import { useState, useMemo } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useOrdersQuery } from "../hooks/use-orders-query"
import { DataTable } from "../../../components/ui/DataTable"
import { Plus, Package, Filter } from "lucide-react"
import { useProductsQuery } from "../../products/hooks/use-products-query"
import { useAuthStore } from "../../../store/auth-store"
import CreateOrderModal from "../components/create-order-modal"
import OrderDetailsModal from "../components/OrderDetailsModal"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "../../../lib/utils/date"
import { Eye, Truck, Factory } from "lucide-react"
import "./order.css"

type Order = {
  id: number;
  customerName?: string;
  productName: string;
  packaging: string;
  quantity: number;
  itemsCount: number;
  items?: any[];
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
    case "Pending":
      return "badge-yellow";
    case "Approved":
      return "badge-green";
    case "TokenIssued":
      return "badge-blue";
    case "ZoneAssigned":
      return "badge-purple";
    case "Loading":
      return "badge-yellow";
    case "Weighing":
      return "badge-orange";
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
    case "ShipmentCreated":
      return "badge-yellow";
    default:
      return "badge-gray";
  }
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s: any) => s.user)

  const isStaff =
    user?.role === "STAFF" ||
    user?.role === "Admin"

  const [showModal, setShowModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const [status, setStatus] = useState<string | undefined>()
  const [productId, setProductId] = useState<number | undefined>()

  const [page, setPage] = useState(1)
  const pageSize = 10

  const statusFilters = [
  { label: "All", value: undefined },
  { label: "Submitted", value: "Submitted" },
  { label: "Approved", value: "Approved" },
  { label: "Shipment Created", value: "ShipmentCreated" }, 
  { label: "Token Issued", value: "TokenIssued" },
  { label: "Zone Assigned", value: "ZoneAssigned" },
  { label: "Loading", value: "Loading" },
  { label: "Weighing", value: "Weighing" }, 
  { label: "Voucher Ready", value: "VoucherReady" },
  { label: "Gate Out", value: "GateExit" },
  { label: "In Transit", value: "InTransit" },
  { label: "Delivered", value: "Delivered" }
]

  const { data: productsData } = useProductsQuery({ pageSize: 100 });
  const products = productsData?.data ?? [];

  const { data, isLoading, isFetching } = useOrdersQuery({
    pageNumber: page,
    pageSize,
    search: isStaff ? "" : "",
    status,
    productId: isStaff ? undefined : productId
  })

  const orders = data?.data ?? []
  const totalCount = data?.totalCount ?? 0

  const handleCreateOrder = () => {
    if (isStaff) {
      setShowModal(true)
    } else {
      navigate({ to: "/orders/new" })
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // Define columns for the DataTable
  const columns: ColumnDef<Order>[] = useMemo(() => [
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
          {row.original.itemsCount > 1 ? (
            <div className="products-list">
              {row.original.items?.map((item: any, idx: number) => (
                <div key={idx} className="product-item">
                  <span className="product-name">{item.productName}</span>
                  <div className="product-type">{item.packaging}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="product-name">{row.original.productName}</div>
              <div className="product-type">{row.original.packaging}</div>
            </div>
          )}
        </div>
      ),
    },
    {
  accessorKey: "quantity",
  header: "QTY",
  cell: ({ row }) => {

    if (row.original.itemsCount > 1) {
      return (
        <div className="products-list">
          {row.original.items?.map((item: any, idx: number) => (
            <div key={idx} className="product-item">
              <span>{item.quantity}</span>
            </div>
          ))}
        </div>
      )
    }

    return <span>{row.original.quantity}</span>
  },
},
    {
      accessorKey: "transportOption",
      header: "TRANSPORT",
      cell: ({ row }) => {
        const isCustomerTransport = row.original.transportOption === "Customer"
        if (isStaff) {
          return (
            <span
              className={`transport-pill ${isCustomerTransport ? "transport-own" : "transport-company"
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
        return (
          <span
            className={`badge ${isCustomerTransport ? "badge-blue" : "badge-light"
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
              onClick={() => setSelectedOrderId(row.original.id)}
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
  ], [isStaff])

  // Render filters based on user role
  const renderFilters = () => {
    if (isStaff) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="filter-icon" size={18} />
          {statusFilters.map((s) => (
            <button
              key={s.label}
              className={`status-pill ${status === s.value ? "active" : ""}`}
              onClick={() => setStatus(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )
    }

    return (
      <div className="customer-filters flex items-center gap-3">
        <select
          value={status ?? ""}
          onChange={(e) =>
            setStatus(e.target.value || undefined)
          }
          className="select-input"
        >
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="ShipmentCreated">Shipment Created</option>
          <option value="TokenIssued">Token Issued</option>
          <option value="ZoneAssigned">Zone Assigned</option>
          <option value="Loading">Loading</option>
          <option value="VoucherReady">Voucher Ready</option>
          <option value="GateExit">Gate Exit</option>
          <option value="InTransit">In Transit</option>
          <option value="Arrived">Arrived</option>
          <option value="Delivered">Delivered</option>
        </select>

        <select
          value={productId ?? ""}
          onChange={(e) =>
            setProductId(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="select-input"
        >
          <option value="">All Products</option>
          {products.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="p-2">
      <DataTable
        columns={columns}
        data={orders}
        searchPlaceholder="Search orders..."
        title="Orders Management"
        subtitle="Create, track, and manage customer orders"
        icon={<Package size={24} />}
        isLoading={isLoading || isFetching}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        currentPage={page}
        filters={renderFilters()}
        headerActions={
          <button
            className="btn btn-primary"
            onClick={handleCreateOrder}
          >
            <Plus size={16} /> Place New Order
          </button>
        }
      />

      {/* MODALS */}

      {showModal && (
        <CreateOrderModal
          onClose={() => setShowModal(false)}
        />
      )}

      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  )
}
