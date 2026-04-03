import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { LayoutDashboard, MapPin, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "../../../components/ui/DataTable"
import { AssignZoneModal } from "./AssignZoneModal"
import { useControlBoard } from "../hooks/use-control-board"
import type { ControlBoardItem } from "../types/control-board.types"
import "./control-board-tab.css"

function getStageBadgeClass(stage: string) {
  switch (stage) {
    case "TokenIssued":
      return "badge-blue"
    case "ZoneAssigned":
      return "badge-purple"
    case "Loading":
      return "badge-yellow"
    case "Weighing":
      return "badge-orange"
    case "VoucherReady":
      return "badge-teal"
    case "GateExit":
      return "badge-indigo"
    default:
      return "badge-gray"
  }
}

export function ControlBoardTab() {
  const { data, totalCount, isLoading, currentPage, pageSize, fetchPage, refresh } = useControlBoard()
  const [selectedToken, setSelectedToken] = useState<ControlBoardItem | null>(null)

  const handleAssignZone = (token: ControlBoardItem) => {
    setSelectedToken(token)
  }

  const handleModalClose = () => {
    setSelectedToken(null)
  }

  const handleSuccess = () => {
    setSelectedToken(null)
    refresh()
    toast.success("Zone assigned successfully")
  }

  const columns: ColumnDef<ControlBoardItem>[] = [
    {
      accessorKey: "tokenNo",
      header: "TOKEN",
      cell: ({ row }) => (
        <span className="token-no">{row.original.tokenNo}</span>
      ),
    },
    {
      accessorKey: "truck",
      header: "TRUCK",
      cell: ({ row }) => (
        <span className="truck-info">{row.original.truck}</span>
      ),
    },
    {
      accessorKey: "driver",
      header: "DRIVER",
      cell: ({ row }) => (
        <span className="driver-info">{row.original.driver}</span>
      ),
    },
    {
      accessorKey: "customer",
      header: "CUSTOMER",
      cell: ({ row }) => (
        <span className="customer-info">{row.original.customer}</span>
      ),
    },
    {
      accessorKey: "product",
      header: "PRODUCT",
      cell: ({ row }) => (
        <span className="product-info">{row.original.product}</span>
      ),
    },
    {
      accessorKey: "zone",
      header: "ZONE",
      cell: ({ row }) => {
        const token = row.original
        if (token.zone) {
          return <span className="zone-assigned">{token.zone}</span>
        }
        return (
          <button
            className="btn btn-primary btn-assign-zone"
            onClick={() => handleAssignZone(token)}
          >
            <MapPin size={14} />
            Assign Zone
          </button>
        )
      },
    },
    {
      accessorKey: "loadingPoint",
      header: "LOADING POINT",
      cell: ({ row }) => (
        <span className="loading-point">
          {row.original.loadingPoint || "-"}
        </span>
      ),
    },
    {
      accessorKey: "weighbridge",
      header: "WEIGHBRIDGE",
      cell: ({ row }) => (
        <span className="weighbridge">
          {row.original.weighbridge || "-"}
        </span>
      ),
    },
    {
      accessorKey: "stage",
      header: "STAGE",
      cell: ({ row }) => (
        <span className={`stage-badge ${getStageBadgeClass(row.original.stage)}`}>
          {row.original.stage}
        </span>
      ),
    },
  ]

  return (
    <div className="control-board-tab">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        title="Control Board"
        subtitle="Monitor and manage token assignments"
        searchPlaceholder="Search tokens..."
        icon={<LayoutDashboard size={18} />}
        pageSize={pageSize}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={fetchPage}
        headerActions={
          <button className="btn btn-refresh" onClick={refresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      {selectedToken && (
        <AssignZoneModal
          token={selectedToken}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}