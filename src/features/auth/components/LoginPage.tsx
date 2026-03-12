import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Lock, 
  User, 
  Building2,
  Settings,
  ClipboardCheck,
  Ticket,
  Truck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserType } from '../types/auth.types';
import { LoadingButton } from '../../../components/ui/LoadingButton';

const loginSchema = z.object({
  userName: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.nativeEnum(UserType),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [loginMode, setLoginMode] = useState<'staff' | 'customer'>('staff');
  
  React.useEffect(() => {
    document.title = 'Login - Gulf Cement';
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userType: UserType.STAFF,
      userName: 'admin@gulfcement.ae',
      password: 'admin@123'
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const handleModeChange = (mode: 'staff' | 'customer') => {
    setLoginMode(mode);
    setValue('userType', mode === 'staff' ? UserType.STAFF : UserType.CUSTOMER);
    if (mode === 'staff') {
      setValue('userName', 'admin@gulfcement.ae');
      setValue('password', 'admin@123');
    } else {
      setValue('userName', 'habtoor@company.ae');
      setValue('password', 'admin@123');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="#0B3D91" />
            <path d="M16 48V32L32 16L48 32V48H36V36H28V48H16Z" fill="white" />
          </svg>
          <h1>Gulf Cement</h1>
          <p>Digital Dispatch & Command Control Platform</p>
        </div>

        {/* Login Mode Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '4px' }}>
          <button
            type="button"
            onClick={() => handleModeChange('staff')}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 'var(--radius)',
              background: loginMode === 'staff' ? 'var(--primary)' : 'transparent',
              color: loginMode === 'staff' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
            }}
          >
            <Settings size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Staff Login
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('customer')}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 'var(--radius)',
              background: loginMode === 'customer' ? 'var(--primary)' : 'transparent',
              color: loginMode === 'customer' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
            }}
          >
            <Building2 size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Customer Portal
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="userName" className="form-label">
              Username/Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="userName"
                {...register('userName')}
                type="text"
                autoComplete="username"
                className="form-input"
                placeholder={loginMode === 'staff' ? "admin@gulfcement.ae" : "customer@company.ae"}
              />
              <User size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            </div>
            {errors.userName && (
              <p className="form-error">{errors.userName.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className="form-input"
                placeholder="••••••••"
              />
              <Lock size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            </div>
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="remember-me"
                type="checkbox"
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="remember-me" style={{ fontSize: '13px', color: 'var(--text)' }}>
                Remember me
              </label>
            </div>
            <a href="/forgot-password" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>

          <LoadingButton
            type="submit"
            loading={isLoggingIn}
            loadingText="Signing in..."
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '16px' }}
          >
            {loginMode === 'staff' ? <Settings size={18} /> : <Building2 size={18} />}
            Sign In {loginMode === 'customer' ? 'to Portal' : ''}
          </LoadingButton>

          <div className="login-divider">
            {loginMode === 'staff' ? 'Quick Demo Access' : 'Demo Customer Accounts'}
          </div>

          {loginMode === 'staff' ? (
            <div className="quick-roles">
              <button type="button" className="quick-role-btn" onClick={() => { setValue('userName', 'admin@gulfcement.ae'); setValue('password', 'admin@123'); }}>
                <Settings size={16} /> System Admin
              </button>
              <button type="button" className="quick-role-btn" onClick={() => { setValue('userName', 'dispatch@gulfcement.ae'); setValue('password', 'admin@123'); }}>
                <ClipboardCheck size={16} /> Dispatch
              </button>
              <button type="button" className="quick-role-btn" onClick={() => { setValue('userName', 'control@gulfcement.ae'); setValue('password', 'admin@123'); }}>
                <Ticket size={16} /> Control Room
              </button>
              <button type="button" className="quick-role-btn" onClick={() => { setValue('userName', 'transport@gulfcement.ae'); setValue('password', 'admin@123'); }}>
                <Truck size={16} /> Transport
              </button>
            </div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button type="button" className="quick-role-btn" onClick={() => { setValue('userName', 'habtoor@company.ae'); setValue('password', 'admin@123'); }}>
                  <Building2 size={14} />
                  <span style={{ flex: 1, textAlign: 'left' }}>Al Habtoor Group</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>habtoor@company.ae</span>
                </button>
                <button type="button" className="quick-role-btn" onClick={() => { setValue('userName', 'emaar@company.ae'); setValue('password', 'admin@123'); }}>
                  <Building2 size={14} />
                  <span style={{ flex: 1, textAlign: 'left' }}>Emaar Properties</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>emaar@company.ae</span>
                </button>
             </div>
          )}
        </form>
      </div>
    </div>
  );
};
