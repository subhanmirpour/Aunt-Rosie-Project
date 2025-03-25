import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products';

function App() {
  return (
    <Router>
      <div className="bg-white shadow p-4 mb-4 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link to="/products" className="text-blue-600 hover:underline">Products</Link>
      </div>
      <Routes>
        <Route path="/" element={<h1 className="text-2xl text-center">Welcome to Aunt Rosie’s</h1>} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;
