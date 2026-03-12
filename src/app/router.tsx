import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import { ProductsPage } from "../features/products/routes/products-page";
import { NotFoundPage } from "./not-found";
import { LoginPage } from "../features/auth/components/LoginPage";
import { AuthGuard, GuestGuard } from "../features/auth/components/AuthGuard";
import { useAuthStore } from "../store/auth-store";
import {
  LayoutDashboard, ShoppingCart, Truck, ClipboardCheck, Weight,
  Shield, Gauge, BarChart2, ClipboardList, Settings, LogOut,
  Bell, Search, Package, User
} from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const staffNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { label: 'Dispatch', icon: ClipboardCheck, path: '/dispatch' },
  { label: 'Control Room', icon: Gauge, path: '/control-room' },
  { label: 'Weighbridge', icon: Weight, path: '/weighbridge' },
  { label: 'Gate Security', icon: Shield, path: '/gate-security' },
  { label: 'Transport', icon: Truck, path: '/transport' },
  { label: 'Delivery', icon: Package, path: '/delivery' },
  { label: 'MIS Reports', icon: BarChart2, path: '/reports' },
  { label: 'Audit Logs', icon: ClipboardList, path: '/audit' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

const customerNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'My Orders', icon: ShoppingCart, path: '/orders' },
  { label: 'Deliveries', icon: Truck, path: '/delivery' },
  { label: 'Invoices', icon: ClipboardList, path: '/invoices' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

function Header({ isStaff, user }: { isStaff: boolean; user: any }) {
  const clearAuth = useAuthStore((state: any) => state.clearAuth);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
    toast.info('Logged out successfully');
    navigate({ to: '/login' });
    setShowUserMenu(false);
  };

  const roleLabel = isStaff ? 'System Admin' : 'Customer';
  const avatarLetter = (user?.fullName || user?.userName || 'U').charAt(0).toUpperCase();

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.2)" />
            <path d="M8 24V16L16 8L24 16V24H18V18H14V24H8Z" fill="white" />
          </svg>
          Gulf Cement
        </div>
        <div className="header-search">
          <Search size={16} />
          <input type="text" placeholder="Search orders, tokens, trucks..." />
        </div>
      </div>
      <div className="header-right">
        <div className="header-role-badge">
          <User size={14} />
          {roleLabel}
        </div>
        <button className="header-notification">
          <Bell size={18} />
          <span className="notification-badge" />
        </button>
        <div style={{ position: 'relative' }}>
          <div className="header-user" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="header-avatar">{avatarLetter}</div>
          </div>
          {showUserMenu && (
            <div className="notification-dropdown" style={{ width: 180, right: 0, left: 'auto' }}>
              <div className="notification-item" style={{ padding: '8px 12px', color: 'var(--text-secondary)', fontSize: 12 }}>
                {user?.fullName || user?.userName || 'User'}
              </div>
              <div className="notification-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--danger)' }}>
                  <LogOut size={14} /> Sign Out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Sidebar({ isStaff }: { isStaff: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navItems = isStaff ? staffNavItems : customerNavItems;
  const sectionLabel = isStaff ? 'Navigation' : 'Customer Portal';

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">{sectionLabel}</div>
        {navItems.map((item) => {
          const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${active ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function RootLayout() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const user = useAuthStore((state: any) => state.user);
  const isStaff = user?.role === 'STAFF' || user?.role === 'Admin';

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="app-shell">
      <Sidebar isStaff={isStaff} />
      <div className="main-wrapper">
        <Header isStaff={isStaff} user={user} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


import { SignupPage } from '../features/auth/components/SignupPage';
import { DashboardPage } from '../features/dashboard/routes/DashboardPage';
import { useState } from "react";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  ),
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: () => (
    <AuthGuard>
      <ProductsPage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  signupRoute,
  dashboardRoute,
  indexRoute,
  productsRoute,
]);

const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: NotFoundPage
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}

