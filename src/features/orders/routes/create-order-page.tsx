import { useState } from "react";
import { orderApiService } from "../../../services/adapters/orders.api";
import { useProductsQuery } from "../../products/hooks/use-products-query";
import {
  ShoppingCart,
  Truck,
  MapPin,
  FileText,
  CheckCircle,ArrowLeft
} from "lucide-react";
import "./create-order-page.css";
import { useNavigate } from "@tanstack/react-router"

type OrderItem = {
  productId: string
  quantity: string
  packaging: string
}

export default function CreateOrderPage() {

  const { data: productsData } = useProductsQuery({ pageSize: 100 });
  const products = productsData?.data ?? [];

  const [items, setItems] = useState<OrderItem[]>([
    { productId: "", quantity: "", packaging: "" }
  ])

  const [form, setForm] = useState({
  transportType: "Company",

  deliveryAddress: "",
  city: "",
  latitude: "",
  longitude: "",

  preferredDeliveryDate: "",
  remarks: "",
  vehicleNumber: "",
  driverName: "",
  driverMobile: "",
  vehicleArrivalTime: "",
  estimatedArrivalAtPlant: ""
})
  const [addressMode, setAddressMode] = useState<"saved" | "new">("saved")

  const getUnit = (packaging: string) =>
    packaging === "Bulk" ? "MT" : packaging === "Bags" ? "bag" : ""

  const getProduct = (productId: string) => products.find(p => p.id === Number(productId))

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const product = getProduct(item.productId)
      if (product && item.quantity) {
        return sum + product.price * Number(item.quantity)
      }
      return sum
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const navigate = useNavigate()
  const vat = subtotal * 0.05
  const total = subtotal + vat

  const handleItemChange = (index: number, field: keyof OrderItem, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Auto-set packaging when product is selected
    if (field === "productId") {
      const product = getProduct(value)
      newItems[index].packaging = product?.packaging || ""
    }
    
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { productId: "", quantity: "", packaging: "" }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {

    // Filter out empty items
    const validItems = items.filter(item => item.productId && item.quantity)

    if (validItems.length === 0) {
      alert("Please add at least one product")
      return
    }

    const payload = {
  items: validItems.map(item => {
    const product = getProduct(item.productId)
    return {
      productId: Number(item.productId),
      quantity: Number(item.quantity),
      packaging: product?.packaging || ""
    }
  }),

  transportType: form.transportType,

  deliveryAddress:
    addressMode === "saved"
      ? form.deliveryAddress
      : `${form.deliveryAddress}, ${form.city} (${form.latitude}, ${form.longitude})`,

  preferredDeliveryDate: form.preferredDeliveryDate,
  remarks: form.remarks || undefined,

  vehicleNumber: form.vehicleNumber || undefined,
  driverName: form.driverName || undefined,
  driverMobile: form.driverMobile || undefined,

  vehicleArrivalTime: form.vehicleArrivalTime
    ? `${form.vehicleArrivalTime}:00`
    : undefined,

  estimatedArrivalAtPlant: form.estimatedArrivalAtPlant || undefined
}

    await orderApiService.createOrder(payload)

    alert("Order created successfully")
  }

  return (
    <div className="page">

      {/* HEADER */}
     <div className="page-header">

        <button
            className="back-link"
            onClick={() =>
            navigate({ to: "/orders" })
            }
        >
            <ArrowLeft size={16}/>
            Back to Orders
        </button>

        <h1 className="page-title">Place New Order</h1>

        <p className="page-subtitle">
            Fill in the details below to submit a cement order
        </p>

        </div>
      <div className="create-order-layout">

        {/* LEFT SIDE */}
        <div className="card">

          <div className="card-header">
            <h3><ShoppingCart size={18}/> Order Details</h3>
          </div>

          {/* PRODUCTS */}
          <div className="form-group">
            <label className="form-label">Products *</label>

            {items.map((item, index) => {
              const unit = getUnit(item.packaging)
              
              return (
                <div key={index} className="order-item-row">
                  <div className="item-fields">
                    <select
                      className="form-select"
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                    >
                      <option value="">Select product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — AED {p.price}/{p.packaging === "Bulk" ? "MT" : "bag"}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      className="form-input"
                      placeholder={`Qty (${unit})`}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    />

                    <span className="packaging-label">{item.packaging || "-"}</span>
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeItem(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              )
            })}

            <button
              type="button"
              className="add-item-btn"
              onClick={addItem}
            >
              + Add Another Product
            </button>
          </div>

          {/* TRANSPORT */}
          <div className="form-group">
            <label className="form-label">Transport Option *</label>

            <div className="transport-grid">

              <label className={`transport-card ${form.transportType==="Company"?"active":""}`}>
                <input
                  type="radio"
                  checked={form.transportType==="Company"}
                  onChange={()=>handleChange("transportType","Company")}
                />
                <Truck size={16}/>
                Company Transport
              </label>

              <label className={`transport-card ${form.transportType==="Customer"?"active":""}`}>
                <input
                  type="radio"
                  checked={form.transportType==="Customer"}
                  onChange={()=>handleChange("transportType","Customer")}
                />
                <Truck size={16}/>
                Customer Own Transport
              </label>

            </div>
          </div>

          {/* OWN TRANSPORT */}
          {form.transportType==="Customer" && (

            <div className="inner-card">

              <h4><Truck size={16}/> Own Transport Details</h4>

              <div className="form-row">

                <div className="form-group">
                  <label className="form-label">Vehicle Number</label>

                  <input
                    className="form-input"
                    placeholder="e.g. DXB-4521"
                    value={form.vehicleNumber}
                    onChange={(e)=>handleChange("vehicleNumber", e.target.value)}
                    />
                </div>

                <div className="form-group">
                  <label className="form-label">Driver Name</label>

                 <input
                    className="form-input"
                    placeholder="Driver full name"
                    value={form.driverName}
                    onChange={(e)=>handleChange("driverName", e.target.value)}
                    />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label className="form-label">Driver Mobile</label>

                  <input
                    className="form-input"
                    placeholder="+971-55-XXXXXXX"
                    value={form.driverMobile}
                    onChange={(e)=>handleChange("driverMobile", e.target.value)}
                    />
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Arrival Time</label>

                  <input
                    type="time"
                    className="form-input"
                    value={form.vehicleArrivalTime}
                    onChange={(e)=>handleChange("vehicleArrivalTime", e.target.value)}
                  />
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Estimated Arrival at Plant *
                    </label>

                    <input
                        type="datetime-local"
                        className="form-input"
                        value={form.estimatedArrivalAtPlant}
                        onChange={(e)=>handleChange("estimatedArrivalAtPlant", e.target.value)}
                    />
                    </div>
              </div>

            </div>

          )}

          <div className="section-title">
  <MapPin size={16}/> Delivery Address
</div>

<div className="address-toggle">

  <button
    type="button"
    className={`address-btn ${addressMode==="saved" ? "active" : ""}`}
    onClick={()=>setAddressMode("saved")}
  >
    Saved Address
  </button>

  <button
    type="button"
    className={`address-btn ${addressMode==="new" ? "active" : ""}`}
    onClick={()=>setAddressMode("new")}
  >
    + New Address
  </button>

</div>

{addressMode === "saved" && (

  <select
  className="form-select"
  value={form.deliveryAddress}
  onChange={(e) => handleChange("deliveryAddress", e.target.value)}
>
  <option value="">Select Address</option>

  <option value="Al Quoz Warehouse — Dubai (25.15, 55.24)">
    Al Quoz Warehouse — Dubai (25.15, 55.24)
  </option>
</select>

)}

{addressMode === "new" && (

  <>
    <div className="form-row">

      <div className="form-group">
        <label className="form-label">City *</label>
        <input
        className="form-input"
        placeholder="e.g. Dubai"
        value={form.city || ""}
        onChange={(e)=>handleChange("city", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Full Address *</label>
        <input
            className="form-input"
            placeholder="Full delivery address"
            value={form.deliveryAddress}
            onChange={(e)=>handleChange("deliveryAddress", e.target.value)}
            />
      </div>

    </div>

    <div className="form-row">

      <div className="form-group">
        <label className="form-label">GPS Latitude</label>
       <input
            className="form-input"
            placeholder="25.1234"
            value={form.latitude || ""}
            onChange={(e)=>handleChange("latitude", e.target.value)}
            />
      </div>

      <div className="form-group">
        <label className="form-label">GPS Longitude</label>
        <input
            className="form-input"
            placeholder="55.1234"
            value={form.longitude || ""}
            onChange={(e)=>handleChange("longitude", e.target.value)}
            />
      </div>

    </div>
  </>

)}

<div className="form-group">
  <label className="form-label">Preferred Delivery Date *</label>

  <input
    type="date"
    className="form-input"
    value={form.preferredDeliveryDate}
    onChange={(e)=>handleChange("preferredDeliveryDate", e.target.value)}
  />
</div>
         

          {/* NOTES */}
          <div className="form-group">

            <label className="form-label">Notes</label>

            <textarea
              className="form-input"
              rows={3}
              value={form.remarks}
              onChange={(e)=>handleChange("remarks", e.target.value)}
            />

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div>

          <div className="summary-card">

  <div className="summary-header">
    <FileText size={18} />
    <span>Order Summary</span>
  </div>

  {items.some(i => i.productId) ? (
    <>

      {items.filter(i => i.productId).map((item, idx) => {
        const product = getProduct(item.productId)
        const unit = getUnit(item.packaging)
        const lineTotal = product ? product.price * Number(item.quantity) : 0
        
        return (
          <div key={idx} className="summary-row">
            <span>{product?.name} x{item.quantity} {unit}</span>
            <span>AED {lineTotal.toFixed(2)}</span>
          </div>
        )
      })}

      <div className="divider"/>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>AED {subtotal.toFixed(2)}</span>
      </div>

      <div className="summary-row">
        <span>VAT (5%)</span>
        <span>AED {vat.toFixed(2)}</span>
      </div>

      <div className="summary-total">
        <span>Total Estimate</span>
        <strong>AED {total.toFixed(2)}</strong>
      </div>

    </>
  ) : (

    <div className="summary-empty">
      <ShoppingCart size={28} />
      <p>Select a product to see price estimate</p>
    </div>

  )}

  <button className="summary-submit" onClick={handleSubmit}>
    <CheckCircle size={16}/>
    Submit Order
  </button>

  <p className="summary-note">
    Order will be sent to Dispatch Authority for approval
  </p>

</div>
        </div>

      </div>

    </div>
  )
}