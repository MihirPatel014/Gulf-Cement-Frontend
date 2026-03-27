import { useState, useEffect } from "react"
import { X, Truck } from "lucide-react"
import { orderApiService } from "../../../services/adapters/orders.api"
import { transportApi } from "../../../features/transport/api/transport.api"
import { toast } from "sonner"

type ShipmentItem = {
  orderItemId: number
  productName: string
  quantity: number
}

type Driver = {
  id: number
  fullName: string
}

type Vehicle = {
  id: number
  plateNumber: string
  vehicleType: string
  model: string | null
}

type ShipmentModalProps = {
  orderId: number
  orderNo: string

  // IMPORTANT (comes from order)
  transportType: string
  vehicleNumber?: string
  driverName?: string
  driverMobile?: string

  items: ShipmentItem[]
  onClose: () => void
  onSuccess: () => void
}

export function CreateShipmentModal({
  orderId,
  orderNo,
  transportType,
  vehicleNumber,
  driverName,
  driverMobile,
  items,
  onClose,
  onSuccess
}: ShipmentModalProps) {

  const [vehicleId, setVehicleId] = useState<number | undefined>()
  const [driverId, setDriverId] = useState<number | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)

  // ✅ Load only for company transport
  useEffect(() => {
    if (transportType !== "Company") return

    const fetchOptions = async () => {
      try {
        const [driversData, vehiclesData] = await Promise.all([
          transportApi.getDrivers(),
          transportApi.getVehicles()
        ])
        setDrivers(driversData || [])
        setVehicles(vehiclesData || [])
      } catch (error) {
        console.error("Failed to fetch drivers/vehicles:", error)
      } finally {
        setIsLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [transportType])

  const shipmentItems = items.map((item) => ({
    orderItemId: item.orderItemId,
    quantity: item.quantity,
  }))

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const payload: any = {
        orderId,
        transportType,
        items: shipmentItems,
      }

      // ✅ Only for company
      if (transportType === "Company") {
        if (!vehicleId || !driverId) {
          toast.error("Please select vehicle and driver")
          setIsSubmitting(false)
          return
        }

        payload.vehicleId = vehicleId
        payload.driverId = driverId
      }

      console.log("Shipment Payload:", payload)

      await orderApiService.createShipment(payload)

      toast.success(`Shipment created successfully for order ${orderNo}`)
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create shipment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 500 }}
      >
        <div className="modal-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Truck size={20} />
            Create Shipment - {orderNo}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">

          {/* ✅ READONLY TRANSPORT TYPE */}
          <div className="form-group">
            <label>Transport Type</label>
            <input value={transportType} className="form-input" disabled />
          </div>

          {/* ✅ COMPANY TRANSPORT */}
          {transportType === "Company" && (
            <>
              <div className="form-group">
                <label>Vehicle</label>
                {isLoadingOptions ? (
                  <select className="form-input" disabled>
                    <option>Loading vehicles...</option>
                  </select>
                ) : (
                  <select
                    value={vehicleId || ""}
                    onChange={(e) =>
                      setVehicleId(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="form-input"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleType}
                        {v.model ? ` - ${v.model}` : ""} - {v.plateNumber}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label>Driver</label>
                {isLoadingOptions ? (
                  <select className="form-input" disabled>
                    <option>Loading drivers...</option>
                  </select>
                ) : (
                  <select
                    value={driverId || ""}
                    onChange={(e) =>
                      setDriverId(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="form-input"
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </>
          )}

          {/* ✅ CUSTOMER TRANSPORT (READ ONLY) */}
          {transportType === "Customer" && (
            <>
              <div className="form-group">
                <label>Vehicle Number</label>
                <input
                  value={vehicleNumber || "-"}
                  className="form-input"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Driver Name</label>
                <input
                  value={driverName || "-"}
                  className="form-input"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Driver Mobile</label>
                <input
                  value={driverMobile || "-"}
                  className="form-input"
                  disabled
                />
              </div>
            </>
          )}

          {/* ITEMS */}
          <div className="form-group">
            <label>Items to Ship</label>
            <div style={{ marginTop: 8 }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "var(--bg-light)",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                >
                  <span>{item.productName}</span>
                  <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </div>
    </div>
  )
}