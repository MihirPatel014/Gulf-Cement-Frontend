import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "../../../components/ui/DataTable"
import { CheckCircle, Clock, CheckCircle2, Timer, TrendingUp } from "lucide-react"
import { orderApiService } from "../../../services/adapters/orders.api"
import type { ColumnDef } from "@tanstack/react-table"
import type { DispatchOrder } from "../../../services/contracts/order"
import { toast } from "sonner"
import { CreateShipmentModal } from "../components/CreateShipmentModal"

function getStatusClass(status: number) {
  switch (status) {
    case 1:
      return "badge-gray"
    case 2:
      return "badge-blue"
    case 3:
      return "badge-green"
    case 4:
      return "badge-red"
    case 5:
      return "badge-yellow"
    case 6:
      return "badge-blue"
    case 7:
      return "badge-purple"
    case 8:
      return "badge-orange"
    case 9:
      return "badge-pink"
    case 10:
      return "badge-cyan"
    case 11:
      return "badge-indigo"
    case 12:
      return "badge-teal"
    case 13: 
      return "badge-success" 
    case 14: 
      return "badge-success" 
    default:
      return "badge-gray"
  }
}

function getStatusLabel(status: number) {
  switch (status) {
    case 1:
      return "Submitted"
    case 2:
      return "Approved"
    case 3:
      return "Hold"
    case 4:
      return "Rejected"
    case 5:
      return "Shipment Created"
    case 6:
      return "Token Issued"
    case 7:
      return "Zone Assigned"
    case 8:
      return "Loading"
    case 9:
      return "Weighing"
    case 10:
      return "Voucher Ready"
    case 11:
      return "Gate Exit"
    case 12:
      return "In Transit"
    case 13:
      return "Arrived"
    case 14:
      return "Delivered"
    default:
      return "Unknown"
  }
}

function formatCurrency(value: number) {
  return `AED ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}

function formatDateTime(dateString: string | null | undefined) {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

// OrderStatus enum from backend
const OrderStatus = {
  Submitted: 1,
  Approved: 2,
  Hold: 3,
  Rejected: 4,
  ShipmentCreated: 5,  
  TokenIssued: 6,
  ZoneAssigned: 7,
  Loading: 8,
  Weighing: 9,
  VoucherReady: 10,
  GateExit: 11,
  InTransit: 12,
  Arrived: 13,
  Delivered: 14
}

// Tab types
type TabType = "inbox" | "approved" | "all" | "mis"

const tabs: { id: TabType; label: string }[] = [
  { id: "inbox", label: "Order Inbox" },
  { id: "approved", label: "Approved" },
  { id: "all", label: "All Orders" },
  { id: "mis", label: "Dispatch MIS" }
]

export const DispatchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("inbox")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const queryClient = useQueryClient()

  // Determine status filter based on active tab
  const statusFilter = useMemo(() => {
    switch (activeTab) {
      case "inbox":
        return OrderStatus.Submitted // status = 1
      case "approved":
        return OrderStatus.Approved // status = 2
      case "all":
      case "mis":
      default:
        return undefined // all orders
    }
  }, [activeTab])

  const { data, isLoading } = useQuery({
    queryKey: ["dispatch-paginated", page, statusFilter],
    queryFn: () => orderApiService.getDispatchPaginated({
      pageNumber: page,
      pageSize,
      status: statusFilter
    })
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: number; newStatus: number }) =>
      orderApiService.updateOrderStatus(id, newStatus),
    onSuccess: () => {
      toast.success("Order status updated successfully")
      queryClient.invalidateQueries({ queryKey: ["dispatch-paginated"] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    }
  })

  const orders = data?.data ?? []

  const totalCount = data?.totalCount ?? 0

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleApprove = (orderId: number) => {
    updateStatusMutation.mutate({ id: orderId, newStatus: OrderStatus.Approved })
  }

  const handleHold = (orderId: number) => {
    updateStatusMutation.mutate({ id: orderId, newStatus: OrderStatus.Hold })
  }

  const handleReject = (orderId: number) => {
    updateStatusMutation.mutate({ id: orderId, newStatus: OrderStatus.Rejected })
  }

  // Shipment modal state
  const [shipmentModal, setShipmentModal] = useState<{
  orderId: number
  orderNo: string
  transportType: string
  vehicleNumber?: string
  driverName?: string
  driverMobile?: string
  items: { orderItemId: number; productName: string; quantity: number }[]
} | null>(null)

  const handleCreateShipment = async (order: DispatchOrder) => {
  try {
    const orderDetails = await orderApiService.getOrder(order.orderId)

    const items = orderDetails.items?.map((item: any) => ({
      orderItemId: item.id,
      productName: item.productName,
      quantity: item.quantity,
    })) || []

    setShipmentModal({
      orderId: order.orderId,
      orderNo: orderDetails.orderNo,

      // ✅ ADD THIS
      transportType: orderDetails.transportType,
      vehicleNumber: orderDetails.vehicleNumber,
      driverName: orderDetails.driverName,
      driverMobile: orderDetails.driverMobile,

      items,
    })

  } catch (error) {
    toast.error("Failed to load order details")
  }
}

  const handleShipmentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["dispatch-paginated"] })
  }

  // Columns for Order Inbox tab (no status, with transport)
  const inboxColumns: ColumnDef<DispatchOrder>[] = [
    {
      accessorKey: "orderId",
      header: "ORDER #",
      cell: ({ row }) => (
        <span className="order-id">ORD-{2000 + row.original.orderId}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "CUSTOMER",
      cell: ({ row }) => (
        <span style={{ fontWeight: 500 }}>{row.original.customerName}</span>
      ),
    },
    {
      accessorKey: "productName",
      header: "PRODUCT",
      cell: ({ row }) => {
        const items = row.original.items
        if (items && items.length > 1) {
          return (
            <div className="products-list">
              {items.map((item, idx) => (
                <div key={idx} className="product-item">
                  <span className="product-name">{item.productName}</span>
                </div>
              ))}
            </div>
          )
        }
        return (
          <div>
            <div className="product-name">{row.original.productName}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "quantity",
      header: "QTY",
      cell: ({ row }) => {
        const items = row.original.items

        //  Multiple products
        if (items && items.length > 1) {
          return (
            <div className="products-list">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="product-item">
                  <span className="product-qty">{item.quantity}</span>
                </div>
              ))}
            </div>
          )
        }

        // Single product (existing)
        return <span>{row.original.quantity}</span>
      },
    },
    {
      accessorKey: "amount",
      header: "AMOUNT",
      cell: ({ row }) => (
        <span className="amount">{formatCurrency(row.original.totalAmount || row.original.amount)}</span>
      ),
    },
    {
      accessorKey: "orderDate",
      header: "DATE",
      cell: ({ row }) => (
        <span>{formatDate(row.original.orderDate)}</span>
      ),
    },
    {
      accessorKey: "transportType",
      header: "TRANSPORT",
      cell: ({ row }) => (
        <span>{row.original.transportType}</span>
      ),
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            className="action-btn"
            style={{
              background: "var(--success-bg)",
              color: "var(--success)",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => handleApprove(row.original.orderId)}
            disabled={updateStatusMutation.isPending}
            title="Approve"
          >
            Approve
          </button>
          <button
            className="action-btn"
            style={{
              background: "var(--warning-bg)",
              color: "var(--warning)",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => handleHold(row.original.orderId)}
            disabled={updateStatusMutation.isPending}
            title="Hold"
          >
            Hold
          </button>
          <button
            className="action-btn"
            style={{
              background: "var(--danger-bg)",
              color: "var(--danger)",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => handleReject(row.original.orderId)}
            disabled={updateStatusMutation.isPending}
            title="Reject"
          >
            Reject
          </button>
        </div>
      ),
    }
  ]

  // Columns for Approved tab (with approvedAt and approvedBy, no date)
  const approvedColumns: ColumnDef<DispatchOrder>[] = [
    {
      accessorKey: "orderId",
      header: "ORDER #",
      cell: ({ row }) => (
        <span className="order-id">ORD-{2000 + row.original.orderId}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "CUSTOMER",
      cell: ({ row }) => (
        <span style={{ fontWeight: 500 }}>{row.original.customerName}</span>
      ),
    },
    {
      accessorKey: "productName",
      header: "PRODUCT",
      cell: ({ row }) => {
        const items = row.original.items
        if (items && items.length > 1) {
          return (
            <div className="products-list">
              {items.map((item, idx) => (
                <div key={idx} className="product-item">
                  <span className="product-name">{item.productName}</span>                  
                </div>
              ))}
            </div>
          )
        }
        return (
          <div>
            <div className="product-name">{row.original.productName}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "quantity",
      header: "QTY",
      cell: ({ row }) => {
        const items = row.original.items

        //  Multiple products
        if (items && items.length > 1) {
          return (
            <div className="products-list">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="product-item">
                  <span className="product-qty">{item.quantity}</span>
                </div>
              ))}
            </div>
          )
        }

        // Single product (existing)
        return <span>{row.original.quantity}</span>
      },
    },

    {
      accessorKey: "amount",
      header: "AMOUNT",
      cell: ({ row }) => (
        <span className="amount">{formatCurrency(row.original.totalAmount || row.original.amount)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const statusValue = row.original.status
        return (
          <span className={`badge ${getStatusClass(statusValue)}`}>
            {getStatusLabel(statusValue)}
          </span>
        )
      },
    },
    {
      accessorKey: "approvedAt",
      header: "APPROVED AT",
      cell: ({ row }) => (
        <span>{formatDateTime(row.original.approvedAt)}</span>
      ),
    },
    {
      accessorKey: "approvedBy",
      header: "APPROVED BY",
      cell: ({ row }) => (
        <span>{row.original.approvedBy || "-"}</span>
      ),
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <button
          className="action-btn"
          style={{
            background: "var(--primary-bg)",
            color: "var(--primary)",
            padding: "6px 14px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => handleCreateShipment(row.original)}
        >
          Create Shipment
        </button>
      ),
    }
  ]

  // Columns for All Orders and Dispatch MIS tabs (no action column, with transport)
  const allOrdersColumns: ColumnDef<DispatchOrder>[] = [
    {
      accessorKey: "orderId",
      header: "ORDER #",
      cell: ({ row }) => (
        <span className="order-id">ORD-{2000 + row.original.orderId}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "CUSTOMER",
      cell: ({ row }) => (
        <span style={{ fontWeight: 500 }}>{row.original.customerName}</span>
      ),
    },
    {
      accessorKey: "productName",
      header: "PRODUCT",
      cell: ({ row }) => {
        const items = row.original.items
        if (items && items.length > 1) {
          return (
            <div className="products-list">
              {items.map((item, idx) => (
                <div key={idx} className="product-item">
                  <span className="product-name">{item.productName}</span>
                </div>
              ))}
            </div>
          )
        }
        return (
          <div>
            <div className="product-name">{row.original.productName}</div>
          </div>
        )
      },
    },
   {
      accessorKey: "quantity",
      header: "QTY",
      cell: ({ row }) => {
        const items = row.original.items

        //  Multiple products
        if (items && items.length > 1) {
          return (
            <div className="products-list">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="product-item">
                  <span className="product-qty">{item.quantity}</span>
                </div>
              ))}
            </div>
          )
        }

        // Single product (existing)
        return <span>{row.original.quantity}</span>
      },
    },
    {
      accessorKey: "amount",
      header: "AMOUNT",
      cell: ({ row }) => (
        <span className="amount">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      accessorKey: "orderDate",
      header: "DATE",
      cell: ({ row }) => (
        <span>{formatDate(row.original.orderDate)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const statusValue = row.original.status
        return (
          <span className={`badge ${getStatusClass(statusValue)}`}>
            {getStatusLabel(statusValue)}
          </span>
        )
      },
    }
  ]

  // Get columns based on active tab
  const columns = useMemo(() => {
    switch (activeTab) {
      case "inbox":
        return inboxColumns
      case "approved":
        return approvedColumns
      case "all":
      case "mis":
        return allOrdersColumns
      default:
        return inboxColumns
    }
  }, [activeTab])

  // Render tabs
  const renderTabs = () => (
    <div style={{
      display: "flex",
      gap: "0",
      borderBottom: "2px solid var(--border-color)",
      marginBottom: "20px"
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id)
            setPage(1)
          }}
          style={{
            padding: "12px 24px",
            background: activeTab === tab.id ? "var(--primary)" : "transparent",
            color: activeTab === tab.id ? "white" : "var(--text-secondary)",
            border: "none",
            borderRadius: "8px 8px 0 0",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
            marginBottom: "-2px"
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )

  // Get the title based on active tab
  const getTableTitle = () => {
    switch (activeTab) {
      case "inbox":
        return "Order Inbox"
      case "approved":
        return "Approved"
      case "all":
        return "All Orders"
      case "mis":
        return "Dispatch MIS"
      default:
        return "Order Inbox"
    }
  }

  return (
    <div className="p-2">
      {/* Page Header */}
      <div className="page-header mb-8 flex justify-between items-end">
        <div>
          <h1 className="page-title text-3xl font-extrabold tracking-tight text-primary">Dispatch Authority</h1>
          <p className="page-subtitle text-secondary font-medium">Approve, reject, or hold customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{
          background: "var(--bg-white)",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Pending Orders</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--warning)" }}>0</p>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "var(--warning-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Clock size={24} style={{ color: "var(--warning)" }} />
            </div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-white)",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Approved Today</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--success)" }}>0</p>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "var(--success-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <CheckCircle2 size={24} style={{ color: "var(--success)" }} />
            </div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-white)",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Avg Approval SLA</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--primary)" }}>0h</p>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "var(--primary-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Timer size={24} style={{ color: "var(--primary)" }} />
            </div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-white)",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Revenue Pipeline</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--success)" }}>AED 0</p>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "var(--success-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <TrendingUp size={24} style={{ color: "var(--success)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Render content based on active tab */}
      {activeTab === "mis" ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          background: "var(--bg-white)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
        }}>
          <p style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            fontWeight: 500
          }}>
            Dispatch MIS feature coming soon
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          searchPlaceholder="Search orders..."
          title={getTableTitle()}
          subtitle="Approve, reject, or hold customer orders"
          icon={<CheckCircle size={24} />}
          isLoading={isLoading}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          currentPage={page}
          filters={renderTabs()}
        />
      )}

      {/* Shipment Modal */}
      {shipmentModal && (
        <CreateShipmentModal
          orderId={shipmentModal.orderId}
          orderNo={shipmentModal.orderNo}
          transportType={shipmentModal.transportType}
          vehicleNumber={shipmentModal.vehicleNumber}
          driverName={shipmentModal.driverName}
          driverMobile={shipmentModal.driverMobile}
          items={shipmentModal.items}
          onClose={() => setShipmentModal(null)}
          onSuccess={handleShipmentSuccess}
        />
      )}
    </div>
  )
}
