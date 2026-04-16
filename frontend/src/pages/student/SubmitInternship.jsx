import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function SubmitInternship() {
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    company: '',
    domain: '',
    location: '',
    duration: ''
  });

  // ✅ Check existing internship
  useEffect(() => {
    api.get('/internships/my')
      .then(res => setInternship(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ✅ Submit internship
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/internships', form);
      toast.success('Internship submitted successfully!');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
  };

  // 🔄 Loading
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  // 🔒 If already submitted → show status
  if (internship && internship.status !== 'rejected') {
  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#fff' }}>
        Internship <span style={{ color: '#a855f7' }}>Status</span>
      </h2>

      <div style={{
        marginTop: '20px',
        background: '#0d0d22',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <p style={{ color: '#ccc' }}>
          <strong>Status:</strong>{' '}
          <span style={{
            color:
              internship.status === 'approved'
                ? '#4ade80'
                : internship.status === 'rejected'
                ? '#f87171'
                : '#facc15'
          }}>
            {internship.status}
          </span>
        </p>

        <p style={{ color: '#aaa', marginTop: '10px' }}>
          <strong>Admin Message:</strong><br />
          {internship.adminFeedback || 'Waiting for admin review...'}
        </p>
      </div>
    </div>
  );
}

  // 📝 Form UI
  return (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>
        Submit <span style={{ color: '#a855f7' }}>Internship</span>
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        <input
          placeholder="Company Name"
          value={form.company}
          onChange={e => setForm({ ...form, company: e.target.value })}
          required
        />

        <input
          placeholder="Domain (e.g. Web Development)"
          value={form.domain}
          onChange={e => setForm({ ...form, domain: e.target.value })}
          required
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          required
        />

        <input
          placeholder="Duration (e.g. 3 Months)"
          value={form.duration}
          onChange={e => setForm({ ...form, duration: e.target.value })}
          required
        />

        <button
          type="submit"
          style={{
            background: '#7c3aed',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Submit Internship
        </button>

      </form>
    </div>
  );
}