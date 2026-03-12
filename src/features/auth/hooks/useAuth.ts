import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../../../store/auth-store';
import { LoginRequest } from '../types/auth.types';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export const useAuth = () => {
  const setAuth = useAuthStore((state: any) => state.setAuth);
  const clearAuth = useAuthStore((state: any) => state.clearAuth);
  const user = useAuthStore((state: any) => state.user);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response);
      toast.success('Login successful!');
      navigate({ to: '/' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  });

  const signupMutation = useMutation({
    mutationFn: (data: any) => authApi.register(data),
    onSuccess: (response) => {
      setAuth(response);
      toast.success('Registration successful!');
      navigate({ to: '/dashboard' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  });

  const logout = () => {
    clearAuth();
    toast.info('Logged out successfully');
    navigate({ to: '/login' });
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    logout
  };
};
