import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { userApi } from '../../features/users/api/user.api';
import { Role } from '../../features/users/types/user.types';

interface RoleSelectProps {
  value: string | number;
  onChange: (value: any) => void;
  className?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  placeholder?: string;
  error?: string;
  label?: string;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
  value,
  onChange,
  className = '',
  showAllOption = false,
  allOptionLabel = 'All Roles',
  placeholder = 'Select a role...',
  error,
  label
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const res = await userApi.getRoles();
        if (res.success) {
          setRoles(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch roles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        <select
          className={`form-input ${error ? 'form-input-error' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          style={{ appearance: 'none', paddingRight: '40px' }}
        >
          {showAllOption && <option value="">{allOptionLabel}</option>}
          {!showAllOption && <option value="" disabled>{placeholder}</option>}
          
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
          {loading ? (
            <div className="animate-spin" style={{ width: 14, height: 14, border: '2px solid transparent', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};
