import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function InternshipRequests() {
  const [internships, setInternships] = useState([])
  const [filter, setFilter] = useState('all')
  const [mentors, setMentors] = useState([])
  const [selectedMentor, setSelectedMentor] = useState({})
  const [reason, setReason] = useState({})

  useEffect(() => {
    api.get('/internships').then(r => setInternships(r.data)).catch(() => {})
    api.get('/auth/mentors').then(r => setMentors(r.data)).catch(() => {})
  }, [])

  const approve = async (id) => {
    try {
      await api.put(`/internships/${id}/approve`, { mentorId: selectedMentor[id] || null })
      setInternships(prev => prev.map(i => i._id===id ? {...i, status:'approved'} : i))
      toast.success('Internship approved!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const reject = async (id) => {
    try {
      await api.put(`/internships/${id}/reject`, { reason: reason[id] || 'Not specified' })
      setInternships(prev => prev.map(i => i._id===id ? {...i, status:'rejected'} : i))
      toast.success('Internship rejected')
    } catch (err) { toast.error('Failed') }
  }

  const filtered = filter === 'all' ? internships : internships.filter(i => i.status === filter)

  return (
    <div>
      <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:900, marginBottom:'16px' }}>
        Internship <span style={{ color:'#a78bfa' }}>Requests</span>
      </h1>
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        {['all','pending','approved','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'6px 14px', borderRadius:'8px', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', border:'1px solid',
              background: filter===f ? 'rgba(108,99,255,.3)' : 'rgba(255,255,255,.05)',
              color: filter===f ? '#c4b5fd' : '#666',
              borderColor: filter===f ? 'rgba(108,99,255,.5)' : 'rgba(255,255,255,.1)'
            }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
        <span style={{ marginLeft:'auto', color:'#555', fontSize:'0.72rem', alignSelf:'center' }}>
          {filtered.length} records
        </span>
      </div>

      <div style={{ display:'grid', gap:'12px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'#555', background:'#0d0d22', border:'1px solid rgba(255,255,255,.06)', borderRadius:'14px' }}>
            No {filter} requests found
          </div>
        ) : filtered.map(i => (
          <div key={i._id} style={{ background:'#0d0d22', border:`1px solid ${i.status==='pending'?'rgba(251,191,36,.2)':i.status==='approved'?'rgba(74,222,128,.15)':'rgba(248,113,113,.15)'}`, borderRadius:'14px', padding:'18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'12px' }}>
              <div>
                <div style={{ color:'#fff', fontWeight:900, fontSize:'0.95rem' }}>{i.student?.name}</div>
                <div style={{ color:'#666', fontSize:'0.72rem' }}>{i.student?.email}</div>
              </div>
              <span style={{ fontSize:'0.68rem', padding:'3px 10px', borderRadius:'20px', fontWeight:800,
                background: i.status==='approved'?'rgba(74,222,128,.15)':i.status==='pending'?'rgba(251,191,36,.15)':'rgba(248,113,113,.15)',
                color: i.status==='approved'?'#4ade80':i.status==='pending'?'#fbbf24':'#f87171'
              }}>
                {i.status.toUpperCase()}
              </span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'12px' }}>
              {[['Company',i.company],['Domain',i.domain],['Location',i.location],['Duration',i.duration]].map(([k,v]) => (
                <div key={k} style={{ background:'rgba(255,255,255,.03)', borderRadius:'8px', padding:'8px 10px' }}>
                  <div style={{ fontSize:'0.62rem', color:'#555', marginBottom:'2px' }}>{k}</div>
                  <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#bbb' }}>{v}</div>
                </div>
              ))}
            </div>
            {i.offerLetter && (
              <div style={{ marginBottom:'12px' }}>
                <a href={`http://localhost:5000/uploads/${i.offerLetter}`} target="_blank" rel="noreferrer"
                  style={{ color:'#60a5fa', fontSize:'0.72rem', textDecoration:'none' }}>
                  📎 View Offer Letter
                </a>
              </div>
            )}
            {i.status === 'pending' && (
              <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
                <select
                  value={selectedMentor[i._id] || ''}
                  onChange={e => setSelectedMentor(prev => ({...prev,[i._id]:e.target.value}))}
                  style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'8px', padding:'7px 10px', color:'#e2e2f0', fontSize:'0.75rem', outline:'none' }}
                >
                  <option value="">Assign mentor (optional)</option>
                  {mentors.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
                <button onClick={() => approve(i._id)}
                  style={{ padding:'7px 16px', borderRadius:'8px', fontSize:'0.75rem', fontWeight:800, cursor:'pointer', background:'rgba(74,222,128,.15)', color:'#4ade80', border:'1px solid rgba(74,222,128,.3)' }}>
                  ✔ Approve
                </button>
                <input
                  placeholder="Rejection reason..."
                  value={reason[i._id] || ''}
                  onChange={e => setReason(prev => ({...prev,[i._id]:e.target.value}))}
                  style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'8px', padding:'7px 10px', color:'#e2e2f0', fontSize:'0.75rem', outline:'none', flex:1, minWidth:'160px' }}
                />
                <button onClick={() => reject(i._id)}
                  style={{ padding:'7px 16px', borderRadius:'8px', fontSize:'0.75rem', fontWeight:800, cursor:'pointer', background:'rgba(248,113,113,.15)', color:'#f87171', border:'1px solid rgba(248,113,113,.3)' }}>
                  ✘ Reject
                </button>
              </div>
            )}
            {i.status === 'approved' && (
              <div style={{ fontSize:'0.72rem', color:'#4ade80' }}>
                ✅ Approved · Mentor: {i.mentor?.name || 'Not assigned'}
              </div>
            )}
            {i.status === 'rejected' && (
              <div style={{ fontSize:'0.72rem', color:'#f87171' }}>
                ❌ Rejected · Reason: {i.rejectionReason || 'Not specified'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}