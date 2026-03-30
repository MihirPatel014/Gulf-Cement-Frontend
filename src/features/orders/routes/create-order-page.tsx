import { useState, useEffect } from "react";
import { orderApiService } from "../../../services/adapters/orders.api";
import { useProductsQuery } from "../../products/hooks/use-products-query";
import { useCustomersQuery } from "../../customers/hooks/use-customers-query";
import { addressApiService, AddressDto } from "../../../services/adapters/addresses.api";
import { CustomerDto } from "../../../services/adapters/customers.api";
import {
  ShoppingCart,
  Truck,
  MapPin,
  FileText,
  CheckCircle, ArrowLeft, User
} from "lucide-react";
import "./create-order-page.css";
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner";
import { useNextSequenceQuery } from "../../common/hooks/use-next-sequence-number";
import { useVehiclesQuery } from "../../transport/hooks/use-vehicles-query";
import { useDriversQuery } from "../../driver/hooks/use-drivers-query";


type OrderItem = {
  productId: string
  quantity: string
  packaging: string
}

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const { data: productsData } = useProductsQuery({ pageSize: 100 });
  const { data: customersData } = useCustomersQuery({ pageSize: 1000 });
  const { data: nextOrderData } = useNextSequenceQuery("ORDER");

  const products = productsData?.data ?? [];
  const customers = (customersData as CustomerDto[]) ?? [];
  const nextOrderNumber = nextOrderData?.nextNumber || "Loading...";

  const [items, setItems] = useState<OrderItem[]>([
    { productId: "", quantity: "", packaging: "" }
  ])

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [customerAddresses, setCustomerAddresses] = useState<AddressDto[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  const [form, setForm] = useState({
    transportType: "Company",
    deliveryAddress: "",
    city: "",
    preferredDeliveryDate: "",
    remarks: "",
    vehicleNumber: "",
    driverName: "",
    driverMobile: "",
    vehicleArrivalTime: "",
    estimatedArrivalAtPlant: "",
    vehicleId: "",
    driverId: ""
  })
  const [addressMode, setAddressMode] = useState<"saved" | "new">("saved")

  const { data: vehiclesData } = useVehiclesQuery();
  const { data: driversData } = useDriversQuery();

  const vehicles = vehiclesData ?? [];
  const drivers = driversData ?? [];


  // Fetch addresses when customer changes
  useEffect(() => {
    if (selectedCustomerId) {
      const loadAddresses = async () => {
        setIsLoadingAddresses(true)
        try {
          const res = await addressApiService.getByEntity("CUSTOMER", Number(selectedCustomerId))
          setCustomerAddresses(res)
          const primary = res.find(a => a.isPrimary) || res[0]
          if (primary) {
            handleChange("deliveryAddress", primary.addressLine1)
            handleChange("city", primary.city)
          }
        } catch (err) {
          console.error("Failed to load addresses", err)
        } finally {
          setIsLoadingAddresses(false)
        }
      }
      loadAddresses()
    } else {
      setCustomerAddresses([])
    }
  }, [selectedCustomerId])

  const getProduct = (productId: string) => products.find(p => p.id === Number(productId))

  const subtotal = items.reduce((sum, item) => {
    const product = getProduct(item.productId)
    if (product && item.quantity) {
      return sum + product.price * Number(item.quantity)
    }
    return sum
  }, 0)

  const vat = subtotal * 0.05
  const total = subtotal + vat

  const handleItemChange = (index: number, field: keyof OrderItem, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === "productId") {
      const product = getProduct(value)
      newItems[index].packaging = product?.packaging || ""
    }
    setItems(newItems)
  }

  const addItem = () => setItems([...items, { productId: "", quantity: "", packaging: "" }])
  const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index))

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const missingFields: string[] = []
    
    if (!selectedCustomerId) missingFields.push("Customer")
    
    const validItems = items.filter(item => item.productId && item.quantity)
    if (validItems.length === 0) missingFields.push("Products/Items")
    
    if (!form.deliveryAddress) missingFields.push("Delivery Address")
    if (!form.preferredDeliveryDate) missingFields.push("Preferred Delivery Date")

    console.log("Current Form State on Submit:", {
      selectedCustomerId,
      items,
      form,
      missingFields
    })

    if (missingFields.length > 0) {
      console.warn("Validation Failed. Missing required fields:", missingFields)
      toast.error(`Please fill required fields: ${missingFields.join(", ")}`)
      return
    }

    const payload = {
      customerId: Number(selectedCustomerId),
      items: validItems.map(item => {
        const product = getProduct(item.productId)
        return {
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          packaging: product?.packaging || ""
        }
      }),
      transportType: form.transportType,
      deliveryAddress: addressMode === "saved" ? form.deliveryAddress : `${form.deliveryAddress}, ${form.city}`,
      preferredDeliveryDate: form.preferredDeliveryDate,
      remarks: form.remarks || undefined,
      vehicleNumber: form.transportType === "Company" ? vehicles.find(v => v.id === Number(form.vehicleId))?.plateNumber : form.vehicleNumber,
      driverName: form.transportType === "Company" ? drivers.find(d => d.id === Number(form.driverId))?.fullName : form.driverName,
      driverMobile: form.transportType === "Company" ? drivers.find(d => d.id === Number(form.driverId))?.phone : form.driverMobile,
      vehicleArrivalTime: form.vehicleArrivalTime ? `${form.vehicleArrivalTime}:00` : undefined,
      estimatedArrivalAtPlant: form.estimatedArrivalAtPlant || undefined
    }

    try {
      await orderApiService.createOrder(payload)
      toast.success("Order created successfully")
      navigate({ to: "/orders" })
    } catch (err) {
      toast.error("Failed to create order")
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <button type="button" className="back-link" onClick={() => navigate({ to: "/orders" })}>
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <h1 className="page-title">Place New Order</h1>
        <p className="page-subtitle">Modern order intake for Gulf Cement</p>
      </div>

      <div className="create-order-layout">
        <div className="order-creation-grid">

          {/* Left Side: Order Details (Customer + Items) */}
          <div className="card main-order-card">
            <div className="card-header">
              <h3><ShoppingCart size={18} /> Order Details</h3>
              <span className="order-number-badge">Next: {nextOrderNumber}</span>
            </div>

            <div className="p-4 border-b">
              <div className="section-title mb-3">
                <User size={14} className="inline mr-1" /> Customer Selection
              </div>
              <div className="form-group">
                <label className="form-label">Select Customer *</label>
                <select
                  className="form-select"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c: CustomerDto) => (
                    <option key={c.id} value={c.id}>{c.companyName} ({c.customerCode})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4">
              <div className="section-title mb-3">
                <ShoppingCart size={14} className="inline mr-1" /> Product Items
              </div>
              <div className="form-group">
                <div className="items-container custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                  {items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <div className="item-fields">
                        <select
                          className="form-select"
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                        >
                          <option value="">Select product...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (AED {p.price})</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        />
                        <span className="packaging-label">{item.packaging || "-"}</span>
                      </div>
                      {items.length > 1 && (
                        <button type="button" className="remove-item-btn" onClick={() => removeItem(index)}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="add-item-btn" onClick={addItem}>+ Add Another Product</button>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Internal Remarks</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Special instructions..."
                  value={form.remarks}
                  onChange={e => handleChange("remarks", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Logistics (Location + Transport) + Summary */}
          <div className="right-column-stack" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div className="card logistics-card">
              <div className="card-header">
                <h3><MapPin size={18} /> Logistics & Delivery</h3>
              </div>

              <div className="p-4 border-b">
                <div className="section-title mb-3">
                  <MapPin size={14} className="inline mr-1" /> Delivery Location
                </div>
                <div className="form-group">
                  <label className="form-label">Transport Way *</label>
                  <div className="transport-grid">
                    <label className={`transport-card ${form.transportType === "Company" ? "active" : ""}`}>
                      <input type="radio" checked={form.transportType === "Company"} readOnly onClick={() => handleChange("transportType", "Company")} />
                      <Truck size={16} /> GC Company
                    </label>
                    <label className={`transport-card ${form.transportType === "Customer" ? "active" : ""}`}>
                      <input type="radio" checked={form.transportType === "Customer"} readOnly onClick={() => handleChange("transportType", "Customer")} />
                      <Truck size={16} /> Customer Own
                    </label>
                  </div>
                </div>

                <div className="tabs-container">
                  <button type="button" className={`tab ${addressMode === 'saved' ? 'active' : ''}`} onClick={() => setAddressMode('saved')} disabled={!selectedCustomerId}>SAVED</button>
                  <button type="button" className={`tab ${addressMode === 'new' ? 'active' : ''}`} onClick={() => setAddressMode('new')}>+ NEW</button>
                </div>

                {addressMode === 'saved' ? (
                  <div className="saved-list custom-scrollbar mb-4" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {isLoadingAddresses ? (
                      <p style={{ textAlign: 'center', fontSize: '11px', color: '#64748b' }}>Loading...</p>
                    ) : customerAddresses.length > 0 ? (
                      customerAddresses.map(addr => (
                        <div
                          key={addr.id}
                          className={`address-card ${form.deliveryAddress === addr.addressLine1 ? 'selected' : ''}`}
                          onClick={() => {
                            handleChange("deliveryAddress", addr.addressLine1)
                            handleChange("city", addr.city)
                          }}
                        >
                          <div style={{ fontWeight: '700', fontSize: '12px', marginBottom: '2px' }}>{addr.city} — {addr.addressType} {addr.isPrimary && '⭐'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{addr.addressLine1}</div>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', padding: '10px' }}>No saved addresses.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    <input className="form-input" placeholder="Address Line" value={form.deliveryAddress} onChange={e => handleChange("deliveryAddress", e.target.value)} />
                    <input className="form-input" placeholder="City" value={form.city} onChange={e => handleChange("city", e.target.value)} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="section-title mb-3">
                  <Truck size={14} className="inline mr-1" /> Transportation Details
                </div>

                {form.transportType === "Company" ? (
                  <div className="space-y-3">
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '12px' }}>Vehicle Master</label>
                      <select
                        className="form-select"
                        value={form.vehicleId}
                        onChange={e => handleChange("vehicleId", e.target.value)}
                      >
                        <option value="">Select vehicle...</option>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.plateNumber} ({v.vehicleType})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '12px' }}>Driver Master</label>
                      <select
                        className="form-select"
                        value={form.driverId}
                        onChange={e => handleChange("driverId", e.target.value)}
                      >
                        <option value="">Select driver...</option>
                        {drivers.map(d => (
                          <option key={d.id} value={d.id}>{d.fullName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      className="form-input"
                      placeholder="Vehicle Number"
                      value={form.vehicleNumber}
                      onChange={e => handleChange("vehicleNumber", e.target.value)}
                    />
                    <div className="transport-grid">
                      <input
                        className="form-input"
                        placeholder="Driver Name"
                        value={form.driverName}
                        onChange={e => handleChange("driverName", e.target.value)}
                      />
                      <input
                        className="form-input"
                        placeholder="Driver Mobile"
                        value={form.driverMobile}
                        onChange={e => handleChange("driverMobile", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card summary-card" style={{ position: 'static', flex: '1' }}>
              <div className="card-header"><h3><FileText size={18} /> Order Summary</h3></div>
              <div className="p-4 space-y-4">
                {items.filter(i => i.productId).map((item, idx) => (
                  <div key={idx} className="summary-row">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600' }}>{getProduct(item.productId)?.name}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Qty: {item.quantity || 0}</span>
                    </div>
                    <span style={{ fontWeight: '700' }}>AED {(getProduct(item.productId)?.price || 0) * Number(item.quantity || 0)}</span>
                  </div>
                ))}

                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span style={{ fontSize: '20px', color: '#1e40af' }}>AED {total.toLocaleString()}</span>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                  <label className="form-label">Preferred Delivery Date</label>
                  <input type="date" className="form-input" value={form.preferredDeliveryDate} onChange={e => handleChange("preferredDeliveryDate", e.target.value)} />
                </div>

                <button className="order-submit-btn" onClick={handleSubmit}>
                  <CheckCircle size={20} /> Submit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}