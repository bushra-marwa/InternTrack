import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaChartBar, FaFileUpload, FaBuilding, FaPenNib, FaFileAlt, FaTrophy, 
  FaUserGraduate, FaStar, FaClipboardList, FaUsers, FaUserPlus, FaCheckCircle
} from 'react-icons/fa';

const MENUS = {
  student: [
    { to: '/dashboard',      icon: <FaChartBar />, label: 'Dashboard' },
    { to: '/post-internship', icon: <FaClipboardList />, label: 'Post Internship' },
    { to: '/my-internship',   icon: <FaBuilding />, label: 'My Internship' },
    { to: '/submit-report',  icon: <FaPenNib />, label: 'Submit Report' },
    { to: '/reports',        icon: <FaFileAlt />, label: 'My Reports' },
    { to: '/final-submission', icon: <FaCheckCircle />, label: 'Internship Completion Certificate' },
    { to: '/my-scorecard',   icon: <FaTrophy />, label: 'My Scorecard' },
  ],
  mentor: [
    { to: '/dashboard',        icon: <FaChartBar />, label: 'Dashboard' },
    { to: '/my-students',      icon: <FaUserGraduate />, label: 'My Students' },
    { to: '/reports',          icon: <FaFileAlt />, label: 'Student Reports' },
    { to: '/final-evaluations', icon: <FaCheckCircle />, label: 'Final Evaluations' },
  ],
  admin: [
    { to: '/dashboard',      icon: <FaChartBar />, label: 'Dashboard' },
    { to: '/internship-requests',  icon: <FaClipboardList />, label: 'Internship Requests' },
    { to: '/students',       icon: <FaUserGraduate />, label: 'All Students' },
    { to: '/reports',        icon: <FaFileAlt />, label: 'All Reports' },
    { to: '/allot-mentors',  icon: <FaUserPlus />, label: 'Allot Mentors' },
    { to: '/system-evaluations', icon: <FaCheckCircle />, label: 'System Evaluations' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const items = MENUS[user.role] || [];
  const initials = user.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const gradients = {
    student: 'from-emerald-400 to-cyan-500',
    mentor:  'from-orange-400 to-rose-500',
    admin:   'from-purple-500 to-indigo-600',
  };

  return (
    <aside className="w-64 bg-[#07071a] border-r border-white/5 flex flex-col py-8 px-4 h-full overflow-y-auto">
      <div className="flex flex-col items-center text-center pb-8 mb-8 border-b border-white/5">
        <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${gradients[user.role]} flex items-center justify-center text-xl font-black text-white shadow-2xl shadow-purple-600/20 mb-4 animate-glow`}>
          {initials}
        </div>
        <div className="w-full px-2">
          <p className="text-sm font-black text-white truncate mb-0.5">{user.name}</p>
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{user.role} Account</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">Main Menu</p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/10 to-transparent text-white border-l-4 border-purple-500 shadow-xl shadow-purple-600/5'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`
            }
          >
            <span className={`text-lg transition-transform duration-300 group-hover:scale-110`}>
              {item.icon}
            </span>
            <span className="tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-white/5 rounded-3xl p-5 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-500/10 blur-xl group-hover:bg-purple-500/20 transition-all duration-500" />
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Support</p>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Having trouble? Access our help center.</p>
          <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-white transition-all uppercase tracking-widest">
            Help Center
          </button>
        </div>
      </div>
    </aside>
  );
}