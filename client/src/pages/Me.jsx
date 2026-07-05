import { useEffect, useState } from 'react';
import { myParticipations, myPrizes } from '../api/me';

export default function Me() {
  const [participations, setParticipations] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([myParticipations(), myPrizes()])
      .then(([p, pr]) => { setParticipations(p); setPrizes(pr); })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My Activity</h2>

      <h3>Participations</h3>
      {participations.length === 0 ? (
        <p>You haven't joined any contests yet.</p>
      ) : (
        <ul>
          {participations.map((p) => (
            <li key={p.id}>
              {p.contest?.name || 'Contest'} — <strong>{p.status}</strong>
              {p.status === 'SUBMITTED' && ` — score: ${p.score}`}
            </li>
          ))}
        </ul>
      )}

      <h3>Prizes Won</h3>
      {prizes.length === 0 ? (
        <p>No prizes yet.</p>
      ) : (
        <ul>
          {prizes.map((pr) => (
            <li key={pr.id}>{pr.info} — {pr.contest?.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}