import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaFileUpload, FaFilePdf, FaCheckCircle, FaHourglassHalf, FaStar, FaBuilding, FaUserTie } from 'react-icons/fa';

export default function FinalSubmission() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/internships/my');
      // Only show approved/completed internships
      const filtered = res.data.filter(i => i.status === 'approved' || i.status === 'In Progress' || i.status === 'completed');
      setInternships(filtered);
    } catch (err) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please upload your final certificate (PDF)');
    if (!summary.trim()) return toast.error('Please provide a learning summary');

    const formData = new FormData();
    formData.append('finalCertificate', file);
    formData.append('summary', summary);

    setSubmitting(true);
    try {
      await api.post(`/internships/${selectedInternship._id}/final-submit`, formData);
      toast.success('Final submission successful! Your mentor will review it soon.');
      setSelectedInternship(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 animate-pulse uppercase tracking-widest text-xs font-black">Synchronizing completion data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">
          Final <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Completion</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">Submit your certificates and get your final evaluation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Internship List */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          {internships.length === 0 ? (
            <div className="py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
              <FaFileUpload className="mx-auto text-gray-700 text-3xl mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No active internships found for completion</p>
            </div>
          ) : (
            internships.map(i => (
              <div 
                key={i._id}
                className={`group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 transition-all hover:bg-white/[0.05] ${
                  selectedInternship?._id === i._id ? 'ring-2 ring-purple-500/50 bg-white/[0.06]' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 border border-white/5">
                        <FaBuilding />
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg uppercase tracking-tight">{i.company}</h3>
                        <p className="text-gray-500 text-xs font-bold">{i.domain}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                        i.finalEvaluationStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        i.finalEvaluationStatus === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-white/5 text-gray-500 border-white/10'
                      }`}>
                        {i.finalEvaluationStatus === 'completed' ? <FaCheckCircle /> : <FaHourglassHalf />}
                        {i.finalEvaluationStatus === 'none' ? 'In Progress' : i.finalEvaluationStatus}
                      </div>
                    </div>
                  </div>

                  {i.finalEvaluationStatus === 'none' && (
                    <button 
                      onClick={() => setSelectedInternship(i)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20"
                    >
                      <FaFileUpload /> Complete Now
                    </button>
                  )}

                  {i.finalEvaluationStatus === 'completed' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 text-center space-y-2">
                       <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Final Grade</p>
                       <p className="text-3xl font-black text-white">{i.finalScore}<span className="text-sm text-gray-600 font-bold">/100</span></p>
                    </div>
                  )}
                </div>

                {i.finalEvaluationStatus === 'completed' && i.finalMentorFeedback && (
                  <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                    <p className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                       <FaStar className="text-amber-400" /> Mentor Comments
                    </p>
                    <div className="bg-white/5 rounded-2xl p-6 text-sm text-gray-300 italic border border-white/5">
                      "{i.finalMentorFeedback}"
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right: Submission Side Panel */}
        {selectedInternship && (
          <div className="lg:col-span-12 xl:col-span-5 animate-slideInRight">
            <div className="bg-white/[0.05] border border-white/10 rounded-[3rem] p-10 space-y-8 backdrop-blur-3xl sticky top-24 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Finish {selectedInternship.company}</h2>
                <button 
                  onClick={() => setSelectedInternship(null)}
                  className="w-10 h-10 rounded-2xl bg-white/5 text-gray-500 flex items-center justify-center hover:text-white transition-all"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[11px] text-gray-500 font-black uppercase tracking-widest ml-1">Learning Summary</label>
                  <textarea 
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Summarize your key takeaways and technical growth..."
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] text-gray-500 font-black uppercase tracking-widest ml-1">Upload Certificate (PDF Only)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-32 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 group-hover:bg-white/5 group-hover:border-purple-500/30 transition-all">
                      {file ? (
                        <>
                          <FaFilePdf className="text-emerald-400 text-2xl" />
                          <p className="text-[10px] text-white font-black truncate max-w-[200px]">{file.name}</p>
                        </>
                      ) : (
                        <>
                          <FaFileUpload className="text-gray-600 text-2xl" />
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Select Certificate</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Delivering Submission...' : 'Finish & Request Evaluation'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
