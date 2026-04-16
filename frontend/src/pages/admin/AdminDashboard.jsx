import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [reports, setReports] = useState([])
  const [evals, setEvals] = useState([])
  const [students, setStudents] = useState([])

  useEffect(() => {
  const token = localStorage.getItem('token');

  api.get('/reports')
    .then(r => setReports(r.data))
    .catch(err => console.log(err));

  api.get('/evaluations')
    .then(r => setEvals(r.data))
    .catch(err => console.log(err));

  api.get('/students', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => {
      console.log("STUDENTS DATA:", r.data);
      setStudents(r.data);
    })
    .catch(err => {
      console.log("STUDENT ERROR:", err);
    });

}, []);

  const avg = evals.length
    ? (evals.reduce((s, e) => s + +e.overallScore, 0) / evals.length).toFixed(1) : '—'

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 900, marginBottom: '20px' }}>Admin <span style={{ color: '#a78bfa' }}>Dashboard</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Students', value: students.length, color: '#6c3fff' },
          { label: 'Total Reports', value: reports.length, color: '#14b8a6' },
          { label: 'Avg Score', value: avg, color: '#ec4899' },
          { label: 'Pending', value: reports.filter(r => r.status === 'submitted').length, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#0d0d22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '18px', borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#555', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#0d0d22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '18px' }}>
        <h2 style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 700, marginBottom: '14px' }}>Recent Reports</h2>
        {Array.isArray(reports) && reports.slice(0, 5).map(r =>  (
          <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: r.status === 'evaluated' ? '#4ade80' : '#fbbf24', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.82rem', color: '#ccc' }}>{r.title}</p>
              <p style={{ fontSize: '0.72rem', color: '#555' }}>{r.student?.name} · Week {r.week}</p>
            </div>
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, background: r.status === 'evaluated' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)', color: r.status === 'evaluated' ? '#4ade80' : '#fbbf24' }}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
