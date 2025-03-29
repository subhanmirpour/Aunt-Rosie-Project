import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Ingredients from './pages/Ingredients';
import SalesForm from './pages/SalesForm';
import About from './pages/About';
import Unauthorized from './pages/Unauthorized'; // <-- NEW
import ProtectedRoute from './components/ProtectedRoute';
import SalesTracker from './pages/SalesTracker'; // Import tracker

import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  CurrencyDollarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'text-primary-700 bg-primary-50'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  );
}

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-auto text-sm bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded"
    >
      Logout
    </button>
  );
}

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isLoggedIn = !!localStorage.getItem('user');

  return (
    <>
      {!isLoginPage && (
        <div className="bg-white shadow px-4 mb-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 h-16">
            <NavLink to="/dashboard" icon={HomeIcon}>Dashboard</NavLink>
            <NavLink to="/products" icon={ShoppingCartIcon}>Products</NavLink>
            <NavLink to="/ingredients" icon={CubeIcon}>Ingredients</NavLink>
            <NavLink to="/sales" icon={CurrencyDollarIcon}>Sales</NavLink>
            <NavLink to="/about" icon={UserIcon}>About</NavLink>
            <NavLink to="/sales-tracker" icon={CurrencyDollarIcon}>Sales Tracker</NavLink>
            {isLoggedIn && <LogoutButton />}
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute role="admin">
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingredients"
          element={
            <ProtectedRoute role="kitchen">
              <Ingredients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute role="sales">
              <SalesForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-tracker"
          element={
            <ProtectedRoute>
              <SalesTracker />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
  