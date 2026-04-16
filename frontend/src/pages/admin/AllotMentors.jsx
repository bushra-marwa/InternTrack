import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AllotMentors() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors]   = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    api.get('/students').then((r) => setStudents(r.data)).catch(() => {});
    api.get('/auth/mentors').then((r) => setMentors(r.data)).catch(() => {});
  }, []);

  const save = async (studentId) => {
    try {
      await api.put(`/students/${studentId}`, {
        mentor: assignments[studentId],
      });
      toast.success('Mentor updated!');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-black text-white mb-6">
        Allot <span className="text-purple-400">Mentors</span>
      </h1>
      <div className="bg-[#0d0d22] border border-white/6 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6">
              {['Student', 'Domain', 'Current Mentor', 'Assign Mentor', 'Action'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-600 text-xs font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-600 text-sm">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s._id} className="border-b border-white/4 hover:bg-white/2">
                  <td className="px-4 py-3 text-white font-medium">{s.user?.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.internshipDomain}</td>
                  <td className="px-4 py-3 text-purple-400 text-xs">
                    {s.mentor?.name || 'Not assigned'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={assignments[s._id] || s.mentor?._id || ''}
                      onChange={(e) =>
                        setAssignments((prev) => ({ ...prev, [s._id]: e.target.value }))
                      }
                      className="bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select mentor</option>
                      {mentors.map((m) => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => save(s._id)}
                      className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-500/25 transition font-bold"
                    >
                      Update
                    </button>
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