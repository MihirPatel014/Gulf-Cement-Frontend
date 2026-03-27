import { useQuery } from "@tanstack/react-query";
import { orderApiService } from "../../../services/adapters/orders.api";

export function useOrdersQuery(filters: {
  pageNumber?: number
  pageSize?: number
  search?: string
  status?: string
  productId?: number
}) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {

      const response = await orderApiService.getOrders(filters)

      return {
        totalCount: response.totalCount,
        data: response.data.map((o:any) => ({
          id: o.id,
          customerName: o.customerName,
          productName: o.items?.length > 1 
            ? `${o.items.length} Items` 
            : o.items?.[0]?.productName ?? "",
          packaging: o.items?.[0]?.packaging ?? "",
          quantity: o.items?.[0]?.quantity ?? 0,
          itemsCount: o.items?.length ?? 0,
          items: o.items, // Include full items array for display
          totalAmount: o.totalAmount,
          status: o.status,
          transportOption: o.transportType,
          createdAt: o.orderDate
        }))
      }
    }
  })
}