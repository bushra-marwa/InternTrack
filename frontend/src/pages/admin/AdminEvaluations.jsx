import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaUserGraduate, FaFilePdf, FaCheckCircle, FaStar, FaSave, FaExclamationTriangle, FaDownload, FaPenNib, FaBuilding } from 'react-icons/fa';

export default function AdminEvaluations() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [score, setScore] = useState(85);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/internships');
      // Show all internships that have pending or completed final evaluations
      const filtered = res.data.filter(i => i.finalEvaluationStatus !== 'none');
      setInternships(filtered);
    } catch (err) {
      toast.error('Failed to load final submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelect = (i) => {
    setSelectedInternship(i);
    setScore(i.finalScore || 85);
    setFeedback(i.finalMentorFeedback || '');
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (score < 0 || score > 100) return toast.error('Score must be between 0 and 100');
    if (!feedback.trim()) return toast.error('Please provide final feedback');

    setSubmitting(true);
    try {
      await api.put(`/internships/${selectedInternship._id}/admin-evaluate`, { score, feedback });
      toast.success('System evaluation record updated!');
      setSelectedInternship(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading system records...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">
          System <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Evaluations</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">Verify, review, and override final scores globally</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Submissions List */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
          {internships.length === 0 ? (
            <div className="py-24 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
              <FaCheckCircle className="mx-auto text-gray-800 text-4xl mb-4" />
              <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">No final submissions in system</p>
            </div>
          ) : (
             internships.map(i => (
              <div 
                key={i._id}
                onClick={() => handleSelect(i)}
                className={`group cursor-pointer bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 transition-all hover:bg-white/[0.05] ${
                  selectedInternship?._id === i._id ? 'ring-2 ring-blue-500/50 bg-white/[0.06]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5">
                      <FaBuilding className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-[15px] uppercase tracking-tight">{i.student?.name}</h3>
                      <p className="text-gray-500 text-[10px] font-bold">{i.company} &bull; {i.mentor ? `Mentor: ${i.mentor.name}` : 'No Mentor'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {i.finalEvaluationStatus === 'completed' ? (
                      <div className="text-right">
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Score</p>
                        <p className="text-blue-400 font-black text-lg">{i.finalScore}<span className="text-[10px] text-gray-700">/100</span></p>
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[9px] text-amber-400 font-black uppercase tracking-widest">Mentor Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Evaluation Panel */}
        {selectedInternship && (
          <div className="lg:col-span-12 xl:col-span-5 animate-slideInRight">
            <div className="bg-white/[0.05] border border-white/10 rounded-[3rem] p-10 space-y-10 backdrop-blur-3xl sticky top-24 shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Admin Override</h2>
                <button onClick={() => setSelectedInternship(null)} className="text-gray-600 hover:text-white transition-colors text-2xl">&times;</button>
              </div>

              {/* Student Summary */}
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Student's Learning Summary</p>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-gray-300 leading-relaxed italic">
                  "{selectedInternship.finalSummary}"
                </div>
              </div>

              {/* Certificate Download */}
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Completion Evidence</p>
                <a 
                  href={`http://localhost:5000/uploads/${selectedInternship.finalCertificate}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl group hover:bg-blue-500/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <FaFilePdf className="text-blue-400 text-xl" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Final_Certificate.pdf</span>
                  </div>
                  <FaDownload className="text-blue-400 group-hover:translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Evaluation Form */}
              <div className="pt-10 border-t border-white/10 space-y-8">
                <form onSubmit={handleEvaluate} className="space-y-8">
                   <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] text-gray-500 font-black uppercase tracking-widest">System Grade Override</label>
                      <span className="text-blue-400 text-2xl font-black">{score}<span className="text-[10px] text-gray-700">/100</span></span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="1"
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between px-1 text-[9px] font-black text-gray-700 uppercase tracking-[0.2em]">
                       <span>Unsatisfactory</span>
                       <span>Distinction</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] text-gray-500 font-black uppercase tracking-widest ml-1">System Feedback & Comments</label>
                    <textarea 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Override feedback or add admin notes..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                      required
                    />
                  </div>

                  {selectedInternship.finalEvaluationStatus === 'pending' && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-4">
                       <FaExclamationTriangle className="text-amber-400 mt-1" />
                       <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest leading-relaxed">
                         Mentor has not evaluated this yet. Admin update will mark it as completed.
                       </p>
                    </div>
                  )}

                  <button 
                    disabled={submitting}
                    className="w-full py-5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {submitting ? 'Applying Override...' : (
                      <>
                        <FaPenNib /> Override & Update Record
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
