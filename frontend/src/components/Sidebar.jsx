import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MENUS = {
  student: [
    { to: '/dashboard',      icon: '📊', label: 'Dashboard' },
    { to: '/post-internship', icon: '📋', label: 'Post Internship' },
    { to: '/upload-report', icon: '📋', label: 'Upload Report' },
    { to: '/my-internship',   icon: '🏢', label: 'My Internship' },
    { to: '/submit-report',  icon: '📝', label: 'Submit Report' },
    { to: '/reports',        icon: '📋', label: 'My Reports' },
    { to: '/my-scorecard',   icon: '🏆', label: 'My Scorecard' },
  ],
  mentor: [
    { to: '/dashboard',        icon: '📊', label: 'Dashboard' },
    { to: '/my-students',      icon: '👨‍🎓', label: 'My Students' },
    { to: '/reports',          icon: '📋', label: 'Student Reports' },
    { to: '/evaluate',         icon: '⭐', label: 'Evaluate' },
  ],
  admin: [
    { to: '/dashboard',      icon: '📊', label: 'Dashboard' },
    { to: '/internship-requests',  icon: '📋', label: 'Internship Requests' },
    { to: '/students',       icon: '👨‍🎓', label: 'All Students' },
    { to: '/reports',        icon: '📋', label: 'All Reports' },
    { to: '/allot-mentors',  icon: '👥', label: 'Allot Mentors' },
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
    student: 'from-teal-500 to-cyan-500',
    mentor:  'from-amber-500 to-orange-500',
    admin:   'from-purple-500 to-violet-600',
  };

  return (
    <aside className="w-52 bg-[#0b0b20] border-r border-purple-500/15 flex flex-col py-4 px-2.5 min-h-[calc(100vh-3.5rem)]">
      <div className="flex items-center gap-2.5 px-2 pb-4 mb-2 border-b border-white/5">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradients[user.role]} flex items-center justify-center text-xs font-black text-white flex-shrink-0`}>
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{user.name}</p>
          <p className="text-xs text-purple-400 capitalize">{user.role} Portal</p>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-purple-600/22 text-purple-300 border-l-2 border-purple-500'
                  : 'text-gray-600 hover:text-gray-300 hover:bg-white/4'
              }`
            }
          >
            <span className="text-sm w-4 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}