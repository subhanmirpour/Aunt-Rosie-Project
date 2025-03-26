import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import Ingredients from './pages/Ingredients';
import SalesForm from './pages/SalesForm';
import About from './pages/About';
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
        ${isActive
          ? 'text-primary-700 bg-primary-50'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
        }`}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  );
}

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

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
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<h1 className="text-2xl text-center mt-8">Welcome to Aunt Rosie's Dashboard!</h1>} />
        <Route path="/products" element={<Products />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/sales" element={<SalesForm />} />
        <Route path="/about" element={<About />} />
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
