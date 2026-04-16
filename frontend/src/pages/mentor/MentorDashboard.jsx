import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function MentorDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // ✅ FIX 1: get ONLY mentor reports
    api.get('/reports/mentor')
      .then(r => setReports(r.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ FIX 2: correct status
  const pending = reports.filter(r => r.status === 'pending').length;

  return (
    <div>
      <h1 className="text-xl font-black text-white mb-6">
        Mentor <span className="text-purple-400">Dashboard</span>
      </h1>
      <button
  onClick={() => window.location.href = '/mentor/reports'}
  style={{ marginBottom: '20px' }}
>
  Review Reports →
</button>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Reports', value: reports.length },
          { label: 'Pending Review', value: pending },
          { label: 'Evaluated', value: reports.length - pending },
        ].map((s, i) => (
          <div key={i} className="bg-[#0d0d22] border border-white/6 rounded-2xl p-5">
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-gray-600 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Reports */}
      <div className="bg-[#0d0d22] border border-white/6 rounded-2xl p-5">
        <h2 className="text-purple-300 font-bold text-sm mb-4">
          Pending Student Reports
        </h2>

        {reports
          .filter(r => r.status === 'pending') // ✅ FIX 3
          .map(r => (
            <div key={r._id} className="flex items-center gap-3 py-2.5 border-b border-white/4">
              <span className="w-2 h-2 rounded-full bg-amber-400" />

              <div className="flex-1">
                <p className="text-sm text-gray-300">{r.title}</p>
                <p className="text-xs text-gray-600">
                  {r.student?.name} · Week {r.week}
                </p>
              </div>

              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                Pending
              </span>
            </div>
          ))}

        {reports.filter(r => r.status === 'pending').length === 0 && (
          <p className="text-gray-600 text-sm">All reports evaluated!</p>
        )}
      </div>
    </div>
  );
}