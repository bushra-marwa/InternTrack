import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function MyStudents() {
  const [students, setStudents] = useState([])

  useEffect(() => {
    api.get('/students/my-students').then(r => setStudents(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 900, marginBottom: '20px' }}>My <span style={{ color: '#a78bfa' }}>Students</span></h1>
      <div style={{ background: '#0d0d22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Name', 'Email', 'Domain', 'College', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#555', fontSize: '0.7rem', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0
              ? <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#555' }}>No students found</td></tr>
              : students.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px', color: '#fff', fontWeight: 600 }}>{s.user?.name}</td>
                  <td style={{ padding: '10px 14px', color: '#888' }}>{s.user?.email}</td>
                  <td style={{ padding: '10px 14px', color: '#bbb' }}>{s.internshipDomain}</td>
                  <td style={{ padding: '10px 14px', color: '#bbb' }}>{s.college}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, background: s.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', color: s.status === 'active' ? '#4ade80' : '#f87171' }}>{s.status}</span>
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