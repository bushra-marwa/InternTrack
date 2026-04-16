import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function EvaluateStudents() {
  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState(null)
  const [scores, setScores] = useState({ technicalSkills:8, communication:8, teamwork:8, punctuality:8 })
  const [score, setScore] = useState(8)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    api.get('/reports')
      .then(r => setReports(r.data.filter(r => r.status === 'submitted')))
      .catch(() => {})
  }, [])

  const handleEvaluate = async (e) => {
    e.preventDefault()
    if (!feedback.trim()) { toast.error('Write feedback first'); return }
    try {
      await api.put(`/reports/${selected._id}/evaluate`, { score, feedback })
      await api.post('/evaluations', {
        student: selected.student._id,
        week: selected.week,
        ...scores,
        remarks: feedback,
      })
      toast.success('Evaluation saved!')
      setReports(prev => prev.filter(r => r._id !== selected._id))
      setSelected(null)
      setFeedback('')
      setScore(8)
    } catch { toast.error('Failed') }
  }

  const inp = { width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'9px', padding:'9px 12px', color:'#e2e2f0', fontSize:'0.82rem', outline:'none', fontFamily:'inherit' }

  if (selected) return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
      {/* Report View */}
      <div>
        <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'0.8rem', marginBottom:'14px' }}>← Back</button>
        <div style={{ background:'#0d0d22', border:'1px solid rgba(255,255,255,.06)', borderRadius:'14px', padding:'18px' }}>
          <div style={{ color:'#fff', fontWeight:900, fontSize:'0.95rem', marginBottom:'4px' }}>{selected.title}</div>
          <div style={{ color:'#666', fontSize:'0.72rem', marginBottom:'14px' }}>{selected.student?.name} · Week {selected.week}</div>
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:'10px', padding:'14px', marginBottom:'14px' }}>
            <div style={{ color:'#a78bfa', fontSize:'0.68rem', fontWeight:700, marginBottom:'8px' }}>WORK SUMMARY</div>
            <p style={{ color:'#888', fontSize:'0.8rem', lineHeight:'1.65' }}>{selected.summary}</p>
          </div>
          {selected.documentFile && (
            <div style={{ background:'rgba(96,165,250,.08)', border:'1px solid rgba(96,165,250,.2)', borderRadius:'10px', padding:'12px', marginBottom:'12px' }}>
              <div style={{ color:'#60a5fa', fontSize:'0.72rem', fontWeight:700, marginBottom:'6px' }}>📄 SUBMITTED DOCUMENT</div>
              <a href={`http://localhost:5000/uploads/${selected.documentFile}`} target="_blank" rel="noreferrer"
                style={{ color:'#60a5fa', fontSize:'0.8rem', fontWeight:700, textDecoration:'none' }}>
                📎 View / Download Report
              </a>
            </div>
          )}
          {selected.link && (
            <a href={selected.link} target="_blank" rel="noreferrer"
              style={{ color:'#a78bfa', fontSize:'0.75rem', display:'block' }}>
              🔗 View GitHub / Project →
            </a>
          )}
          <div style={{ marginTop:'10px', fontSize:'0.72rem', color:'#555' }}>
            Self Rating: {selected.selfRating || '—'}/10
          </div>
        </div>
      </div>

      {/* Eval Form */}
      <div style={{ background:'#0d0d22', border:'1px solid rgba(255,255,255,.06)', borderRadius:'14px', padding:'18px' }}>
        <div style={{ color:'#c4b5fd', fontWeight:700, fontSize:'0.82rem', marginBottom:'14px' }}>Evaluation Form</div>
        <form onSubmit={handleEvaluate}>
          {[['technicalSkills','Technical Skills'],['communication','Communication'],['teamwork','Teamwork'],['punctuality','Punctuality']].map(([key,label]) => (
            <div key={key} style={{ marginBottom:'10px' }}>
              <label style={{ display:'block', fontSize:'0.68rem', color:'#777', marginBottom:'4px', fontWeight:700 }}>
                {label}: <span style={{ color:'#a78bfa', fontWeight:900 }}>{scores[key]}</span>/10
              </label>
              <input type="range" min="1" max="10" step="1" value={scores[key]}
                onChange={e => setScores(prev => ({...prev,[key]:+e.target.value}))}
                style={{ width:'100%', accentColor:'#6c3fff' }} />
            </div>
          ))}
          <div style={{ marginBottom:'12px' }}>
            <label style={{ display:'block', fontSize:'0.68rem', color:'#777', marginBottom:'4px', fontWeight:700 }}>
              Overall Score: <span style={{ color:'#a78bfa', fontWeight:900 }}>{score}</span>/10
            </label>
            <input type="range" min="1" max="10" step="0.5" value={score}
              onChange={e => setScore(+e.target.value)}
              style={{ width:'100%', accentColor:'#ec4899' }} />
          </div>
          <div style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'0.68rem', color:'#777', marginBottom:'4px', fontWeight:700 }}>Written Feedback *</label>
            <textarea style={{ ...inp, height:'90px', resize:'none' }}
              placeholder="Write detailed feedback for the student..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              required />
          </div>
          <button type="submit"
            style={{ width:'100%', background:'linear-gradient(135deg,#6c3fff,#a855f7)', color:'#fff', border:'none', padding:'11px', borderRadius:'10px', fontSize:'0.85rem', fontWeight:800, cursor:'pointer' }}>
            Save Evaluation →
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div>
      <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:900, marginBottom:'16px' }}>
        Evaluate <span style={{ color:'#a78bfa' }}>Students</span>
      </h1>
      {reports.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px', color:'#4ade80', background:'#0d0d22', border:'1px solid rgba(255,255,255,.06)', borderRadius:'14px' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'10px' }}>⭐</div>
          All reports evaluated!
        </div>
      ) : (
        <div style={{ display:'grid', gap:'10px' }}>
          {reports.map(r => (
            <div key={r._id} style={{ background:'#0d0d22', border:'1px solid rgba(108,99,255,.15)', borderRadius:'12px', padding:'16px', display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ flex:1 }}>
                <div style={{ color:'#fff', fontWeight:800, fontSize:'0.88rem' }}>{r.student?.name}</div>
                <div style={{ color:'#666', fontSize:'0.7rem' }}>Week {r.week} · {r.title}</div>
                {r.documentFile && <div style={{ color:'#60a5fa', fontSize:'0.68rem', marginTop:'4px' }}>📎 {r.documentFile}</div>}
              </div>
              <span style={{ fontSize:'0.68rem', padding:'2px 8px', borderRadius:'20px', fontWeight:800, background:'rgba(251,191,36,.15)', color:'#fbbf24' }}>
                {r.status}
              </span>
              <button onClick={() => setSelected(r)}
                style={{ padding:'7px 16px', borderRadius:'8px', fontSize:'0.75rem', fontWeight:800, cursor:'pointer', background:'rgba(108,99,255,.2)', color:'#a78bfa', border:'1px solid rgba(108,99,255,.3)' }}>
                Evaluate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}