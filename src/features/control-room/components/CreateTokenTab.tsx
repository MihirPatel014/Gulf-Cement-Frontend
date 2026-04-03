import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Key, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "../../../components/ui/DataTable"
import { useShipmentsForToken } from "../hooks/use-shipments-for-token"
import { tokenApi } from "../api/token.api"
import type { ShipmentForToken } from "../types/token.types"
import "./create-token-tab.css"

export function CreateTokenTab() {
  const { data, totalCount, isLoading, currentPage, pageSize, fetchPage, refresh } = useShipmentsForToken()
  const [creatingTokenId, setCreatingTokenId] = useState<number | null>(null)

  const handleCreateToken = async (shipment: ShipmentForToken) => {
    setCreatingTokenId(shipment.shipmentId)
    try {
      const response = await tokenApi.createToken(shipment.shipmentId)
      if (response.success) {
        toast.success(response.message || "Token created successfully", {
          description: `Token No: ${response.data.tokenNo} | Gate PIN: ${response.data.gatePin}`
        })
        refresh()
      } else {
        toast.error(response.message || "Failed to create token")
      }
    } catch (error) {
      toast.error("Failed to create token")
    } finally {
      setCreatingTokenId(null)
    }
  }

  const columns: ColumnDef<ShipmentForToken>[] = [
    {
      accessorKey: "orderNo",
      header: "ORDER",
      cell: ({ row }) => (
        <span className="order-no">{row.original.orderNo}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "CUSTOMER",
      cell: ({ row }) => (
        <span className="customer-name">{row.original.customerName}</span>
      ),
    },
    {
      accessorKey: "productName",
      header: "PRODUCT",
      cell: ({ row }) => (
        <span className="product-name">{row.original.productName}</span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "QUANTITY",
      cell: ({ row }) => (
        <span className="quantity">{row.original.quantity.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "transportType",
      header: "TRANSPORT TYPE",
      cell: ({ row }) => (
        <span className={`transport-badge transport-${row.original.transportType.toLowerCase()}`}>
          {row.original.transportType}
        </span>
      ),
    },
    {
      id: "actions",
      header: "ACTION",
      cell: ({ row }) => {
        const shipment = row.original
        const isCreating = creatingTokenId === shipment.shipmentId
        
        return (
          <button
            className="btn btn-primary btn-create-token"
            onClick={() => handleCreateToken(shipment)}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <RefreshCw className="spin" size={14} />
                Creating...
              </>
            ) : (
              <>
                <Key size={14} />
                Create Token
              </>
            )}
          </button>
        )
      },
    },
  ]

  return (
    <div className="create-token-tab">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        title="Create Token"
        subtitle="Generate tokens for shipments ready for gate entry"
        searchPlaceholder="Search orders..."
        icon={<Key size={18} />}
        pageSize={pageSize}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={fetchPage}
      />
    </div>
  )
}