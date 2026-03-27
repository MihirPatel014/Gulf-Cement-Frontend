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
import OrderDetailsPage from "../features/orders/routes/order-details-page";
import OrdersPage from "../features/orders/routes/orders-page";
import CreateOrderPage from "../features/orders/routes/create-order-page";
import { NotFoundPage } from "./not-found";
import { LoginPage } from "../features/auth/components/LoginPage";
import { AuthGuard, GuestGuard } from "../features/auth/components/AuthGuard";
import { useAuthStore } from "../store/auth-store";
import { UserType } from "../features/auth/types/auth.types";
import {
  LayoutDashboard, ShoppingCart, Truck, ClipboardCheck, Scale,
  ShieldCheck, Gauge, BarChart3, ClipboardList, Settings, LogOut,
  Bell, Search, MapPin, FileText, Play, Home, Package,
  PlusCircle, FolderOpen, UserCircle, User, Users, Building,
  Menu, ChevronDown, ChevronRight, Database,
} from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

// Import new pages
import { DashboardPage } from '../features/dashboard/routes/DashboardPage';
import { SignupPage } from '../features/auth/components/SignupPage';
import { DispatchPage } from '../features/dispatch/routes/DispatchPage';
import { ControlRoomPage } from '../features/control-room/routes/ControlRoomPage';
import { WeighbridgePage } from '../features/weighbridge/routes/WeighbridgePage';
import { GateSecurityPage } from '../features/gate-security/routes/GateSecurityPage';
import { DriverPage } from '../features/driver/routes/DriverPage';
import { DeliveryPage } from '../features/delivery/routes/DeliveryPage';
import { FinancePage } from '../features/finance/routes/FinancePage';
import { ReportsPage } from '../features/reports/routes/ReportsPage';
import { AuditPage } from '../features/audit/routes/AuditPage';
import { TransportPage } from '../features/transport/routes/TransportPage';
import { DemoPage } from '../features/demo/routes/DemoPage';
import { SettingsPage } from '../features/settings/routes/SettingsPage';
import { DocumentsPage } from '../features/documents/routes/DocumentsPage';
import { ProfilePage } from '../features/profile/routes/ProfilePage';
import { UserManagementPage } from '../features/users/routes/UserManagementPage';
import { CustomerListPage } from '../features/customers/routes/CustomerListPage';
import { AddCustomerPage } from '../features/customers/routes/AddCustomerPage';
import { VendorListPage } from '../features/vendors/routes/VendorListPage';
import { AddVendorPage } from '../features/vendors/routes/AddVendorPage';
import { AddProductPage } from '../features/products/routes/AddProductPage';
import { DriverListPage } from '../features/transport/routes/DriverListPage';
import { AddDriverPage } from '../features/transport/routes/AddDriverPage';
import { VehicleListPage } from '../features/transport/routes/VehicleListPage';
import { AddVehiclePage } from '../features/transport/routes/AddVehiclePage';

const staffNavItems: any[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { 
    label: 'Master', 
    icon: Database, 
    path: '/master',
    children: [
      { label: 'Users', path: '/master/users', icon: Users, adminOnly: true },
      { 
        label: 'Transportation', 
        icon: Truck, 
        path: '/master/transport',
        children: [
          { label: 'Drivers', path: '/master/transport/drivers', icon: User },
          { label: 'Vehicles', path: '/master/transport/vehicles', icon: Truck },
        ]
      },
      { label: 'Products', path: '/master/products', icon: Package },
      { label: 'Customers', path: '/master/customers', icon: UserCircle },
      { label: 'Vendors', path: '/master/vendors', icon: Building },
    ]
  },
  { label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { label: 'Dispatch', icon: ClipboardCheck, path: '/dispatch' },
  { label: 'Control Room', icon: Gauge, path: '/control-room' },
  { label: 'Weighbridge', icon: Scale, path: '/weighbridge' },
  { label: 'Gate Security', icon: ShieldCheck, path: '/gate' },
  { label: 'Driver Mode', icon: Truck, path: '/driver' },
  { label: 'Delivery', icon: MapPin, path: '/delivery' },
  { label: 'Finance', icon: FileText, path: '/finance' },
  { label: 'MIS Reports', icon: BarChart3, path: '/mis' },
  { label: 'Audit Logs', icon: ClipboardList, path: '/audit' },
  { label: 'Demo Mode', icon: Play, path: '/demo' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

const customerNavItems = [
  { label: 'Dashboard', icon: Home, path: '/customer/dashboard' },
  { label: 'My Orders', icon: Package, path: '/customer/orders' },
  { label: 'Place Order', icon: PlusCircle, path: '/customer/orders/new' },
  { label: 'Documents', icon: FolderOpen, path: '/customer/documents' },
  { label: 'Profile', icon: UserCircle, path: '/customer/profile' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

function Header({ isStaff, user, sidebarCollapsed, onToggleSidebar }: { isStaff: boolean; user: any; sidebarCollapsed: boolean; onToggleSidebar: () => void }) {
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
        <button className="header-toggle" onClick={onToggleSidebar}>
          {sidebarCollapsed ? <Menu size={20} /> : <Menu size={20} />}
        </button>
        <div className="header-logo ml-2">
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

function SidebarItem({ item, collapsed, pathname, isSystemAdmin }: { item: any, collapsed: boolean, pathname: string, isSystemAdmin: boolean }) {
  const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
  const [isOpen, setIsOpen] = useState(active);

  // Filter children based on permissions
  const visibleChildren = (item.children || []).filter((child: any) => !child.adminOnly || isSystemAdmin);
  const reallyHasChildren = visibleChildren.length > 0;

  if (reallyHasChildren && !collapsed) {
    return (
      <div className="sidebar-group">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`sidebar-item ${active ? 'active' : ''}`}
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
          <div style={{ marginLeft: 'auto' }}>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </button>
        {isOpen && (
          <div className="sidebar-sub-items" style={{ paddingLeft: '16px', background: 'rgba(0,0,0,0.02)' }}>
            {visibleChildren.map((child: any) => (
              <SidebarItem key={child.path} item={child} collapsed={collapsed} pathname={pathname} isSystemAdmin={isSystemAdmin} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={`sidebar-item ${active ? 'active' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      <item.icon size={20} />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

function Sidebar({ isStaff, user, collapsed }: { isStaff: boolean; user: any; collapsed: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isSystemAdmin = user?.role === 'SYSTEM_ADMIN' || user?.role === 'Admin';
  let navItems = isStaff ? staffNavItems : customerNavItems;
  
  if (isStaff) {
    navItems = staffNavItems.filter(item => !item.adminOnly || isSystemAdmin);
  }
  
  const sectionLabel = isStaff ? 'Navigation' : 'Customer Portal';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-section-label">{sectionLabel}</div>}
        {navItems.map((item) => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} pathname={pathname} isSystemAdmin={isSystemAdmin} />
        ))}
      </nav>
    </aside>
  );
}

function RootLayout() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const user = useAuthStore((state: any) => state.user);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isStaff = user?.userType === UserType.STAFF || user?.role === 'STAFF' || user?.role === 'SYSTEM_ADMIN' || user?.role === 'Admin';

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="app-shell">
      <Sidebar isStaff={isStaff} user={user} collapsed={sidebarCollapsed} />
      <div className={`main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header 
          isStaff={isStaff} 
          user={user} 
          sidebarCollapsed={sidebarCollapsed} 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

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

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: () => (
    <AuthGuard>
      <OrdersPage />
    </AuthGuard>
  ),
});

const orderDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders/$orderId",
  component: () => (
    <AuthGuard>
      <OrderDetailsPage />
    </AuthGuard>
  ),
});

const createOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders/new",
  component: () => (
    <AuthGuard>
      <CreateOrderPage />
    </AuthGuard>
  )
});

// New Routes
const dispatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dispatch',
  component: () => <AuthGuard><DispatchPage /></AuthGuard>,
});

const controlRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/control-room',
  component: () => <AuthGuard><ControlRoomPage /></AuthGuard>,
});

const weighbridgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/weighbridge',
  component: () => <AuthGuard><WeighbridgePage /></AuthGuard>,
});

const gateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gate',
  component: () => <AuthGuard><GateSecurityPage /></AuthGuard>,
});

const driverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/driver',
  component: () => <AuthGuard><DriverPage /></AuthGuard>,
});

const deliveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/delivery',
  component: () => <AuthGuard><DeliveryPage /></AuthGuard>,
});

const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance',
  component: () => <AuthGuard><FinancePage /></AuthGuard>,
});

const misRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mis',
  component: () => <AuthGuard><ReportsPage /></AuthGuard>,
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audit',
  component: () => <AuthGuard><AuditPage /></AuthGuard>,
});

const transportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transport',
  component: () => <AuthGuard><TransportPage /></AuthGuard>,
});

const demoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/demo',
  component: () => <AuthGuard><DemoPage /></AuthGuard>,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <AuthGuard><SettingsPage /></AuthGuard>,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: () => <AuthGuard><UserManagementPage /></AuthGuard>,
});

// Customer Routes
const customerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/dashboard',
  component: () => <AuthGuard><DashboardPage /></AuthGuard>,
});

const customerOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/orders',
  component: () => <AuthGuard><OrdersPage /></AuthGuard>,
});

const customerCreateOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/orders/new',
  component: () => <AuthGuard><CreateOrderPage /></AuthGuard>,
});

const customerDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/documents',
  component: () => <AuthGuard><DocumentsPage /></AuthGuard>,
});

const customerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/profile',
  component: () => <AuthGuard><ProfilePage /></AuthGuard>,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  signupRoute,
  dashboardRoute,
  indexRoute,
  productsRoute,
  ordersRoute,
  orderDetailsRoute,
  createOrderRoute,
  dispatchRoute,
  controlRoomRoute,
  weighbridgeRoute,
  gateRoute,
  driverRoute,
  deliveryRoute,
  financeRoute,
  misRoute,
  auditRoute,
  transportRoute,
  demoRoute,
  settingsRoute,
  usersRoute,
  customerDashboardRoute,
  customerOrdersRoute,
  customerCreateOrderRoute,
  customerDocumentsRoute,
  customerProfileRoute,
  // Master Routes
  createRoute({ getParentRoute: () => rootRoute, path: '/master/users', component: () => <AuthGuard><UserManagementPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/transport/drivers', component: () => <AuthGuard><DriverListPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/transport/vehicles', component: () => <AuthGuard><VehicleListPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/products', component: () => <AuthGuard><ProductsPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/customers', component: () => <AuthGuard><CustomerListPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/vendors', component: () => <AuthGuard><VendorListPage /></AuthGuard> }),
  // Add routes
  createRoute({ getParentRoute: () => rootRoute, path: '/master/users/add', component: () => <AuthGuard><UserManagementPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/products/add', component: () => <AuthGuard><AddProductPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/customers/add', component: () => <AuthGuard><AddCustomerPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/vendors/add', component: () => <AuthGuard><AddVendorPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/transport/drivers/add', component: () => <AuthGuard><AddDriverPage /></AuthGuard> }),
  createRoute({ getParentRoute: () => rootRoute, path: '/master/transport/vehicles/add', component: () => <AuthGuard><AddVehiclePage /></AuthGuard> }),
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

