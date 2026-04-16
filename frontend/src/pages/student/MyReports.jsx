import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reports').then((r) => setReports(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black text-white">
          My <span className="text-purple-400">Reports</span>
        </h1>
        <button
          onClick={() => navigate('/submit-report')}
          className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition"
        >
          + Submit New Report
        </button>
      </div>
      <div className="bg-[#0d0d22] border border-white/6 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6">
              {['Week', 'Title', 'Submitted', 'Status', 'Score'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-600 text-xs font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-600 text-sm">
                  No reports submitted yet
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r._id} className="border-b border-white/4 hover:bg-white/2">
                  <td className="px-4 py-3">
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold">
                      Week {r.week}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{r.title}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      r.status === 'evaluated'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.score ? (
                      <span className="text-purple-400 font-black">{r.score}</span>
                    ) : (
                      <span className="text-gray-700 text-xs">Pending</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}