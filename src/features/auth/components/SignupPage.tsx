import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Lock, 
  User, 
  Settings,
  Building2
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { UserType } from '../types/auth.types';
import { LoadingButton } from '../../../components/ui/LoadingButton';

const signupSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  userType: z.nativeEnum(UserType),
  staffRole: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const { signup, isSigningUp } = useAuth();
  const [roleMode, setRoleMode] = useState<'staff' | 'customer'>('customer');
  const [serverError, setServerError] = useState<string | null>(null);
  
  React.useEffect(() => {
    document.title = 'Create Account - Gulf Cement';
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: UserType.CUSTOMER
    }
  });

  const onSubmit = (data: SignupFormValues) => {
    setServerError(null);
    const { confirmPassword, ...formData } = data;
    signup(
      { ...formData, userName: data.email },
      {
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Registration failed. Please try again.';
          setServerError(msg);
        }
      }
    );
  };

  const handleRoleChange = (mode: 'staff' | 'customer') => {
    setRoleMode(mode);
    setValue('userType', mode === 'staff' ? UserType.STAFF : UserType.CUSTOMER);
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: '480px' }}>
        <div className="login-logo">
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="#0B3D91" />
            <path d="M16 48V32L32 16L48 32V48H36V36H28V48H16Z" fill="white" />
          </svg>
          <h1 style={{ fontSize: '24px' }}>Create Account</h1>
          <p>Join Gulf Cement Digital Platform</p>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '4px' }}>
          <button
            type="button"
            onClick={() => handleRoleChange('customer')}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 'var(--radius)',
              background: roleMode === 'customer' ? 'var(--primary)' : 'transparent',
              color: roleMode === 'customer' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
            }}
          >
            <Building2 size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('staff')}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 'var(--radius)',
              background: roleMode === 'staff' ? 'var(--primary)' : 'transparent',
              color: roleMode === 'staff' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
            }}
          >
            <Settings size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Staff
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('fullName')}
                type="text"
                className="form-input"
                placeholder="John Doe"
              />
              <User size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            </div>
            {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
          </div>

          {roleMode === 'staff' && (
            <div className="form-group">
              <label className="form-label">Staff Role</label>
              <select 
                {...register('staffRole')}
                className="form-input"
                style={{ appearance: 'auto' }}
              >
                <option value="">Select a role...</option>
                <option value="Control Room User">Control Room User</option>
                <option value="Transportation User">Transportation User</option>
                <option value="Dispatch User">Dispatch User</option>
              </select>
              {errors.staffRole && <p className="form-error">{errors.staffRole.message}</p>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('email')}
                type="email"
                className="form-input"
                placeholder="john@example.com"
              />
              <User size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            </div>
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type="password"
                className="form-input"
                placeholder="••••••••"
              />
              <Lock size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
            {serverError && <p className="form-error" style={{ marginTop: '6px' }}>{serverError}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="form-input"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
          </div>

          <LoadingButton
            type="submit"
            loading={isSigningUp}
            loadingText="Creating account..."
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            Create Account
          </LoadingButton>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
