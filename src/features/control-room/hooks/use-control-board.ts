import { useState, useEffect } from "react"
import { controlBoardApi } from "../api/control-board.api"
import type { ControlBoardItem, ControlBoardResponse } from "../types/control-board.types"

export function useControlBoard() {
  const [data, setData] = useState<ControlBoardItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const fetchData = async (page: number = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const response: ControlBoardResponse = await controlBoardApi.getControlBoard({
        pageNumber: page,
        pageSize
      })
      setData(response.data)
      setTotalCount(response.totalCount)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch control board data")
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