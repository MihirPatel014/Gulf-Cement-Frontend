import { Link, useParams } from "@tanstack/react-router";
import { useOrderQuery } from "../hooks/use-order-query";
import { useOrderTrackingQuery } from "../hooks/use-order-tracking-query";
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Check, ClipboardCheck, Ticket, MapPin, Package, FileText, LogOut, Truck, MapPinned, CheckCircle, Clock } from "lucide-react";
import "./order-details.css";
import { formatDate } from "../../../lib/utils/date";
export default function OrderDetailsPage() {
  const { orderId } = useParams({ from: "/orders/$orderId" });

  const { data: order, isLoading } = useOrderQuery(Number(orderId));
  useOrderTrackingQuery(Number(orderId));

 if (isLoading) {
  return (
    <div className="order-details-page">

      <Skeleton width={120} height={20} />

      <h1 className="order-title">
        <Skeleton width={220} height={32} />
      </h1>

      <p className="order-meta">
        <Skeleton width={260} />
      </p>

      {/* Timeline Skeleton */}
      <div className="card">
        <h3 className="card-title">
          <Skeleton width={200} height={20} />
        </h3>

        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} circle width={30} height={30} />
          ))}
        </div>
      </div>

      {/* Order Info Skeleton */}
      <div className="details-grid">
        <div className="card">
          <h3 className="card-title">
            <Skeleton width={180} height={20} />
          </h3>

          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="info-row"
              style={{ marginTop: 12 }}
            >
              <Skeleton width={120} />
              <Skeleton width={160} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
  if (!order) return <div>Order not found</div>;

  const item = order.items?.[0];
  const timelineSteps = [
  { key: "Submitted", label: "Order Submitted", icon: Check },
  { key: "Approved", label: "Dispatch Approved", icon: ClipboardCheck },
  { key: "TokenIssued", label: "Token Issued", icon: Ticket },
  { key: "ZoneAssigned", label: "Zone Assigned", icon: MapPin },
  { key: "Loading", label: "Loading", icon: Package },
  { key: "VoucherReady", label: "Voucher Ready", icon: FileText },
  { key: "GateExit", label: "Gate Exit", icon: LogOut },
  { key: "InTransit", label: "In Transit", icon: Truck },
  { key: "Arrived", label: "Arrived at Site", icon: MapPinned },
  { key: "Delivered", label: "Delivered", icon: CheckCircle },
];

const currentIndex = timelineSteps.findIndex(
  (s) => s.key === order.status
);
  return (
    <div className="order-details-page">

      <Link to="/orders" className="back-link">
        ← Back to Orders
      </Link>

      <h1 className="order-title">Order ORD-{2000 + order.id}</h1>

      <p className="order-meta">
        <p className="order-meta">
  Placed {formatDate(order.orderDate)} • {order.status}
</p>
      </p>

      {/* Timeline */}
      <div className="card">
        <h3 className="card-title"><Clock size={16} />Order Tracking Timeline</h3>

        <div className="timeline">
  {timelineSteps.map((step, index) => {
    const completed = index < currentIndex;
    const current = index === currentIndex;

    const Icon = step.icon;

    return (
      <div key={step.key} className="timeline-item">

        <div
          className={`timeline-circle 
          ${completed ? "completed" : ""}
          ${current ? "current" : ""}
        `}
        >
          <Icon size={14} />
        </div>

        {index !== timelineSteps.length - 1 && (
          <div
            className={`timeline-line ${
              index < currentIndex ? "completed" : ""
            }`}
          />
        )}

        <span className="timeline-label">{step.label}</span>
      </div>
    );
  })}
</div>
      </div>

      <div className="details-grid">

        {/* Order Info */}
        <div className="card">
          <h3 className="card-title"><Package size={16} />Order Information</h3>

          <div className="info-row">
            <span>Order ID</span>
            <span>ORD-{2000 + order.id}</span>
          </div>

          <div className="info-row">
            <span>Product</span>
            <span>{item?.productName}</span>
          </div>

          <div className="info-row">
            <span>Quantity</span>
            <span>{item?.quantity}</span>
          </div>

          <div className="info-row">
            <span>Packaging</span>
            <span>{item?.packaging}</span>
          </div>

          <div className="info-row">
            <span>Amount</span>
            <span className="amount">AED {order.totalAmount}</span>
          </div>

          <div className="info-row">
            <span>Transport</span>
            <span>{order.transportType}</span>
          </div>

          <div className="info-row">
            <span>Delivery To</span>
            <span>{order.deliveryAddress}</span>
          </div>

          <div className="info-row">
            <span>Preferred Date</span>
            <span>{formatDate(order.preferredDeliveryDate)}</span>
          </div>
        </div>


      </div>
    </div>
  );
}