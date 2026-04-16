import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function MyInternship() {
  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/internships/my')
      .then(r => setInternship(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color:'#555', padding:'40px', textAlign:'center' }}>Loading...</div>

  if (!internship) return (
    <div>
      <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:900, marginBottom:'20px' }}>
        My <span style={{ color:'#a78bfa' }}>Internship</span>
      </h1>
      <div style={{ textAlign:'center', padding:'40px', color:'#555' }}>
        <div style={{ fontSize:'3rem', marginBottom:'12px' }}>📋</div>
        <div style={{ fontSize:'0.9rem', color:'#888', marginBottom:'14px' }}>No internship submitted yet</div>
        <button
          onClick={() => navigate('/post-internship')}
          style={{ background:'linear-gradient(135deg,#6c3fff,#a855f7)', color:'#fff', border:'none', padding:'10px 24px', borderRadius:'10px', fontSize:'0.85rem', fontWeight:800, cursor:'pointer' }}
        >
          Post Internship →
        </button>
      </div>
    </div>
  )

  const statusColor = internship.status==='approved' ? '#4ade80' : internship.status==='pending' ? '#fbbf24' : '#f87171'
  const statusBg = internship.status==='approved' ? 'rgba(74,222,128,.08)' : internship.status==='pending' ? 'rgba(251,191,36,.08)' : 'rgba(248,113,113,.08)'

  return (
    <div style={{ maxWidth:'560px' }}>
      <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:900, marginBottom:'20px' }}>
        My <span style={{ color:'#a78bfa' }}>Internship</span>
      </h1>
      <div style={{ background:'#0d0d22', border:`2px solid ${statusColor}`, borderRadius:'16px', padding:'22px', marginBottom:'14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'16px' }}>
          <div>
            <div style={{ color:'#fff', fontSize:'1.1rem', fontWeight:900 }}>{internship.company}</div>
            <div style={{ color:'#666', fontSize:'0.72rem', marginTop:'3px' }}>
              {internship.domain} · {internship.location}
            </div>
          </div>
          <span style={{ fontSize:'0.68rem', padding:'3px 10px', borderRadius:'20px', fontWeight:800, background: internship.status==='approved'?'rgba(74,222,128,.15)':internship.status==='pending'?'rgba(251,191,36,.15)':'rgba(248,113,113,.15)', color: statusColor }}>
            {internship.status.toUpperCase()}
          </span>
        </div>
        <table style={{ width:'100%', fontSize:'0.78rem', borderCollapse:'collapse' }}>
          {[
            ['Domain', internship.domain],
            ['Location', internship.location],
            ['Duration', internship.duration],
            ['Start Date', new Date(internship.startDate).toLocaleDateString()],
            ['Stipend', internship.stipend || 'Unpaid'],
            ['Offer Letter', internship.offerLetter ? '📎 '+internship.offerLetter : 'Not uploaded'],
            ['Assigned Mentor', internship.mentor?.name || 'Not yet assigned'],
          ].map(([k,v]) => (
            <tr key={k}>
              <td style={{ color:'#555', padding:'5px 0', width:'140px' }}>{k}</td>
              <td style={{ color:'#bbb', fontWeight:600 }}>{v}</td>
            </tr>
          ))}
        </table>
        <div style={{ background: statusBg, border:`1px solid ${statusColor}33`, borderRadius:'8px', padding:'10px', marginTop:'14px', fontSize:'0.72rem', color: statusColor }}>
          {internship.status === 'approved' && '✅ Internship approved! Upload your weekly reports now.'}
          {internship.status === 'pending' && '⏳ Under review. Admin will respond shortly.'}
          {internship.status === 'rejected' && `❌ Rejected. Reason: ${internship.rejectionReason || 'Contact admin'}`}
        </div>
      </div>
      {internship.status === 'approved' && (
        <button
          onClick={() => navigate('/upload-report')}
          style={{ background:'linear-gradient(135deg,#6c3fff,#a855f7)', color:'#fff', border:'none', padding:'11px 24px', borderRadius:'10px', fontSize:'0.85rem', fontWeight:800, cursor:'pointer' }}
        >
          Upload Weekly Report →
        </button>
      )}
    </div>
  )
}