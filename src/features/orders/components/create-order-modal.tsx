import { useState } from "react";
import { orderApiService } from "../../../services/adapters/orders.api";
import { useProductsQuery } from "../../products/hooks/use-products-query";
import { useCustomersQuery } from "../../customers/hooks/use-customers-query"
import { ShoppingCart } from "lucide-react"
import "./create-order-staff.css"
export default function CreateOrderModal({ onClose }: { onClose: () => void }) {

  const { data: products = [] } = useProductsQuery()
  const { data: customers = [] } = useCustomersQuery()
  const [form, setForm] = useState({
    customerId: "",
    productId: "",
    quantity: "",
    transportType: "Company",
    vehicleNumber: "",
    driverName: "",
    deliveryAddress: "",
    preferredDate: "",
    notes: ""
  })

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {

    const payload = {
      customerId: Number(form.customerId),
      items: [
        {
          productId: Number(form.productId),
          quantity: Number(form.quantity)
        }
      ],
      transportType: form.transportType,
      deliveryAddress: form.deliveryAddress,
      preferredDeliveryDate: form.preferredDate,
      vehicleNumber: form.vehicleNumber,
      driverName: form.driverName,
      remarks: form.notes
    }

    await orderApiService.createOrder(payload)

    onClose()
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">
          <h3>Create New Order</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          <div className="form-row">

            <div>
              <label>Customer</label>
             <select
                value={form.customerId}
                onChange={(e)=>handleChange("customerId", e.target.value)}
                >
                <option value="">Select Customer</option>

                {customers.map((c:any)=>(
                    <option key={c.id} value={c.id}>
                    {c.customerCode} - {c.companyName}
                    </option>
                ))}
                </select>
            </div>

            <div>
              <label>Product</label>
              <select
                value={form.productId}
                onChange={(e)=>handleChange("productId", e.target.value)}
              >
                <option>Select Product</option>

                {products.map(p=>(
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="form-row">

            <div>
              <label>Quantity</label>
              <input
                value={form.quantity}
                onChange={(e)=>handleChange("quantity", e.target.value)}
              />
            </div>

            <div>
              <label>Transport Option</label>
              <select
                value={form.transportType}
                onChange={(e)=>handleChange("transportType", e.target.value)}
              >
                <option value="Company">Company Transport</option>
                <option value="Customer">Customer Own Transport</option>
              </select>
            </div>

          </div>

          {form.transportType === "Customer" && (
            <div className="form-row">

                <div>
                <label>Vehicle Number</label>
                <input
                    placeholder="e.g., DXB-1234"
                    value={form.vehicleNumber}
                    onChange={(e)=>handleChange("vehicleNumber", e.target.value)}
                />
                </div>

                <div>
                <label>Driver Name</label>
                <input
                    value={form.driverName}
                    onChange={(e)=>handleChange("driverName", e.target.value)}
                />
                </div>

            </div>
            )}

          <div>
            <label>Delivery Address</label>
            <input
              value={form.deliveryAddress}
              onChange={(e)=>handleChange("deliveryAddress", e.target.value)}
            />
          </div>

          <div className="form-row">

            <div>
              <label>Preferred Date</label>
              <input
                type="date"
                value={form.preferredDate}
                onChange={(e)=>handleChange("preferredDate", e.target.value)}
              />
            </div>

            <div>
              <label>Notes</label>
              <input
                value={form.notes}
                onChange={(e)=>handleChange("notes", e.target.value)}
              />
            </div>

          </div>

        </div>

        <div className="modal-footer">

            <button
                className="btn-cancel"
                onClick={onClose}
            >
                Cancel
            </button>

            <button
                className="btn-primary"
                onClick={handleSubmit}
            >
                <ShoppingCart size={16} /> Create Order
            </button>

            </div>

      </div>

    </div>
  )
}