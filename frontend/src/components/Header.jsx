import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaSignOutAlt, FaRocket, FaFileAlt } from 'react-icons/fa';
import NotificationBell from './NotificationBell';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const badgeClass = {
    student: 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-lg shadow-teal-500/5',
    mentor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5',
    admin: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/5',
  };

  const navLinkClass = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#07071a]/70 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between z-[100] shadow-2xl">
      <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-xl shadow-purple-600/30 group-hover:shadow-purple-600/50 transition-all duration-500">
          <FaGraduationCap className="text-white text-xl" />
        </div>
        <span className="text-xl font-black text-white tracking-tight">
          InternTrack<span className="text-purple-400">.</span>
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-2">
        <Link to="/" className={`${navLinkClass} text-gray-400 hover:text-white hover:bg-white/5`}>
          Overview
        </Link>
        {user && (
          <>
            <Link to="/dashboard" className={`${navLinkClass} text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2`}>
              <FaRocket className="text-xs" /> Dashboard
            </Link>
            <Link to="/reports" className={`${navLinkClass} text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2`}>
              <FaFileAlt className="text-xs" /> Reports
            </Link>
          </>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {user && <NotificationBell />}
        {user && (
          <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/5">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Authenticated as</p>
              <p className="text-xs font-bold text-white leading-none">{user.name}</p>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black tracking-widest uppercase ${badgeClass[user.role]}`}>
              {user.role}
            </span>
          </div>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg shadow-rose-500/5 active:scale-95"
          >
            <FaSignOutAlt className="text-xs" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-white text-[#07071a] px-6 py-2 rounded-xl text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
