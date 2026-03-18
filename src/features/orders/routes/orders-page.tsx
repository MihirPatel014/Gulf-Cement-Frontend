import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useOrdersQuery } from "../hooks/use-orders-query"
import { OrdersTable } from "../components/orders-table"
import { Plus } from "lucide-react"
import { useProductsQuery } from "../../products/hooks/use-products-query"
import { useAuthStore } from "../../../store/auth-store"
import { Filter } from "lucide-react"
import CreateOrderModal from "../components/create-order-modal"
import OrderDetailsModal from "../components/OrderDetailsModal"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "./order.css"

export default function OrdersPage() {

  const navigate = useNavigate()

  const user = useAuthStore((s:any) => s.user)

  const isStaff =
    user?.role === "STAFF" ||
    user?.role === "Admin"

  const [showModal,setShowModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string | undefined>()
  const [productId, setProductId] = useState<number | undefined>()

  const [page, setPage] = useState(1)
  const pageSize = 10

  const statusFilters = [
    { label: "All", value: undefined },
    { label: "Submitted", value: "Submitted" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Token Issued", value: "TokenIssued" },
    { label: "Zone Assigned", value: "ZoneAssigned" },
    { label: "Loading", value: "Loading" },
    { label: "Weighing", value: "Weighing" },
    { label: "Voucher Ready", value: "VoucherReady" },
    { label: "Gate Out", value: "GateExit" },
    { label: "In Transit", value: "InTransit" },
    { label: "Delivered", value: "Delivered" }
  ]

  const { data: products = [] } = useProductsQuery()

  const { data, isLoading, isFetching } = useOrdersQuery({
    pageNumber: page,
    pageSize,
    search: isStaff ? "" : search,
    status,
    productId: isStaff ? undefined : productId
  })

  const orders = data?.data ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / pageSize)

  const handleCreateOrder = () => {

    if(isStaff){
      setShowModal(true)
    }
    else{
      navigate({ to: "/orders/new" })
    }

  }

  // reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [search, status, productId])

  return (
    <>
      <div className="page-header">

        <h1 className="page-title">Orders Management</h1>

        <p className="page-subtitle">
          Create, track, and manage customer orders
        </p>

        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={handleCreateOrder}
          >
            <Plus size={16} /> Place New Order
          </button>
        </div>

      </div>


      {/* FILTER BAR */}

      <div className="status-filter-container">

        <div className="status-filter-left">

          {isStaff && (
            <>
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
            </>
          )}

          {!isStaff && (
            <div className="customer-filters">

              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={status ?? ""}
                onChange={(e) =>
                  setStatus(e.target.value || undefined)
                }
              >
                <option value="">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
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
              >
                <option value="">All Products</option>

                {products.map((p:any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}

              </select>

            </div>
          )}

        </div>

        <div className="orders-count">
          {totalCount} orders
        </div>

      </div>


      {/* TABLE */}

      <div className="table-container">

        {isLoading ? (

          <div style={{ padding: "10px" }}>
            <Skeleton height={40} count={8} />
          </div>

        ) : (

          <>
            {isFetching && (
              <div className="table-loading">
                Updating...
              </div>
            )}

            <OrdersTable
              data={orders}
              isStaff={isStaff}
              onViewOrder={(order:any) => setSelectedOrderId(order.id)}
            />

            {/* PAGINATION */}

            <div className="pagination">

            <button
                className="page-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                key={p}
                className={`page-number ${p === page ? "active" : ""}`}
                onClick={() => setPage(p)}
                >
                {p}
                </button>
            ))}

            <button
                className="page-btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            >
                ›
            </button>

            </div>

          </>

        )}

      </div>


      {/* MODALS */}

      {showModal && (
        <CreateOrderModal
          onClose={()=>setShowModal(false)}
        />
      )}

      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={()=>setSelectedOrderId(null)}
        />
      )}
    </>
  )
}