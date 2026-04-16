import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function SubmitReport() {
  const [form, setForm] = useState({
    week: 1,
    title: '',
    summary: '',
    link: '',
    selfRating: 8,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reports', form);
      toast.success('Report submitted successfully!');
      navigate('/reports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-black text-white mb-6">
        Submit <span className="text-purple-400">Weekly Report</span>
      </h1>
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
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">GitHub / Submission Link</label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500"
            />
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
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report →'}
          </button>
        </form>
      </div>
    </div>
  );
}