import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaUserGraduate, FaBuilding, FaSearch, FaUserTie, FaSave, FaSyncAlt } from 'react-icons/fa';

export default function AllotMentors() {
  const [internships, setInternships] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [intR, mentorR] = await Promise.all([
        api.get('/internships?status=approved'),
        api.get('/auth/mentors')
      ]);
      setInternships(intR.data);
      setMentors(mentorR.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const save = async (internshipId) => {
    try {
      const mentorId = assignments[internshipId];
      if (mentorId === undefined) return;

      await api.put(`/internships/${internshipId}/mentor`, { mentorId });
      toast.success('Mentor updated for this internship!');
      fetchData(); // Refresh list to see updated data
    } catch (err) {
      toast.error('Failed to update mentor');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Allot <span className="text-purple-400">Mentors</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Assign or update professional mentors for approved internships</p>
        </div>
        <button 
          onClick={fetchData} 
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
          title="Refresh List"
        >
          <FaSyncAlt className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-[#0d0d22]/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Student</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Internship Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Current Mentor</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Assign New</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">Loading internships...</td></tr>
              ) : internships.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">No approved internships found</td></tr>
              ) : (
                internships.map((i) => (
                  <tr key={i._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                          <FaUserGraduate />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{i.student?.name}</p>
                          <p className="text-[10px] text-gray-500">{i.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                          <FaBuilding className="text-gray-600 text-[10px]" /> {i.company}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <FaSearch className="text-gray-600 text-[9px]" /> {i.domain}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${i.mentor ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${i.mentor ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {i.mentor?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={assignments[i._id] !== undefined ? assignments[i._id] : (i.mentor?._id || '')}
                        onChange={(e) => setAssignments(prev => ({ ...prev, [i._id]: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-gray-300 focus:ring-2 focus:ring-purple-500/50 outline-none w-full max-w-[200px]"
                      >
                        <option value="" className="bg-[#07071a]">Select Mentor</option>
                        {mentors.map(m => (
                          <option key={m._id} value={m._id} className="bg-[#07071a]">{m.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => save(i._id)}
                        disabled={assignments[i._id] === undefined}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          assignments[i._id] === undefined 
                            ? 'opacity-30 cursor-not-allowed bg-white/5 text-gray-500' 
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 active:scale-95'
                        }`}
                      >
                        <FaSave /> {i.mentor ? 'Update' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}