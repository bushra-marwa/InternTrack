import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05050f] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full bg-purple-600/10 blur-3xl top-0 left-0 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-pink-600/8 blur-3xl bottom-0 right-0 pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 rounded-full px-4 py-1.5 text-xs text-purple-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Summer 2026 Batch Active
        </div>

        <h1 className="text-5xl font-black text-white leading-tight mb-4">
          Internship Monitoring<br />
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Made Brilliant
          </span>
        </h1>

        <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
          Track interns, evaluate reports, manage attendance and
          generate scorecards — one platform for everyone.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition hover:-translate-y-0.5"
          >
            Get Started →
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-transparent border border-purple-500/40 text-purple-300 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-purple-600/10 transition"
          >
            Register Now
          </button>
        </div>

        <div className="flex gap-10 justify-center mt-12">
          {[
            { n: '48+', l: 'Active Interns' },
            { n: '3',   l: 'Roles Supported' },
            { n: '98%', l: 'Satisfaction' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-2xl font-black text-white">{s.n}</div>
              <div className="text-xs text-gray-600 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}