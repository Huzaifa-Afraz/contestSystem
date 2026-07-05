import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContest } from '../api/contests';
import { joinContest, submitAnswers } from '../api/participation';

export default function Play() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [selections, setSelections] = useState({}); // { [questionId]: number[] }
  const [result, setResult] = useState(null);        // { score, maxScore } after submit
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  // Load the contest (questions + options, no answers) on mount.
  useEffect(() => {
    getContest(id).then(setContest).catch((e) => setError(e.message));
  }, [id]);

  const handleJoin = async () => {
    setError('');
    try {
      await joinContest(id);
      setJoined(true);
    } catch (e) {
      setError(e.message);
    }
  };

  // Toggle an option for a question, respecting single vs multi.
  const toggleOption = (question, optionId) => {
    setSelections((prev) => {
      const current = prev[question.id] || [];
      if (question.type === 'MULTI') {
        // add/remove from the array
        const next = current.includes(optionId)
          ? current.filter((x) => x !== optionId)
          : [...current, optionId];
        return { ...prev, [question.id]: next };
      }
      // SINGLE / BOOLEAN: only one selection
      return { ...prev, [question.id]: [optionId] };
    });
  };

  const handleSubmit = async () => {
    setError('');
    // Shape the selections into the backend's expected format.
    const answers = contest.questions.map((q) => ({
      questionId: q.id,
      selectedOptionIds: selections[q.id] || [],
    }));
    try {
      const res = await submitAnswers(id, answers);
      setResult(res);
    } catch (e) {
      setError(e.message);
    }
  };

  if (error && !contest) return <p style={{ color: 'red' }}>{error}</p>;
  if (!contest) return <p>Loading...</p>;

  // After submitting, show the score instead of the form.
  if (result) {
    return (
      <div>
        <h2>{contest.name} — Submitted</h2>
        <p><strong>Your score: {result.score} / {result.maxScore}</strong></p>
      </div>
    );
  }

  return (
    <div>
      <h2>{contest.name}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!joined ? (
        <button onClick={handleJoin}>Join contest</button>
      ) : (
        <p><em>Joined. Answer the questions below.</em></p>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <ol>
          {contest.questions.map((q) => (
            <li key={q.id} style={{ marginBottom: 12 }}>
              <strong>{q.text}</strong> ({q.type}, {q.points} pt)
              <div>
                {q.options.map((o) => {
                  const selected = (selections[q.id] || []).includes(o.id);
                  return (
                    <label key={o.id} style={{ display: 'block' }}>
                      <input
                        type={q.type === 'MULTI' ? 'checkbox' : 'radio'}
                        name={`q-${q.id}`}
                        checked={selected}
                        onChange={() => toggleOption(q, o.id)}
                        disabled={!joined}
                      />
                      {' '}{o.text}
                    </label>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
        <button type="submit" disabled={!joined}>Submit answers</button>
      </form>
    </div>
  );
}