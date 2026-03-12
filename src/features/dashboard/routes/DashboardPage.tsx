import React from 'react';
import { 
  ShoppingCart, 
  Truck, 
  Scale, 
  Clock, 
  DollarSign,
  Zap,
  CheckCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { useAuthStore } from '../../../store/auth-store';
import { UserType } from '../../auth/types/auth.types';

const dailyOrders = [
  { day: 'Mon', orders: 4, dispatched: 3 },
  { day: 'Tue', orders: 7, dispatched: 5 },
  { day: 'Wed', orders: 5, dispatched: 6 },
  { day: 'Thu', orders: 8, dispatched: 4 },
  { day: 'Fri', orders: 6, dispatched: 7 },
  { day: 'Sat', orders: 3, dispatched: 2 },
  { day: 'Sun', orders: 2, dispatched: 1 },
];

const revenueData = [
  { month: 'Sep', revenue: 165000 },
  { month: 'Oct', revenue: 182000 },
  { month: 'Nov', revenue: 175000 },
  { month: 'Dec', revenue: 210000 },
  { month: 'Jan', revenue: 195000 },
  { month: 'Feb', revenue: 225000 },
];

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((state: any) => state.user);
  const isStaff = user?.role === 'STAFF' || user?.userType === UserType.STAFF;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-6">
      <div className="page-header">
        <h1 className="page-title">{isStaff ? 'Operations Dashboard' : 'Customer Portal'}</h1>
        <p className="page-subtitle">
          {isStaff ? 'Gulf Cement Operations Overview' : `Welcome back, ${user?.fullName || 'Customer'}`} — {formatDate(new Date())}
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card primary">
          <div>
            <div className="kpi-label">{isStaff ? 'Orders Today' : 'Active Orders'}</div>
            <div className="kpi-value">{isStaff ? '12' : '3'}</div>
            <div className="kpi-change up">↑ 12% vs yesterday</div>
          </div>
          <div className="kpi-icon primary"><ShoppingCart size={24} /></div>
        </div>
        
        <div className="kpi-card success">
          <div>
            <div className="kpi-label">{isStaff ? 'Dispatched Today' : 'Total Deliveries'}</div>
            <div className="kpi-value">{isStaff ? '8' : '45'}</div>
            <div className="kpi-change up">↑ 8% vs yesterday</div>
          </div>
          <div className="kpi-icon success"><Truck size={24} /></div>
        </div>

        <div className="kpi-card info">
          <div>
            <div className="kpi-label">{isStaff ? 'Avg TAT' : 'Reward Points'}</div>
            <div className="kpi-value">{isStaff ? '2h 34m' : '1,250'}</div>
            <div className="kpi-change up">↓ 15m improvement</div>
          </div>
          <div className="kpi-icon info">{isStaff ? <Clock size={24} /> : <Zap size={24} />}</div>
        </div>

        <div className="kpi-card warning">
          <div>
            <div className="kpi-label">{isStaff ? 'WB Utilization' : 'Pending Invoices'}</div>
            <div className="kpi-value">{isStaff ? '85%' : '2'}</div>
            <div className="kpi-change up">Optimal range</div>
          </div>
          <div className="kpi-icon warning">{isStaff ? <Scale size={24} /> : <DollarSign size={24} />}</div>
        </div>
      </div>

      {isStaff && (
        <div className="grid-2" style={{ marginTop: '24px', gap: '24px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Orders & Dispatch Trend</div>
            </div>
            <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="orders" fill="#0B3D91" radius={[4, 4, 0, 0]} name="Orders" />
                  <Bar dataKey="dispatched" fill="#16A34A" radius={[4, 4, 0, 0]} name="Dispatched" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Revenue Trend (AED)</div>
            </div>
            <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000)}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0B3D91" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#0B3D91' }} 
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div className="card-title">Recent Activity</div>
        </div>
        <div className="p-4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
          <div style={{ background: 'var(--bg)', display: 'inline-flex', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
             <CheckCircle size={32} color="var(--primary)" />
          </div>
          <h3>System Fully Operational</h3>
          <p>Your recent activities will appear here once you start processing orders.</p>
        </div>
      </div>
    </div>
  );
};
