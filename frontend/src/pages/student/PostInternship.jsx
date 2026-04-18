import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaFileUpload, FaPaperPlane, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

export default function PostInternship() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ company: '', domain: 'Full Stack', location: '', duration: '3 months', startDate: '', stipend: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/internships/my')
      .then(r => setInternships(Array.isArray(r.data) ? r.data : [r.data]))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('offerLetter', file);
      await api.post('/internships', fd);
      toast.success('Internship submitted for approval!');
      navigate('/my-internship');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Apply <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Internship</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Submit your internship details for administrative approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 mb-8">
              <FaClock className="text-purple-400 text-2xl shrink-0" />
              <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                Admin will review your application. Once approved, you will be assigned a mentor to track your weekly progress and evaluations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Company Details</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-purple-500">
                    <FaBuilding />
                  </span>
                  <input
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Company Name (e.g. Google, Microsoft)"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Domain</label>
                  <select
                    value={form.domain}
                    onChange={e => setForm({ ...form, domain: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {['Full Stack', 'Frontend', 'Backend', 'ML/AI', 'DevOps', 'Data Science', 'Android', 'UI/UX'].map(d => (
                      <option key={d} value={d} className="bg-[#07071a]">{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Duration</label>
                  <select
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {['1 month', '2 months', '3 months', '6 months'].map(d => (
                      <option key={d} value={d} className="bg-[#07071a]">{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Work Location</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500">
                      <FaMapMarkerAlt />
                    </span>
                    <input
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="e.g. Hyderabad / Remote"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Start Date</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500">
                      <FaCalendarAlt />
                    </span>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Stipend Details</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500">
                      <FaMoneyBillWave />
                    </span>
                    <input
                      value={form.stipend}
                      onChange={e => setForm({ ...form, stipend: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="e.g. ₹15,000 / month"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Offer Letter (PDF/IMG)</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500">
                      <FaFileUpload />
                    </span>
                    <input
                      type="file"
                      onChange={e => setFile(e.target.files[0])}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 pl-12 text-white text-xs outline-none focus:ring-2 focus:ring-purple-500/50 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
              >
                {loading ? 'Processing...' : (
                  <>
                    Submit Application <FaPaperPlane className="text-xs" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest">Recent Applications ({internships.length})</h2>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {internships.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                <p className="text-gray-600 text-sm font-medium">Your submission history will appear here</p>
              </div>
            ) : (
              internships.map((i, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-3xl p-6 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">{i.company}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                        <span>{i.domain}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span>{i.duration}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                      i.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      i.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {i.status === 'approved' ? <FaCheckCircle size={10} /> : 
                       i.status === 'pending' ? <FaHourglassHalf size={10} /> : 
                       <FaTimesCircle size={10} />}
                      {i.status}
                    </div>
                  </div>
                  
                  {i.mentor ? (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                          <FaMapMarkerAlt size={12} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-none mb-1">Assigned Mentor</p>
                          <p className="text-white text-xs font-bold">{i.mentor.name}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-gray-600 font-bold uppercase italic italic">Awaiting administrative processing...</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}