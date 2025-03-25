import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Products from './pages/Products';
import Ingredients from './pages/Ingredients';
import SalesForm from './pages/SalesForm';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  CubeIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

// eslint-disable-next-line no-unused-vars
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

function App() {
  return (
    <Router>
      <div className="bg-white shadow px-4 mb-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 h-16">
          <NavLink to="/" icon={HomeIcon}>Dashboard</NavLink>
          <NavLink to="/products" icon={ShoppingCartIcon}>Products</NavLink>
          <NavLink to="/ingredients" icon={CubeIcon}>Ingredients</NavLink>
          <NavLink to="/sales" icon={CurrencyDollarIcon}>Sales</NavLink>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<h1 className="text-2xl text-center">Welcome to Aunt Rosie's</h1>} />
        <Route path="/products" element={<Products />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/sales" element={<SalesForm />} />
      </Routes>
    </Router>
  );
}

export default App;
