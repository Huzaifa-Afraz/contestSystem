import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listContests } from '../api/contests';

export default function Contests() {
  const [contests, setContests] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listContests(page, 10)
      .then((res) => {
        setContests(res.data);   // your paginated shape: { data, meta }
        setMeta(res.meta);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]); // re-fetch whenever the page changes

  if (loading) return <p>Loading contests...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Contests</h2>
      {contests.length === 0 ? (
        <p>No contests yet.</p>
      ) : (
        <ul>
          {contests.map((c) => (
            <li key={c.id}>
              <Link to={`/contests/${c.id}`}>{c.name}</Link>
              {' '}— {c.accessLevel}
              {c.prizeInfo && ` — Prize: ${c.prizeInfo}`}
            </li>
          ))}
        </ul>
      )}

      {meta && (
        <div>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span style={{ margin: '0 8px' }}>
            Page {meta.page} of {meta.totalPages}
          </span>
          <button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}