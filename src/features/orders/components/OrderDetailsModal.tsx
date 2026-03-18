import { useOrderQuery } from "../hooks/use-order-query"
import { useOrderTrackingQuery } from "../hooks/use-order-tracking-query"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

import {
  Check,
  ClipboardCheck,
  Ticket,
  MapPin,
  Package,
  FileText,
  LogOut,
  Truck,
  MapPinned,
  CheckCircle
} from "lucide-react"

import "./order-detail-staff.css"
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
export default function OrderDetailsModal({
  orderId,
  onClose
}:{
  orderId:number
  onClose:()=>void
}) {

  const { data: order, isLoading } = useOrderQuery(orderId)
  const { data: tracking = [] } = useOrderTrackingQuery(orderId)

  if (isLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal modal-xl">
          <Skeleton height={30} width={220}/>
          <div style={{marginTop:20}}>
            <Skeleton height={200}/>
          </div>
        </div>
      </div>
    )
  }

  if (!order) return null

  const item = order.items?.[0]

  const timelineSteps = [
    { key: "Submitted", label: "Order Submitted", icon: Check },
    { key: "Approved", label: "Approved", icon: ClipboardCheck },
    { key: "TokenIssued", label: "Token Issued", icon: Ticket },
    { key: "ZoneAssigned", label: "Zone Assigned", icon: MapPin },
    { key: "Loading", label: "Loading", icon: Package },
    { key: "Weighing", label: "Weighing", icon: Package },
    { key: "VoucherReady", label: "Voucher Ready", icon: FileText },
    { key: "GateExit", label: "Gate Out", icon: LogOut },
    { key: "InTransit", label: "In Transit", icon: Truck },
    { key: "Arrived", label: "Arrived", icon: MapPinned },
    { key: "Delivered", label: "Delivered", icon: CheckCircle }
  ]


  return (
    <div className="modal-overlay" onClick={onClose}>

      <div
        className="modal modal-xl"
        onClick={(e)=>e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="modal-header">

          <div>
            <h2 className="modal-title">
              Order ORD-{2000 + order.id}
            </h2>
    
            <span className={`status-badge ${getStatusClass(order.status)}`}>
                {order.status}
                </span>

          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>


        {/* BODY */}

        <div className="modal-body modal-layout">

          {/* LEFT SIDE */}

          <div className="order-details">

            <h3 className="section-title">
              Order Details
            </h3>

            <div className="info-row">
              <span>Customer:</span>
              <strong>{order.customerName ?? "-"}</strong>
            </div>

            <div className="info-row">
              <span>Product:</span>
              <strong>{item?.productName}</strong>
            </div>

            <div className="info-row">
              <span>Quantity:</span>
              <strong>{item?.quantity}</strong>
            </div>

            <div className="info-row">
              <span>Amount:</span>
              <strong>AED {order.totalAmount}</strong>
            </div>

            <div className="info-row">
              <span>Transport:</span>
              <strong>{order.transportType}</strong>
            </div>

            <div className="info-row">
              <span>Address:</span>
              <strong>{order.deliveryAddress}</strong>
            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="tracking-timeline">

            <h3 className="section-title">
              Tracking Timeline
            </h3>

            <div className="timeline-vertical">

              {timelineSteps.map((step,index)=>{

                const currentIndex = timelineSteps.findIndex(s => s.key === order.status)

                const completed = index < currentIndex
                const current = index === currentIndex

                return(
                    <div key={step.key} className="timeline-row">

                    <div className="timeline-marker">

                        <div
                        className={`timeline-dot
                        ${completed ? "done":""}
                        ${current ? "active":""}
                        `}
                        />

                        {index !== timelineSteps.length-1 && (
                        <div className="timeline-bar"/>
                        )}

                    </div>

                    <span className="timeline-text">
                        {step.label}
                    </span>

                    </div>
                )

                })}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}