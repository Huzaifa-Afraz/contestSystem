import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLeaderboard } from '../api/contests';

export default function Leaderboard() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    getLeaderboard(id, page, 10)
      .then((res) => { setRows(res.data); setMeta(res.meta); })
      .catch((e) => setError(e.message));
  }, [id, page]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Leaderboard</h2>
      {rows.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr><th>Rank</th><th>User</th><th>Score</th><th>Submitted</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.rank}>
                <td>{r.rank}</td>
                <td>{r.user?.username || '—'}</td>
                <td>{r.score}</td>
                <td>{new Date(r.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {meta && meta.totalPages > 1 && (
        <div>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span style={{ margin: '0 8px' }}>Page {meta.page} of {meta.totalPages}</span>
          <button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}