import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function PostInternship() {
  const [existing, setExisting] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ company:'', domain:'Full Stack', location:'', duration:'3 months', startDate:'', stipend:'' })
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/internships/my').then(r => { if(r.data) setExisting(r.data) }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, v))
      if (file) fd.append('offerLetter', file)
      await api.post('/internships', fd, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data'
  }
});
      toast.success('Internship submitted for approval!')
      navigate('/my-internship')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    } finally { setLoading(false) }
  }

  if (existing) return (
    <div>
      <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:900, marginBottom:'20px' }}>
        Post <span style={{ color:'#a78bfa' }}>Internship</span>
      </h1>
      <div style={{ background:'rgba(74,222,128,.08)', border:'1px solid rgba(74,222,128,.2)', borderRadius:'14px', padding:'24px', maxWidth:'460px' }}>
        <div style={{ fontSize:'2rem', marginBottom:'10px' }}>
          {existing.status === 'approved' ? '✅' : existing.status === 'pending' ? '⏳' : '❌'}
        </div>
        <div style={{ color:'#fff', fontWeight:900, fontSize:'1rem', marginBottom:'4px' }}>
          {existing.company}
        </div>
        <div style={{ color:'#666', fontSize:'0.75rem', marginBottom:'12px' }}>
          {existing.domain} · {existing.location}
        </div>
        <span style={{ fontSize:'0.68rem', padding:'3px 10px', borderRadius:'20px', fontWeight:800,
          background: existing.status==='approved'?'rgba(74,222,128,.15)':existing.status==='pending'?'rgba(251,191,36,.15)':'rgba(248,113,113,.15)',
          color: existing.status==='approved'?'#4ade80':existing.status==='pending'?'#fbbf24':'#f87171'
        }}>
          {existing.status}
        </span>
        {existing.status === 'rejected' && (
          <p style={{ color:'#f87171', fontSize:'0.72rem', marginTop:'12px' }}>
            Reason: {existing.rejectionReason || 'Contact admin for details'}
          </p>
        )}
      </div>
    </div>
  )

  const inp = { width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'9px', padding:'9px 12px', color:'#e2e2f0', fontSize:'0.82rem', outline:'none', fontFamily:'inherit' }

  return (
    <div style={{ maxWidth:'540px' }}>
      <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:900, marginBottom:'16px' }}>
        Post <span style={{ color:'#a78bfa' }}>Internship Details</span>
      </h1>
      <div style={{ background:'rgba(108,99,255,.08)', border:'1px solid rgba(108,99,255,.2)', borderRadius:'10px', padding:'12px', fontSize:'0.72rem', color:'#888', marginBottom:'16px' }}>
        📋 Submit your internship details. Admin will review and approve or reject your application.
        Once approved, a mentor will be assigned to you.
      </div>
      <div style={{ background:'#0d0d22', border:'1px solid rgba(255,255,255,.06)', borderRadius:'14px', padding:'22px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'12px' }}>
            <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Company Name *</label>
            <input style={inp} value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="e.g. TechCorp Pvt Ltd" required />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <div style={{ marginBottom:'12px' }}>
              <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Domain *</label>
              <select style={inp} value={form.domain} onChange={e=>setForm({...form,domain:e.target.value})}>
                {['Full Stack','Frontend','Backend','ML/AI','DevOps','Data Science','Android','UI/UX'].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:'12px' }}>
              <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Duration *</label>
              <select style={inp} value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}>
                {['1 month','2 months','3 months','6 months'].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <div style={{ marginBottom:'12px' }}>
              <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Location / Mode *</label>
              <input style={inp} value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Hyderabad / Remote" required />
            </div>
            <div style={{ marginBottom:'12px' }}>
              <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Start Date *</label>
              <input style={inp} type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} required />
            </div>
          </div>
          <div style={{ marginBottom:'12px' }}>
            <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Stipend</label>
            <input style={inp} value={form.stipend} onChange={e=>setForm({...form,stipend:e.target.value})} placeholder="e.g. ₹5000/month or Unpaid" />
          </div>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'0.72rem', color:'#777', marginBottom:'5px', fontWeight:700 }}>Offer Letter / Appointment Letter *</label>
            <div
              style={{ border:'2px dashed rgba(108,99,255,.3)', borderRadius:'10px', padding:'20px', textAlign:'center', cursor:'pointer', background:'rgba(108,99,255,.04)', transition:'all .2s' }}
              onClick={() => document.getElementById('offer-file').click()}
            >
              <div style={{ fontSize:'24px', marginBottom:'6px' }}>📄</div>
              <div style={{ color:'#a78bfa', fontSize:'0.78rem', fontWeight:700 }}>
                {file ? `✅ ${file.name}` : 'Click to upload offer letter'}
              </div>
              <div style={{ color:'#555', fontSize:'0.65rem', marginTop:'3px' }}>PDF, DOC, JPG · Max 10MB</div>
              <input
                id="offer-file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                style={{ display:'none' }}
                onChange={e => { if(e.target.files[0]) setFile(e.target.files[0]) }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width:'100%', background: loading?'#444':'linear-gradient(135deg,#6c3fff,#a855f7)', color:'#fff', border:'none', padding:'12px', borderRadius:'10px', fontSize:'0.9rem', fontWeight:800, cursor: loading?'not-allowed':'pointer' }}
          >
            {loading ? 'Submitting...' : 'Submit for Approval →'}
          </button>
        </form>
      </div>
    </div>
  )
}