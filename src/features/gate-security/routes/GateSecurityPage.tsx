import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ShieldCheck, RefreshCw, CheckCircle, XCircle} from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '../../../components/ui/DataTable'
import { gateSecurityApi } from '../api/gate-security.api'
import type { GateLog, GateExitResponse } from '../types/gate-security.types'
import './gate-security.css'

type ActiveTab = 'verification' | 'gate-log'

// Format date as "01 Apr 2026, 9:55 AM"
function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('en-GB', { month: 'short' }) // "Apr"
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${day.toString().padStart(2, '0')} ${month} ${year}, ${displayHours}:${minutes} ${ampm}`
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Passed':
      return 'badge-green'
    case 'Not Ready':
      return 'badge-yellow'
    case 'Locked':
      return 'badge-red'
    case 'Failed':
      return 'badge-red'
    default:
      return 'badge-gray'
  }
}

export const GateSecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('verification')
  const [tokenNo, setTokenNo] = useState('')
  const [pin, setPin] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<GateExitResponse | null>(null)
  
  // Gate Log state
  const [gateLogs, setGateLogs] = useState<GateLog[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  const fetchGateLogs = async () => {
    setIsLoadingLogs(true)
    try {
      const response = await gateSecurityApi.getGateLogs()
      // Handle both response formats: { data: GateLog[] } or GateLog[]
      const logs = (response as any).data !== undefined 
        ? (response as { data: GateLog[] }).data 
        : response as unknown as GateLog[]
      setGateLogs(logs || [])
    } catch (error) {
      toast.error('Failed to fetch gate logs')
      console.error(error)
      setGateLogs([])
    } finally {
      setIsLoadingLogs(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'gate-log') {
      fetchGateLogs()
    }
  }, [activeTab])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenNo.trim() || !pin.trim()) {
      toast.error('Please enter both token number and PIN')
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)
    
    try {
      const result = await gateSecurityApi.verifyGateExit(tokenNo.trim(), pin.trim())
      setVerificationResult(result)
      
      if (result.success) {
        toast.success('Gate exit verified successfully!')
        setTokenNo('')
        setPin('')
      } else {
        toast.error(result.message || 'Verification failed')
      }
    } catch (error: any) {
      // The error might already be the parsed response from httpPost
      const errorResult = error as GateExitResponse
      
      // If it's a valid response object with success=false, use it
      if (errorResult && errorResult.success === false) {
        setVerificationResult(errorResult)
        toast.error(errorResult.message || 'Verification failed')
      } else {
        // Otherwise it's a real network/system error
        const errorMessage = error?.message || 'Verification failed'
        toast.error(errorMessage)
        setVerificationResult({
          success: false,
          message: errorMessage,
          error: errorMessage
        })
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRefreshLogs = () => {
    fetchGateLogs()
    toast.success('Gate logs refreshed')
  }

  const logColumns: ColumnDef<GateLog>[] = [
    {
      accessorKey: 'gateId',
      header: 'GATE ID',
      cell: ({ row }) => <span className="gate-id">{row.original.gateId}</span>,
    },
    {
      accessorKey: 'tokenNo',
      header: 'TOKEN NO',
      cell: ({ row }) => <span className="token-no">{row.original.tokenNo}</span>,
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: ({ row }) => (
        <span className={`badge ${getStatusBadgeClass(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'verifiedAt',
      header: 'VERIFIED AT',
      cell: ({ row }) => (
        <span className="verified-at">
          {formatDate(row.original.verifiedAt)}
        </span>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'REASON',
      cell: ({ row }) => <span className="reason">{row.original.reason}</span>,
    },
  ]

  return (
    <div className="p-2">
      <div className="page-header">
        <h1 className="page-title">Gate Security</h1>
        <p className="page-subtitle">Gulf Cement Operations - Entry & Exit Management</p>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <ShieldCheck size={18} />
          Gate Verification
        </button>
        <button
          className={`tab-button ${activeTab === 'gate-log' ? 'active' : ''}`}
          onClick={() => setActiveTab('gate-log')}
        >
          <RefreshCw size={18} />
          Gate Log
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'verification' && (
          <div className="verification-center">
          <div className="verification-card">
            
            <div className="verification-icon">
              <ShieldCheck size={32} />
            </div>

            <h2 className="verification-title">Gate Exit Verification</h2>
            <p className="verification-subtitle">
              Enter Token ID and 6-digit SMS PIN
            </p>

            <form onSubmit={handleVerify} className="verification-form">

              <div className="form-group">
                <label>Token ID</label>
                <input
                  type="text"
                  value={tokenNo}
                  onChange={(e) => setTokenNo(e.target.value)}
                  placeholder="TK___"
                  className="input-large"
                />
              </div>

              <div className="form-group">
                <label>SMS PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="------"
                  className="input-large"
                />
              </div>

              <button type="submit" className="verify-btn" disabled={!tokenNo || !pin || isVerifying}>                
                Verify & Open Gate
              </button>
            </form>
              {verificationResult && (
              <div className={`verification-result ${verificationResult.success ? 'success' : 'error'}`}>
                <div className="result-header">
                  {verificationResult.success 
                    ? <CheckCircle size={24} className="success-icon" /> 
                    : <XCircle size={24} className="error-icon" />}
                  <h3>
                    {verificationResult.success ? 'Gate Opened' : 'Verification Failed'} - {verificationResult.message}
                  </h3>
                </div>
                
              </div>
            )}
          </div>
        </div>
        )}
        
        {activeTab === 'gate-log' && (
          <div className="gate-log-container">
            <div className="gate-log-header">
              <h2>Gate Exit Logs</h2>
              <button 
                className="refresh-button"
                onClick={handleRefreshLogs}
                disabled={isLoadingLogs}
              >
                <RefreshCw size={18} className={isLoadingLogs ? 'spinning' : ''} />
                Refresh
              </button>
            </div>
            <DataTable<GateLog>
              columns={logColumns}
              data={gateLogs}
              isLoading={isLoadingLogs}
              pageSize={10}
            />
          </div>
        )}
      </div>
    </div>
  )
}
