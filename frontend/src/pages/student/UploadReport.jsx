import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function UploadReport() {
  const [approved, setApproved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({ week:1, title:'', summary:'', link:'', selfRating:8 })
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/internships/my')
      .then(r => { if(r.data?.status === 'approved') setApproved(true) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, v))
      if (file) fd.append('documentFile', file)
      await api.post('/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Report submitted! Mentor will evaluate shortly.')
      navigate('/reports')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    } finally { setSubmitting(false) }
  }

  if (loading) return <div style={{ color:'#555', padding:'40px', textAlign:'center' }}>Loading...</div>

  if (!approved) return (
    <div>
      <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:900, marginBottom:'20px' }}>
        Upload <span style={{ color:'#a78bfa' }}>Report</span>
      </h1>
      <div style={{ textAlign:'center', padding:'40px', background:'#0d0d22', border:'1px solid rgba(255,255,255,.06)', borderRadius:'14px' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:'10px' }}>🔒</div>
        <div style={{ color:'#888', fontSize:'0.85rem', marginBottom:'6px' }}>Internship not approved yet</div>
        <div style={{ color:'#555', fontSize:'0.72rem' }}>
          Admin must approve your internship before you can upload reports
        </div>
        <button
          onClick={() => navigate('/my-internship')}
          style={{ marginTop:'14px', background:'rgba(108,99,255,.2)', color:'#a78bfa', border:'1px solid rgba(108,99,255,.3)', padding:'8px 18px', borderRadius:'9px', fontSize:'0.78rem', fontWeight:700, cursor:'pointer' }}
        >
          Check Status →
        </button>
      </div>
    </div>
  )

  const inp = { width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'9px', padding:'9px 12px', color:'#e2e2f0', fontSize:'0.82rem', outline:'none', fontFamily:'inherit' }

  return (
    <div style={{ maxWidth:'560px' }}>
      <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:900, marginBottom:'16px' }}>
        Upload <span style={{ color:'#a78bfa' }}>Weekly Report</span>
      </h1>
      <div style={{ background:'rgba(74,222,128,.06)', border:'1px solid rgba(74,222,128,.15)', borderRadius:'10px', padding:'10px 14px', fontSize:'0.72rem', color:'#4ade80', marginBottom:'14px' }}>
        ✅ Internship active. Upload your weekly progress report below.
      </div>
      <div style={{ background:'#0d0d22', border:'1px solid rgba(255,255,255,.06)', borderRadius:'14px', padding:'22px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <div style={{ marginBottom:'12px' }}>
              <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Week Number</label>
              <select style={inp} value={form.week} onChange={e=>setForm({...form,week:+e.target.value})}>
                {[...Array(12)].map((_,i) => <option key={i} value={i+1}>Week {i+1}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:'12px' }}>
              <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Report Date</label>
              <input style={inp} type="date" onChange={e=>setForm({...form,date:e.target.value})} />
            </div>
          </div>
          <div style={{ marginBottom:'12px' }}>
            <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Report Title *</label>
            <input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Completed REST API development" required />
          </div>
          <div style={{ marginBottom:'12px' }}>
            <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Work Summary *</label>
            <textarea style={{ ...inp, height:'100px', resize:'vertical' }} value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} placeholder="Describe what you worked on, what you learned, challenges faced..." required />
          </div>
          <div style={{ marginBottom:'12px' }}>
            <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>GitHub / Project Link</label>
            <input style={inp} value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="https://github.com/..." />
          </div>
          <div style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Upload Report Document *</label>
            <div
              style={{ border:'2px dashed rgba(108,99,255,.3)', borderRadius:'10px', padding:'22px', textAlign:'center', cursor:'pointer', background:'rgba(108,99,255,.04)' }}
              onClick={() => document.getElementById('report-doc').click()}
            >
              <div style={{ fontSize:'28px', marginBottom:'8px' }}>📄</div>
              <div style={{ color:'#a78bfa', fontSize:'0.8rem', fontWeight:700 }}>
                {file ? `✅ ${file.name}` : 'Click to upload report document'}
              </div>
              <div style={{ color:'#555', fontSize:'0.65rem', marginTop:'3px' }}>PDF, DOCX, PPT · Max 10MB</div>
              <input id="report-doc" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" style={{ display:'none' }} onChange={e=>{ if(e.target.files[0]) setFile(e.target.files[0]) }} />
            </div>
          </div>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>
              Self Rating: {form.selfRating}/10
            </label>
            <input type="range" min="1" max="10" step="1" value={form.selfRating}
              onChange={e=>setForm({...form,selfRating:+e.target.value})}
              style={{ width:'100%', accentColor:'#6c3fff' }} />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{ width:'100%', background: submitting?'#444':'linear-gradient(135deg,#6c3fff,#a855f7)', color:'#fff', border:'none', padding:'12px', borderRadius:'10px', fontSize:'0.9rem', fontWeight:800, cursor: submitting?'not-allowed':'pointer' }}
          >
            {submitting ? 'Submitting...' : 'Submit Report →'}
          </button>
        </form>
      </div>
    </div>
  )
}
