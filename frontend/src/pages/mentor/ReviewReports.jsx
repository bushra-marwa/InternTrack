import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ReviewReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get('/reports/mentor')
      .then(res => setReports(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleEvaluate = async (id, status) => {
    const feedback = prompt("Enter feedback:");
    const score = prompt("Enter score (1-10):");

    try {
      await api.put(`/reports/${id}/evaluate`, {
        status,
        feedback,
        score
      });

      alert("Updated!");

      // refresh
      setReports(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status, feedback, score } : r
        )
      );

    } catch {
      alert("Failed");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Review Reports</h2>

      {reports.map(r => (
        <div key={r._id} style={{ border: '1px solid #333', margin: '10px', padding: '10px' }}>
          
          <p><b>{r.title}</b></p>
          <p>{r.student?.name} - Week {r.week}</p>
          <p>Status: {r.status}</p>

          {r.status === 'pending' && (
            <>
              <button onClick={() => handleEvaluate(r._id, 'approved')}>
                Approve
              </button>

              <button onClick={() => handleEvaluate(r._id, 'rejected')}>
                Reject
              </button>
            </>
          )}

          {r.status !== 'pending' && (
            <p>✔ Reviewed</p>
          )}
        </div>
      ))}
    </div>
  );
}