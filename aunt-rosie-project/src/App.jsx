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
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import SalesTracker from './pages/SalesTracker';
import Footer from './components/Footer';
import UserManagement from './pages/UserManagement';
import Timetable from './pages/Timetable';
import LabelGeneration from './pages/LabelGeneration';
import AddCustomer from './pages/AddCustomer';

import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  CurrencyDollarIcon,
  UserIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
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
    <div className="flex flex-col min-h-screen">
      {/* Header / Navigation */}
      {!isLoginPage && (
        <div className="bg-white shadow px-4 mb-4">
          <div className="max-w-8xl mx-auto flex items-center justify-between h-16 px-4">
            {/* Centered navigation links */}
            <div className="flex space-x-2 justify-center flex-grow">
              <NavLink to="/dashboard" icon={HomeIcon}>Dashboard</NavLink>
              <NavLink to="/products" icon={ShoppingCartIcon}>Products</NavLink>
              <NavLink to="/ingredients" icon={CubeIcon}>Ingredients</NavLink>
              <NavLink to="/sales" icon={CurrencyDollarIcon}>Sales</NavLink>
              <NavLink to="/sales-tracker" icon={CurrencyDollarIcon}>Sales Tracker</NavLink>
              <NavLink to="/usermanagement" icon={UserIcon}>User Management</NavLink>
              <NavLink to="/timetable" icon={ClockIcon}>Time Table</NavLink>
              <NavLink to="/labelgeneration" icon={TagIcon}>Label Generation</NavLink>
              <NavLink to="/about" icon={UserIcon}>About</NavLink>
            </div>
            {/* Logout button aligned to the right */}
            {isLoggedIn && <LogoutButton />}
          </div>

        </div>
      )}

      {/* Main content */}
      <main className="flex-grow">
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
            path="/add-customer"
            element={
              <ProtectedRoute role="sales">
                <AddCustomer />
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
          <Route
            path="/usermanagement"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <Timetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/labelgeneration"
            element={
              <ProtectedRoute role="admin">
                <LabelGeneration />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>

      {/* Footer always stays at the bottom */}
      {!isLoginPage && <Footer />}
    </div>
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
