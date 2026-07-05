import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContest } from '../api/contests';
import { useAuth } from '../context/AuthContext';

export default function ContestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [contest, setContest] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getContest(id)
      .then(setContest)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!contest) return <p>Loading...</p>;

  return (
    <div>
      <h2>{contest.name}</h2>
      <p>{contest.description}</p>
      <p>Access: {contest.accessLevel} | Prize: {contest.prizeInfo || 'None'}</p>
      <p>
        <Link to={`/contests/${id}/leaderboard`}>View leaderboard</Link>
      </p>

      {user ? (
        <p><Link to={`/contests/${id}/play`}>Join & Play</Link></p>
      ) : (
        <p><em>Log in to participate.</em></p>
      )}

      <h3>Questions ({contest.questions.length})</h3>
      <ol>
        {contest.questions.map((q) => (
          <li key={q.id} style={{ marginBottom: 8 }}>
            <strong>{q.text}</strong> ({q.type}, {q.points} pt)
            <ul>
              {q.options.map((o) => (
                <li key={o.id}>{o.text}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}