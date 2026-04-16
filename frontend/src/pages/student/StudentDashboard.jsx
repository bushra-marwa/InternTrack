import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [evals, setEvals] = useState([]);

  useEffect(() => {
    api.get('/tasks').then(r => setTasks(r.data)).catch(() => {});
    api.get('/evaluations').then(r => setEvals(r.data)).catch(() => {});
  }, []);

  const avgScore = evals.length
    ? (evals.reduce((s, e) => s + +e.overallScore, 0) / evals.length).toFixed(1)
    : '—';

  return (
    <div>
      <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/30 border border-purple-500/20 rounded-2xl p-6 mb-6">
        <h1 className="text-xl font-black text-white">Welcome back, {user?.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here is your internship overview</p>
      </div>
      <button
    onClick={() => navigate('/submit-internship')}
    className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg font-bold"
  >
    Submit Internship
  </button>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Tasks', value: tasks.length, color: 'from-purple-600 to-violet-600' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'from-teal-500 to-cyan-500' },
          { label: 'Avg Score', value: avgScore, color: 'from-pink-500 to-rose-500' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0d0d22] border border-white/6 rounded-2xl p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.color}`} />
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-gray-600 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#0d0d22] border border-white/6 rounded-2xl p-5">
        <h2 className="text-purple-300 font-bold text-sm mb-4">Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-sm">No tasks assigned yet.</p>
        ) : (
          tasks.slice(0, 5).map(task => (
            <div key={task._id} className="flex items-center gap-3 py-2.5 border-b border-white/4 last:border-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                task.status === 'completed' ? 'bg-green-400' :
                task.status === 'overdue' ? 'bg-red-400' : 'bg-amber-400'
              }`} />
              <span className="text-sm text-gray-300 flex-1">{task.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-green-500/20 text-green-400'
              }`}>{task.priority}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}