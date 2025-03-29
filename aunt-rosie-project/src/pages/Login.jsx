import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase/supabaseClient'; // adjust the path if needed

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // using username now
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) navigate('/dashboard');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');

    // Call the RPC function to check login credentials
    const { data, error: loginError } = await supabase.rpc('login_employee', {
      in_username: username,
      in_password: password,
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }
    if (!data || data.length === 0) {
      setError('Invalid username or password.');
      return;
    }
    
    // Successful login: store user info and navigate
    const loggedInUser = data[0];
    localStorage.setItem('user', JSON.stringify({ username: loggedInUser.username, role }));
    navigate('/dashboard');
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url('/piepic.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-sm w-full relative z-10 text-center">
        <div className="text-6xl animate-bounce mb-2">🥧</div>
        <h1 className="text-4xl font-bold text-rose-700 mt-2">Aunt Rosie’s</h1>
        <p className="text-gray-600 mb-6">{isRegistering ? 'Register an Account' : 'Welcome Back!'}</p>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-rose-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-rose-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role Selector */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="kitchen">Kitchen Assistant</option>
            <option value="sales">Sales Staff</option>
          </select>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          {isRegistering ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-rose-600 hover:underline font-medium"
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
