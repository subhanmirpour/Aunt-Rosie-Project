// src/components/Footer.jsx
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-rose-50 border-t border-rose-100 mt-20"> {/* <-- increased from mt-10 to mt-20 */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Aunt Rosie’s. All rights reserved.</p>

        <div className="flex gap-6">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/sales" className="hover:underline">Sales</a>
          <a href="/products" className="hover:underline">Products</a>
        </div>

        <div className="flex gap-4 text-rose-500">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="w-5 h-5 hover:text-rose-700" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="w-5 h-5 hover:text-rose-700" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="w-5 h-5 hover:text-rose-700" />
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-rose-400 pb-4">
        💬 <a href="https://www.google.com/maps/place/Aunt+Rosie/reviews" target="_blank" rel="noopener noreferrer" className="underline hover:text-rose-600">
          Leave us a review!
        </a>
      </div>
    </footer>
  );
}
