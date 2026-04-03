import React, { useState } from 'react'
import { Key, LayoutDashboard } from 'lucide-react'
import { CreateTokenTab } from '../components/CreateTokenTab'
import { ControlBoardTab } from '../components/ControlBoardTab'
import './control-room.css'

type TabId = 'create-token' | 'control-board' 

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  { id: 'create-token', label: 'Create Token', icon: <Key size={16} /> },
  { id: 'control-board', label: 'Control Board', icon: <LayoutDashboard size={16} /> },
]

export const ControlRoomPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('create-token')

  return (
    <div className="p-2">
      <div className="page-header">
        <h1 className="page-title">Command & Control Room</h1>
        <p className="page-subtitle">Gulf Cement Operations - Real-time Monitoring</p>
      </div>

      {/* Tabs Navigation */}
      <div className="control-room-tabs">
        {tabs.map((tab) => (
          <button  
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'create-token' && <CreateTokenTab />}
        {activeTab === 'control-board' && <ControlBoardTab />}        
      </div>
    </div>
  )
}
