import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function StudentReports() {
  const [reports, setReports] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/reports').then(r => setReports(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 900, marginBottom: '20px' }}>Student <span style={{ color: '#a78bfa' }}>Reports</span></h1>
      <div style={{ background: '#0d0d22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Student', 'Week', 'Title', 'Date', 'Status', 'Score', 'Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#555', fontSize: '0.7rem', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0
              ? <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#555' }}>No reports found</td></tr>
              : reports.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px', color: '#fff', fontWeight: 600 }}>{r.student?.name}</td>
                  <td style={{ padding: '10px 14px', color: '#a78bfa', fontWeight: 700 }}>W{r.week}</td>
                  <td style={{ padding: '10px 14px', color: '#bbb' }}>{r.title}</td>
                  <td style={{ padding: '10px 14px', color: '#666', fontSize: '0.72rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, background: r.status === 'evaluated' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)', color: r.status === 'evaluated' ? '#4ade80' : '#fbbf24' }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#a78bfa', fontWeight: 900 }}>{r.score || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {r.status === 'submitted' && (
                      <button onClick={() => navigate('/evaluate')} style={{ fontSize: '0.72rem', background: 'rgba(108,99,255,0.2)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)', padding: '4px 10px', borderRadius: '7px', cursor: 'pointer', fontWeight: 700 }}>Evaluate</button>
                    )}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}