import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  OnChangeFn,
} from '@tanstack/react-table';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  AlertCircle 
} from 'lucide-react';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  filters?: React.ReactNode;
  isLoading?: boolean;
  pageSize?: number;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  hiddenColumns?: string[];
  totalCount?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
}

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  title,
  subtitle,
  icon,
  headerActions,
  filters,
  isLoading = false,
  pageSize = 10,
  columnFilters,
  onColumnFiltersChange,
  hiddenColumns = [],
  totalCount,
  onPageChange,
  currentPage,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(currentPage ? currentPage - 1 : 0);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      ...(columnFilters !== undefined ? { columnFilters } : {}),
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Don't use pagination row model when onPageChange is provided (server-side pagination)
    ...(onPageChange ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    initialState: {
      pagination: onPageChange ? {
        pageSize,
        pageIndex: 0, // Always start at first page for server-side
      } : {
        pageSize,
        pageIndex,
      },
      columnVisibility: hiddenColumns.reduce((acc, col) => ({ ...acc, [col]: false }), {}),
    },
  });

  // Sync page index when currentPage changes
  React.useEffect(() => {
    if (currentPage !== undefined) {
      setPageIndex(currentPage - 1);
    }
  }, [currentPage]);

  return (
    <div className="data-table-container">
      {/* Page / Table Header */}
      {(title || headerActions) && (
        <div className="page-header flex justify-between items-center mb-4">
          <div>
            {title && (
              <h1 className="page-title flex items-center gap-2">
                {icon}
                {title}
              </h1>
            )}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {headerActions}
          </div>
        </div>
      )}

      {/* Table Box */}
      <div className="table-container">
        {/* Search Bar Area */}
        <div className="card-header flex justify-between items-center gap-4" style={{ padding: '16px 20px', background: '#fcfcfc' }}>
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          {filters && (
            <div className="flex items-center gap-2">
              {filters}
            </div>
          )}
        </div>

        {/* The Actual Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th 
                      key={header.id}
                      style={{ 
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        width: header.column.id === 'actions' ? '120px' : 'auto'
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className={`flex items-center gap-2 ${header.column.id === 'actions' ? 'justify-end' : ''}`}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown size={14} className="text-muted" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '60px' }}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin" style={{ 
                        width: 32, 
                        height: 32, 
                        border: '3px solid var(--primary-bg)', 
                        borderTopColor: 'var(--primary)', 
                        borderRadius: '50%' 
                      }} />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Fetching records...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={48} strokeWidth={1.5} />
                      <p style={{ fontSize: '16px', fontWeight: 500 }}>No results found</p>
                      <p style={{ fontSize: '13px' }}>Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ textAlign: cell.column.id === 'actions' ? 'right' : 'left' }}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-white)' }}>
          <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            Showing <strong>{table.getRowModel().rows.length}</strong> of <strong>{totalCount || data.length}</strong> entries
          </div>
          <div className="flex gap-2">
            <button
              className="btn"
              onClick={() => {
                if (onPageChange) {
                  onPageChange(currentPage ? currentPage - 1 : 1);
                } else {
                  table.previousPage();
                }
              }}
              disabled={
                onPageChange
                  ? currentPage === undefined || currentPage <= 1
                  : !table.getCanPreviousPage()
              }
              style={{
                padding: '7px 14px',
                background: 'white',
                opacity: onPageChange
                  ? currentPage === undefined || currentPage <= 1
                    ? 0.5
                    : 1
                  : table.getCanPreviousPage()
                    ? 1
                    : 0.5,
                borderColor: 'var(--border)'
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <div className="flex items-center px-4 font-semibold text-sm h-full" style={{ color: 'var(--primary)' }}>
              Page {currentPage || 1}
            </div>
            <button
              className="btn"
              onClick={() => {
                if (onPageChange) {
                  onPageChange(currentPage ? currentPage + 1 : 2);
                } else {
                  table.nextPage();
                }
              }}
              disabled={
                onPageChange
                  ? (currentPage !== undefined && totalCount !== undefined
                      ? (currentPage * pageSize >= totalCount)
                      : false)
                  : !table.getCanNextPage()
              }
              style={{
                padding: '7px 14px',
                background: 'white',
                opacity: onPageChange
                  ? (currentPage !== undefined && totalCount !== undefined
                      ? currentPage * pageSize >= totalCount
                        ? 0.5
                        : 1
                      : 1)
                  : table.getCanNextPage()
                    ? 1
                    : 0.5,
                borderColor: 'var(--border)'
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
