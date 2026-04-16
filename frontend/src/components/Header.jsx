import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const badgeClass = {
    student: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
    mentor:  'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    admin:   'bg-red-500/20 text-red-300 border border-red-500/30',
  };

  return (
    <header className="bg-[#0b0b20] border-b border-purple-500/20 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-base">
          🎓
        </div>
        <span className="font-black text-white tracking-tight">
          Intern<span className="text-purple-400">Track</span>
        </span>
      </Link>

      <nav className="flex gap-1">
        <Link to="/"
          className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-purple-300 hover:bg-purple-600/10 transition">
          Home
        </Link>
        {!user && (
          <>
            <Link to="/login"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-purple-300 hover:bg-purple-600/10 transition">
              Login
            </Link>
            <Link to="/register"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-purple-300 hover:bg-purple-600/10 transition">
              Register
            </Link>
          </>
        )}
        {user && (
          <>
            <Link to="/dashboard"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-purple-300 hover:bg-purple-600/10 transition">
              Dashboard
            </Link>
            <Link to="/reports"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-purple-300 hover:bg-purple-600/10 transition">
              Reports
            </Link>
          </>
        )}
      </nav>

      <div className="flex items-center gap-3">
        {user && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${badgeClass[user.role]}`}>
            {user.role.toUpperCase()}
          </span>
        )}
        {user ? (
          <button onClick={handleLogout}
            className="text-xs text-gray-600 hover:text-red-400 border border-white/10 px-3 py-1.5 rounded-lg hover:border-red-400/30 transition">
            Sign Out
          </button>
        ) : (
          <Link to="/login"
            className="text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30 px-4 py-1.5 rounded-lg hover:bg-purple-600/30 transition font-semibold">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}