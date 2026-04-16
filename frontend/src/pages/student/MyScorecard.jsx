import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function MyScorecard() {
  const [evals, setEvals] = useState([])

  useEffect(() => {
    api.get('/evaluations').then(r => setEvals(r.data)).catch(() => {})
  }, [])

  const avg = evals.length
    ? (evals.reduce((s, e) => s + +e.overallScore, 0) / evals.length).toFixed(1) : null

  const getGrade = s => s >= 9 ? 'A+' : s >= 8 ? 'A' : s >= 7 ? 'B+' : s >= 6 ? 'B' : 'C'

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 900, marginBottom: '20px' }}>My <span style={{ color: '#a78bfa' }}>Scorecard</span></h1>
      {avg && (
        <div style={{ background: 'linear-gradient(135deg,rgba(108,63,255,0.2),rgba(168,85,247,0.1))', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '16px', maxWidth: '380px' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#a78bfa' }}>{avg}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Grade: {getGrade(+avg)}</div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>Overall Score</div>
        </div>
      )}
      <div style={{ background: '#0d0d22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Week', 'Technical', 'Communication', 'Teamwork', 'Punctuality', 'Overall', 'Remarks'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#555', fontSize: '0.7rem', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {evals.length === 0
              ? <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#555' }}>No evaluations yet</td></tr>
              : evals.map((e, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px', color: '#a78bfa', fontWeight: 700 }}>W{e.week}</td>
                  <td style={{ padding: '10px 14px', color: '#bbb' }}>{e.technicalSkills}</td>
                  <td style={{ padding: '10px 14px', color: '#bbb' }}>{e.communication}</td>
                  <td style={{ padding: '10px 14px', color: '#bbb' }}>{e.teamwork}</td>
                  <td style={{ padding: '10px 14px', color: '#bbb' }}>{e.punctuality}</td>
                  <td style={{ padding: '10px 14px', color: '#a78bfa', fontWeight: 900 }}>{e.overallScore}</td>
                  <td style={{ padding: '10px 14px', color: '#666', fontSize: '0.75rem' }}>{e.remarks || '—'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}