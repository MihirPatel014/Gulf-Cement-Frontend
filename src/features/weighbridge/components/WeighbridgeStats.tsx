import React from 'react';
import { Scale, Clock, CheckCircle, Zap } from 'lucide-react';
import type { WeighbridgeStats } from '../types';

interface StatsProps {
  stats: WeighbridgeStats;
}

export const WeighbridgeStatsComponent: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-content">
          <div className="kpi-label">Awaiting Tare</div>
          <div className="kpi-value">{stats.awaitingTare}</div>
        </div>
        <div className="kpi-icon info">
          <Scale size={24} />
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-content">
          <div className="kpi-label">In Loading (Await Gross)</div>
          <div className="kpi-value">{stats.inLoading}</div>
        </div>
        <div className="kpi-icon warning">
          <Clock size={24} />
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-content">
          <div className="kpi-label">Completed Today</div>
          <div className="kpi-value">{stats.completedToday}</div>
        </div>
        <div className="kpi-icon success">
          <CheckCircle size={24} />
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-content">
          <div className="kpi-label">Avg Net Weight</div>
          <div className="kpi-value">
            {stats.avgNetWeight.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span>
          </div>
        </div>
        <div className="kpi-icon primary">
          <Zap size={24} />
        </div>
      </div>
    </div>
  );
};
