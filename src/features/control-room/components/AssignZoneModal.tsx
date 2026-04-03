import { useState, useEffect } from "react"
import { X, MapPin } from "lucide-react"
import { toast } from "sonner"
import { controlBoardApi } from "../api/control-board.api"
import type { Zone, LoadingPoint, Weighbridge, ControlBoardItem } from "../types/control-board.types"

interface AssignZoneModalProps {
  token: ControlBoardItem
  onClose: () => void
  onSuccess: () => void
}

export function AssignZoneModal({ token, onClose, onSuccess }: AssignZoneModalProps) {
  const [zones, setZones] = useState<Zone[]>([])
  const [loadingPoints, setLoadingPoints] = useState<LoadingPoint[]>([])
  const [weighbridges, setWeighbridges] = useState<Weighbridge[]>([])
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null)
  const [selectedLoadingPoint, setSelectedLoadingPoint] = useState<number | null>(null)
  const [selectedWeighbridge, setSelectedWeighbridge] = useState<number | null>(null)
  const [isLoadingZones, setIsLoadingZones] = useState(true)
  const [isLoadingPoints, setIsLoadingPoints] = useState(false)
  const [isLoadingWeighbridges, setIsLoadingWeighbridges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const data = await controlBoardApi.getZones()
        setZones(data)
      } catch (error) {
        toast.error("Failed to load zones")
      } finally {
        setIsLoadingZones(false)
      }
    }
    fetchZones()
  }, [])

  useEffect(() => {
    const fetchLoadingPoints = async () => {
      if (!selectedZoneId) {
        setLoadingPoints([])
        setSelectedLoadingPoint(null)
        return
      }
      
      setIsLoadingPoints(true)
      try {
        const data = await controlBoardApi.getLoadingPoints(String(selectedZoneId))
        setLoadingPoints(data)
      } catch (error) {
        toast.error("Failed to load loading points")
      } finally {
        setIsLoadingPoints(false)
      }
    }
    fetchLoadingPoints()
  }, [selectedZoneId])

  useEffect(() => {
    const fetchWeighbridges = async () => {
      if (!selectedZoneId) {
        setWeighbridges([])
        setSelectedWeighbridge(null)
        return
      }
      
      setIsLoadingWeighbridges(true)
      try {
        const data = await controlBoardApi.getWeighbridges(String(selectedZoneId))
        setWeighbridges(data)
        // Auto-select first weighbridge if only one exists
        if (data.length === 1) {
          setSelectedWeighbridge(data[0].id)
        }
      } catch (error) {
        toast.error("Failed to load weighbridges")
      } finally {
        setIsLoadingWeighbridges(false)
      }
    }
    fetchWeighbridges()
  }, [selectedZoneId])

  const handleSubmit = async () => {
    if (!selectedZoneId || !selectedLoadingPoint || !selectedWeighbridge) {
      toast.error("Please select zone, loading point, and weighbridge")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await controlBoardApi.assignZone({
        tokenId: token.tokenId,
        zoneId: selectedZoneId,
        loadingPointId: selectedLoadingPoint,
        weighbridgeId: selectedWeighbridge
      })

      if (response.success) {
        toast.success("Zone assigned successfully")
        onSuccess()
      } else {
        toast.error(response.message || "Failed to assign zone")
      }
    } catch (error) {
      toast.error("Failed to assign zone")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <div className="modal-header">
          <h3>
            <MapPin size={20} />
            Assign Zone & Loading Point
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="token-info" style={{ 
            padding: "12px", 
            background: "var(--bg-secondary)", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Token: <strong>{token.tokenNo}</strong>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Truck: <strong>{token.truck}</strong> | Driver: <strong>{token.driver}</strong>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="zone">Zone *</label>
            {isLoadingZones ? (
              <div className="loading-text">Loading zones...</div>
            ) : (
              <select
                id="zone"
                value={selectedZoneId || ""}
                onChange={(e) => {
                  setSelectedZoneId(e.target.value ? Number(e.target.value) : null)
                  setSelectedLoadingPoint(null)
                  setSelectedWeighbridge(null)
                }}
                className="form-control"
              >
                <option value="">Select Zone</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="loadingPoint">Loading Point *</label>
            {isLoadingPoints ? (
              <div className="loading-text">Loading...</div>
            ) : (
              <select
                id="loadingPoint"
                value={selectedLoadingPoint || ""}
                onChange={(e) => setSelectedLoadingPoint(e.target.value ? Number(e.target.value) : null)}
                className="form-control"
                disabled={!selectedZoneId}
              >
                <option value="">Select Loading Point</option>
                {loadingPoints.map((lp) => (
                  <option key={lp.id} value={lp.id}>
                    {lp.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="weighbridge">Weighbridge *</label>
            {isLoadingWeighbridges ? (
              <div className="loading-text">Loading...</div>
            ) : (
              <select
                id="weighbridge"
                value={selectedWeighbridge || ""}
                onChange={(e) => setSelectedWeighbridge(e.target.value ? Number(e.target.value) : null)}
                className="form-control"
                disabled={!selectedZoneId}
              >
                <option value="">Select Weighbridge</option>
                {weighbridges.map((wb) => (
                  <option key={wb.id} value={wb.id}>
                    {wb.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedZoneId || !selectedLoadingPoint || !selectedWeighbridge}
          >
            {isSubmitting ? "Assigning..." : "Assign Zone"}
          </button>
        </div>
      </div>
    </div>
  )
}