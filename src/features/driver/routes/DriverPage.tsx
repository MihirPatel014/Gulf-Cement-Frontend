import { useState, useEffect, useCallback } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { RefreshCw, CheckCircle, Clock, X, MapPin, Package, Truck as TruckIcon } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '../../../components/ui/DataTable'
import { driverApi } from '../api/driver.api'
import type { DriverTrip } from '../types/driver.types'
import './driver-page.css'

function getStageBadgeClass(stage: string) {
  switch (stage) {
    case 'InTransit':
      return 'badge-blue'
    case 'Arrived':
      return 'badge-green'
    default:
      return 'badge-gray'
  }
}

export const DriverPage: React.FC = () => {
  const [trips, setTrips] = useState<DriverTrip[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<DriverTrip | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMarkingArrived, setIsMarkingArrived] = useState(false)
  const [filterStage, setFilterStage] = useState<string>('all')

  const tripCounts = {
    ready: trips.filter(t => t.stage === 'Ready').length,
    intransit: trips.filter(t => t.stage === 'InTransit').length,
    arrived: trips.filter(t => t.stage === 'Arrived').length,
    delivered: trips.filter(t => t.stage === 'Delivered').length,
  }

  const filteredTrips = filterStage === 'all' 
    ? trips 
    : trips.filter(t => t.stage === filterStage)

  const fetchTrips = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await driverApi.getDriverTrips()
      const data = (response as any).data !== undefined 
        ? (response as { data: DriverTrip[] }).data 
        : response as unknown as DriverTrip[]
      setTrips(data || [])
    } catch (error) {
      toast.error('Failed to fetch driver trips')
      console.error(error)
      setTrips([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  const handleOpenDetails = (trip: DriverTrip) => {
    setSelectedTrip(trip)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTrip(null)
  }

  const handleMarkArrived = async () => {
    if (!selectedTrip) return
    
    setIsMarkingArrived(true)
    try {
      const result = await driverApi.markArrived(selectedTrip.tokenId, 0)
      if (result.success) {
        const message = result.message || 'Marked as arrived successfully!'
        toast.success(message)
        handleCloseModal()
        fetchTrips()
      } else {
        toast.error(result.message || 'Failed to mark arrival')
      }
    } catch (error: any) {
      const errorResult = error as { success: boolean; message?: string }
      if (errorResult && errorResult.success === false) {
        toast.error(errorResult.message || 'Failed to mark arrival')
      } else {
        toast.error('Failed to mark arrival')
      }
    } finally {
      setIsMarkingArrived(false)
    }
  }

  const columns: ColumnDef<DriverTrip>[] = [
    {
      accessorKey: 'tokenNo',
      header: 'TOKEN NO',
      cell: ({ row }) => <span className="token-no">{row.original.tokenNo}</span>,
    },
    {
      accessorKey: 'truck',
      header: 'TRUCK',
      cell: ({ row }) => <span className="truck-info">{row.original.truck}</span>,
    },
    {
      accessorKey: 'customer',
      header: 'CUSTOMER',
      cell: ({ row }) => <span className="customer-info">{row.original.customer}</span>,
    },
    {
      accessorKey: 'product',
      header: 'PRODUCT',
      cell: ({ row }) => <span className="product-info">{row.original.product}</span>,
    },
    {
      accessorKey: 'destination',
      header: 'DESTINATION',
      cell: ({ row }) => (
        <span className="destination-info">
          <MapPin size={14} style={{ marginRight: '4px', display: 'inline-flex' }} />
          {row.original.destination}
        </span>
      ),
    },
    {
      accessorKey: 'stage',
      header: 'STAGE',
      cell: ({ row }) => (
        <span className={`badge ${getStageBadgeClass(row.original.stage)}`}>
          {row.original.stage === 'InTransit' && <Clock size={14} />}
          {row.original.stage === 'Arrived' && <CheckCircle size={14} />}
          {row.original.stage}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'ACTION',
      cell: ({ row }) => (
        <button 
          className="btn-open"
          onClick={() => handleOpenDetails(row.original)}
        >
          Open
        </button>
      ),
    },
  ]

  return (
    <div className="p-2">
      <div className="page-header">
        <h1 className="page-title">Driver Mode</h1>
        <p className="page-subtitle">Gulf Cement Operations - Driver Interface</p>
      </div>
      <div className="stats-cards">
          <div className={`stat-card ${filterStage === 'Ready' ? 'active' : ''}`} onClick={() => setFilterStage('Ready')}>
            <div className="stat-icon ready"><Package size={20} /></div>
            <div className="stat-info">
              <span className="stat-count">{tripCounts.ready}</span>
              <span className="stat-label">Ready for Trip</span>
            </div>
          </div>
          <div className={`stat-card ${filterStage === 'InTransit' ? 'active' : ''}`} onClick={() => setFilterStage('InTransit')}>
            <div className="stat-icon intransit"><TruckIcon size={20} /></div>
            <div className="stat-info">
              <span className="stat-count">{tripCounts.intransit}</span>
              <span className="stat-label">In Transit</span>
            </div>
          </div>
          <div className={`stat-card ${filterStage === 'Arrived' ? 'active' : ''}`} onClick={() => setFilterStage('Arrived')}>
            <div className="stat-icon arrived"><CheckCircle size={20} /></div>
            <div className="stat-info">
              <span className="stat-count">{tripCounts.arrived}</span>
              <span className="stat-label">Arrived</span>
            </div>
          </div>
          <div className={`stat-card ${filterStage === 'Delivered' ? 'active' : ''}`} onClick={() => setFilterStage('Delivered')}>
            <div className="stat-icon delivered"><Clock size={20} /></div>
            <div className="stat-info">
              <span className="stat-count">{tripCounts.delivered}</span>
              <span className="stat-label">Delivered</span>
            </div>
          </div>
        </div>
      <div className="driver-container">
        
        <div className="driver-header">
          <h2>My Trips {filterStage !== 'all' && `(${filterStage})`}</h2>
          <div className="header-actions">
            {filterStage !== 'all' && (
              <button className="clear-filter" onClick={() => setFilterStage('all')}>
                <X size={16} /> Clear Filter
              </button>
            )}
            <button 
              className="refresh-button"
              onClick={fetchTrips}
              disabled={isLoading}
            >
              <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <DataTable<DriverTrip>
          columns={columns}
          data={filteredTrips}
          isLoading={isLoading}
          pageSize={10}
        />
      </div>

      {isModalOpen && selectedTrip && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trip Details</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <label>Token No</label>
                <span>{selectedTrip.tokenNo}</span>
              </div>
              <div className="detail-row">
                <label>Truck</label>
                <span>{selectedTrip.truck}</span>
              </div>
              <div className="detail-row">
                <label>Customer</label>
                <span>{selectedTrip.customer}</span>
              </div>
              <div className="detail-row">
                <label>Product</label>
                <span>{selectedTrip.product}</span>
              </div>
              <div className="detail-row">
                <label>Destination</label>
                <span>{selectedTrip.destination}</span>
              </div>
              <div className="detail-row">
                <label>Stage</label>
                <span className={`badge ${getStageBadgeClass(selectedTrip.stage)}`}>
                  {selectedTrip.stage}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              {selectedTrip.stage === 'InTransit' ? (
                <button 
                  className="btn-arrived"
                  onClick={handleMarkArrived}
                  disabled={isMarkingArrived}
                >
                  {isMarkingArrived ? 'Processing...' : 'I have arrived'}
                </button>
              ) : (
                <div className="waiting-otp">
                  <Clock size={18} />
                  <span>Waiting for customer OTP confirmation</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}