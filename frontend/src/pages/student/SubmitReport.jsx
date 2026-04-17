import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaBuilding, FaInfoCircle } from 'react-icons/fa';

export default function SubmitReport() {
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  const [form, setForm] = useState({
    week: 1,
    title: '',
    summary: '',
    selfRating: 8,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedInternships();
  }, []);

  const fetchApprovedInternships = async () => {
    try {
      const res = await api.get('/internships/my');
      const approved = res.data.filter(i => i.status === 'approved');
      setInternships(approved);
      // Removed auto-selection to force user to select first as requested
    } catch (err) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInternship = (id) => {
    setSelectedInternshipId(id);
    // Optional: could reset form if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInternshipId) {
      return toast.error('Please select an internship');
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('week', form.week);
    formData.append('title', form.title);
    formData.append('summary', form.summary);
    formData.append('selfRating', form.selfRating);
    formData.append('internship', selectedInternshipId);
    
    if (file) {
      formData.append('documentFile', file);
    }

    try {
      await api.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Report submitted successfully!');
      navigate('/reports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading...</p>
    </div>
  );

  if (internships.length === 0) return (
    <div className="max-w-xl mx-auto p-10 bg-[#0d0d22] border border-dashed border-white/10 rounded-3xl text-center space-y-4">
      <div className="w-16 h-16 bg-rose-500/10 rounded-full mx-auto flex items-center justify-center text-rose-500">
        <FaInfoCircle size={32} />
      </div>
      <h2 className="text-white font-black text-xl">Access Restricted</h2>
      <p className="text-gray-500 text-sm">You need an approved internship to submit weekly reports.</p>
      <button 
        onClick={() => navigate('/my-internship')}
        className="mt-4 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-xs"
      >
        Track Internship Status
      </button>
    </div>
  );

  const selectedInternship = internships.find(i => i._id === selectedInternshipId);

  // STEP 1: Selection View
  if (!selectedInternshipId) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Select <span className="text-purple-400">Internship</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Pick an internship to submit your weekly report for</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.map((i) => (
            <div 
              key={i._id}
              onClick={() => handleSelectInternship(i._id)}
              className="group cursor-pointer bg-[#0d0d22] border border-white/10 rounded-[2rem] p-6 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 shadow-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                  <FaBuilding size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black text-base group-hover:text-purple-400 transition-colors uppercase tracking-tight">{i.company}</h3>
                  <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{i.domain}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-purple-500 transition-all">
                <div className="w-2 h-2 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STEP 2: Submission Form View
  return (
    <div className="max-w-xl animate-fadeIn space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSelectedInternshipId('')}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-black text-white">
            Submit <span className="text-purple-400">Week {form.week} Report</span>
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">Reporting for {selectedInternship.company} · {selectedInternship.domain}</p>
        </div>
      </div>
      
      <div className="bg-[#0d0d22] border border-white/6 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Week Number</label>
            <select
              value={form.week}
              onChange={(e) => setForm({ ...form, week: +e.target.value })}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>Week {i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Report Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Completed authentication module"
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Work Summary</label>
            <textarea
              rows={4}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Describe what you worked on this week..."
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500 resize-vertical"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Upload Document (PDF/DOCX)</label>
            <div className="relative group">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="flex items-center gap-3 w-full bg-white/5 border border-white/8 border-dashed rounded-xl px-4 py-6 text-gray-500 text-sm cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-400 group-hover:text-white transition-colors">
                    {file ? file.name : 'Click to select a file'}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-600 mt-1">Maximum size: 10MB</p>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">
              Self Rating: {form.selfRating}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={form.selfRating}
              onChange={(e) => setForm({ ...form, selfRating: +e.target.value })}
              className="w-full accent-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Report →'}
          </button>
        </form>
      </div>
    </div>
  );
}