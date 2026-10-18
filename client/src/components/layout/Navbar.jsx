import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  isActive
    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 py-5'
    : 'text-gray-600 hover:text-indigo-600 py-5';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Wallet size={22} />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              Expense<span className="text-indigo-600">Tracker</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 hidden md:inline">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-gray-600 hover:text-red-600"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile links (the desktop ones are hidden below the sm breakpoint) */}
      <div className="sm:hidden flex gap-6 px-4 pb-2 text-sm border-t border-gray-100">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold py-2' : 'text-gray-600 py-2')}>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'text-indigo-600 font-semibold py-2' : 'text-gray-600 py-2')}>
          Transactions
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;