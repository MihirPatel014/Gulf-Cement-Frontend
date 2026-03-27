import React from 'react';

export const DemoPage: React.FC = () => {
  return (
    <div className="p-2">
      <div className="page-header">
        <h1 className="page-title">Demo Mode</h1>
        <p className="page-subtitle">Gulf Cement Operations - interactive Demonstration</p>
      </div>
      <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Demo mode module is under development.</p>
      </div>
    </div>
  );
};
