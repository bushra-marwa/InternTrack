import { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheckDouble, FaCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotifClick = (notif) => {
    if (!notif.isRead) handleMarkAsRead(notif._id);
    setIsOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95"
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#07071a] animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#0d0d22] border border-white/10 rounded-3xl shadow-2xl z-[150] overflow-hidden animate-fadeIn">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
              >
                <FaCheckDouble /> Mark All Read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotifClick(n)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.02] flex items-start gap-3 ${
                    n.isRead ? 'opacity-50' : 'bg-purple-500/[0.02]'
                  }`}
                >
                  <div className={`mt-1 flex-shrink-0 ${n.isRead ? 'text-gray-600' : 'text-purple-400'}`}>
                    <FaCircle size={8} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs leading-relaxed transition-colors ${
                      n.isRead ? 'text-gray-500' : 'text-gray-200 font-medium'
                    }`}>
                      {n.message}
                    </p>
                    <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-widest">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-white/[0.02] text-center">
             <button 
              onClick={() => { setIsOpen(false); navigate('/reports'); }}
              className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
             >
                View Activity Log
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
