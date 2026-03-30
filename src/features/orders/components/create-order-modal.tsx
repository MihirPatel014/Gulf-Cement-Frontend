import { useState } from "react";
import { orderApiService } from "../../../services/adapters/orders.api";
import { useProductsQuery } from "../../products/hooks/use-products-query";
import { useCustomersQuery } from "../../customers/hooks/use-customers-query"
import { ShoppingCart } from "lucide-react"
import "./create-order-staff.css"

export default function CreateOrderModal({ onClose }: { onClose: () => void }) {

  const { data: productsData } = useProductsQuery({ pageSize: 100 });
  const products = productsData?.data ?? [];
  const { data: customers = [] } = useCustomersQuery({ pageSize: 1000 });

  const [form, setForm] = useState({
    customerId: "",
    items: [
      { productId: "", quantity: "" }
    ],
    transportType: "Company",
    vehicleNumber: "",
    driverName: "",
    deliveryAddress: "",
    preferredDate: "",
    notes: ""
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...form.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    }

    setForm(prev => ({
      ...prev,
      items: updatedItems
    }))
  }

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: "" }]
    }))
  }

  const removeItem = (index: number) => {
    const updatedItems = form.items.filter((_, i) => i !== index)

    setForm(prev => ({
      ...prev,
      items: updatedItems
    }))
  }

  const validate = () => {
    const newErrors: string[] = []
    if (!form.customerId) newErrors.push("customerId")
    if (!form.deliveryAddress) newErrors.push("deliveryAddress")
    if (!form.preferredDate) newErrors.push("preferredDate")
    
    form.items.forEach((item, index) => {
      if (!item.productId) newErrors.push(`item_${index}_productId`)
      if (!item.quantity || Number(item.quantity) <= 0) newErrors.push(`item_${index}_quantity`)
    })

    if (form.transportType === "Customer") {
      if (!form.vehicleNumber) newErrors.push("vehicleNumber")
      if (!form.driverName) newErrors.push("driverName")
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleSubmit = async () => {
    setIsSubmitted(true)
    const validationErrors = validate()
    
    if (validationErrors.length > 0) {
      console.error("Validation Failed. Missing/Invalid fields:", validationErrors)
      // Provide a helpful toast or alert if needed, but the console log is requested specifically
      return
    }

    try {
      const payload = {
        customerId: Number(form.customerId),
        items: form.items.map(i => ({
          productId: Number(i.productId),
          quantity: Number(i.quantity)
        })),
        transportType: form.transportType,
        deliveryAddress: form.deliveryAddress,
        preferredDeliveryDate: form.preferredDate,
        vehicleNumber: form.vehicleNumber,
        driverName: form.driverName,
        remarks: form.notes
      }

      await orderApiService.createOrder(payload)
      onClose()
    } catch (err) {
      console.error("Failed to create order", err)
    }
  }

  const hasError = (field: string) => isSubmitted && errors.includes(field)

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">
          <h3>Create New Order</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* CUSTOMER */}
          <div>
            <label>Customer</label>
            <select
              className={hasError("customerId") ? "input-error" : ""}
              value={form.customerId}
              onChange={(e) => handleChange("customerId", e.target.value)}
            >
              <option value="">Select Customer</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.customerCode} - {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCTS */}
          <div style={{ marginTop: 20 }}>
            <label>Products</label>

            {form.items.map((item, index) => (
              <div className="product-row" key={index}>

                <select
                  className={hasError(`item_${index}_productId`) ? "input-error" : ""}
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <input
                  className={hasError(`item_${index}_quantity`) ? "input-error" : ""}
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                />

                {form.items.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeItem(index)}>
                    Remove
                  </button>
                )}

              </div>
            ))}

            <button type="button" className="btn-add" onClick={addItem}>
              + Add Product
            </button>
          </div>

          {/* TRANSPORT */}
          <div className="form-row" style={{ marginTop: 20 }}>

            <div>
              <label>Transport Option</label>
              <select
                value={form.transportType}
                onChange={(e) => handleChange("transportType", e.target.value)}
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
                  className={hasError("vehicleNumber") ? "input-error" : ""}
                  value={form.vehicleNumber}
                  onChange={(e) => handleChange("vehicleNumber", e.target.value)}
                />
              </div>

              <div>
                <label>Driver Name</label>
                <input
                  className={hasError("driverName") ? "input-error" : ""}
                  value={form.driverName}
                  onChange={(e) => handleChange("driverName", e.target.value)}
                />
              </div>

            </div>
          )}

          {/* ADDRESS */}
          <div>
            <label>Delivery Address</label>
            <input
              className={hasError("deliveryAddress") ? "input-error" : ""}
              value={form.deliveryAddress}
              onChange={(e) => handleChange("deliveryAddress", e.target.value)}
            />
          </div>

          <div className="form-row">

            <div>
              <label>Preferred Date</label>
              <input
                className={hasError("preferredDate") ? "input-error" : ""}
                type="date"
                value={form.preferredDate}
                onChange={(e) => handleChange("preferredDate", e.target.value)}
              />
            </div>

            <div>
              <label>Notes</label>
              <input
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>

          </div>

        </div>

        <div className="modal-footer">

          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleSubmit}>
            <ShoppingCart size={16} /> Create Order
          </button>

        </div>

      </div>

    </div>
  )
}