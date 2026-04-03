import { useState, useEffect } from "react"
import { tokenApi } from "../api/token.api"
import type { ShipmentForToken, PaginatedShipmentsResponse } from "../types/token.types"

export function useShipmentsForToken() {
  const [data, setData] = useState<ShipmentForToken[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const fetchData = async (page: number = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const response: PaginatedShipmentsResponse = await tokenApi.getShipmentsForToken({
        pageNumber: page,
        pageSize
      })
      setData(response.data)
      setTotalCount(response.totalCount)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch shipments")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [])

  const refresh = () => fetchData(currentPage)

  return {
    data,
    totalCount,
    isLoading,
    error,
    currentPage,
    pageSize,
    fetchPage: fetchData,
    refresh
  }
}