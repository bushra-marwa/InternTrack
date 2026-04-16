import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AllStudents() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors]   = useState([]);
  const headers = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
};
  useEffect(() => {
  axios.get('http://localhost:5000/api/admin/students', { headers })
    .then(res => {
      console.log("STUDENTS DATA:", res.data);  // ✅ ADD THIS
      setStudents(res.data);
    })
    .catch(err => console.error('Students fetch error:', err));

  axios.get('http://localhost:5000/api/admin/mentors', { headers })
    .then(res => setMentors(res.data))
    .catch(err => console.error('Mentors fetch error:', err));
}, []);


  const allotMentor = async (studentId, mentorId) => {
    if (!mentorId) return;
    try {
      const res = await axios.put('http://localhost:5000/api/admin/allot-mentor',
        { studentId, mentorId }, { headers });
      setStudents(prev =>
        prev.map(s => s._id === studentId ? res.data : s)
      );
      alert('Mentor allotted successfully!');
    } catch {
      alert('Failed to allot mentor');
    }
  };
  const deleteStudent = async (id) => {
  if (!window.confirm('Delete this student?')) return;

  try {
    await axios.delete(`http://localhost:5000/api/admin/student/${id}`, { headers });

    setStudents(prev => prev.filter(s => s._id !== id));

  } catch (err) {
    alert('Delete failed');
  }
};
  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '16px' }}>
        All <span style={{ color: '#a855f7' }}>Students</span>
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#0f1117', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#1a1d2e', color: '#aaa', fontSize: '13px' }}>
              {['Name', 'Email', 'Domain', 'Mentor', 'Status', 'Allot Mentor','Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
                  No students registered yet
                </td>
              </tr>
            ) : students .filter(s => s.user && s.user.name)
                        .map(s =>  (
              <tr key={s._id} style={{ borderTop: '1px solid #1e2130', color: '#ccc', fontSize: '14px' }}>
                <td style={{ padding: '12px 16px' }}>{s.user?.name || '-'}</td>
                <td style={{ padding: '12px 16px' }}>{s.user?.email || '-'}</td>
                <td style={{ padding: '12px 16px' }}>{s.internshipDomain || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  {s.mentor ? s.mentor.name : <span style={{ color: '#666' }}>Not assigned</span>}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: s.status === 'approved' ? '#14532d' : '#3b1a1a',
                    color: s.status === 'approved' ? '#4ade80' : '#f87171',
                    padding: '2px 10px', borderRadius: '999px', fontSize: '12px'
                  }}>{s.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    defaultValue={s.mentor?._id || ''}
                    onChange={e => allotMentor(s._id, e.target.value)}
                    style={{ background: '#1a1d2e', color: '#ccc', border: '1px solid #333', borderRadius: '6px', padding: '4px 8px', fontSize: '13px' }}
                  >
                    <option value=''>-- Select Mentor --</option>
                    {mentors.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                <button onClick={() => deleteStudent(s._id)} style={{
                      background: '#3b1a1a',
                      color: '#f87171',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer'}}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}