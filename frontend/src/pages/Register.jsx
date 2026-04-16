import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' ,department:''});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#07071a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xl">🎓</div>
            <span className="text-xl font-black text-white">Intern<span className="text-purple-400">Track</span></span>
          </div>
          <p className="text-gray-600 text-sm">Create your free account</p>
        </div>
        <div className="bg-[#0d0d22] border border-white/8 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 font-bold mb-1.5 block">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder={placeholder}
                  required
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">Role</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="student">Student / Intern</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
  <label className="text-xs text-gray-500 font-bold mb-1.5 block">
    Department
  </label>
  <select
    value={form.department}
    onChange={e => setForm({ ...form, department: e.target.value })}
    className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
    required
  >
    <option value="">Select Department</option>
    <option value="CSE">CSE</option>
    <option value="CSM">CSM</option>
    <option value="CSO">CSO</option>
    <option value="CSN">CSN</option>
    <option value="IT">IT</option>
    <option value="ECE">ECE</option>
    <option value="EEE">EEE</option>
    <option value="MECH">MECH</option>
    <option value="CIVIL">CIVIL</option>
  </select>
</div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}