import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContest } from '../api/contests';

const emptyOption = () => ({ text: '', isCorrect: false });
const emptyQuestion = () => ({ text: '', type: 'SINGLE', points: 1, options: [emptyOption(), emptyOption()] });

export default function AdminCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', accessLevel: 'NORMAL',
    startTime: '2025-01-01T00:00', endTime: '2030-01-01T00:00',
    prizeInfo: '',
    questions: [emptyQuestion()],
  });
  const [error, setError] = useState('');

  const setField = (k, v) => setForm({ ...form, [k]: v });

  const setQuestion = (qi, key, val) => {
    const questions = [...form.questions];
    questions[qi] = { ...questions[qi], [key]: val };
    setForm({ ...form, questions });
  };

  const setOption = (qi, oi, key, val) => {
    const questions = [...form.questions];
    const options = [...questions[qi].options];
    options[oi] = { ...options[oi], [key]: val };
    questions[qi] = { ...questions[qi], options };
    setForm({ ...form, questions });
  };

  const addQuestion = () => setForm({ ...form, questions: [...form.questions, emptyQuestion()] });
  const addOption = (qi) => {
    const questions = [...form.questions];
    questions[qi] = { ...questions[qi], options: [...questions[qi].options, emptyOption()] };
    setForm({ ...form, questions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Convert datetime-local values to ISO, and points to a number.
    const payload = {
      ...form,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      questions: form.questions.map((q) => ({ ...q, points: Number(q.points) })),
    };
    try {
      const created = await createContest(payload);
      navigate(`/contests/${created.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Create Contest</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div><label>Name </label><input value={form.name} onChange={(e) => setField('name', e.target.value)} required /></div>
        <div><label>Description </label><input value={form.description} onChange={(e) => setField('description', e.target.value)} /></div>
        <div>
          <label>Access </label>
          <select value={form.accessLevel} onChange={(e) => setField('accessLevel', e.target.value)}>
            <option value="NORMAL">NORMAL</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div><label>Start </label><input type="datetime-local" value={form.startTime} onChange={(e) => setField('startTime', e.target.value)} /></div>
        <div><label>End </label><input type="datetime-local" value={form.endTime} onChange={(e) => setField('endTime', e.target.value)} /></div>
        <div><label>Prize </label><input value={form.prizeInfo} onChange={(e) => setField('prizeInfo', e.target.value)} /></div>

        <h3>Questions</h3>
        {form.questions.map((q, qi) => (
          <fieldset key={qi} style={{ marginBottom: 12 }}>
            <div><label>Text </label><input value={q.text} onChange={(e) => setQuestion(qi, 'text', e.target.value)} required /></div>
            <div>
              <label>Type </label>
              <select value={q.type} onChange={(e) => setQuestion(qi, 'type', e.target.value)}>
                <option value="SINGLE">SINGLE</option>
                <option value="MULTI">MULTI</option>
                <option value="BOOLEAN">BOOLEAN</option>
              </select>
            </div>
            <div><label>Points </label><input type="number" min="1" value={q.points} onChange={(e) => setQuestion(qi, 'points', e.target.value)} /></div>
            <div>
              <strong>Options</strong>
              {q.options.map((o, oi) => (
                <div key={oi}>
                  <input placeholder="option text" value={o.text} onChange={(e) => setOption(qi, oi, 'text', e.target.value)} required />
                  <label style={{ marginLeft: 8 }}>
                    <input type="checkbox" checked={o.isCorrect} onChange={(e) => setOption(qi, oi, 'isCorrect', e.target.checked)} /> correct
                  </label>
                </div>
              ))}
              <button type="button" onClick={() => addOption(qi)}>+ Add option</button>
            </div>
          </fieldset>
        ))}
        <button type="button" onClick={addQuestion}>+ Add question</button>
        <div style={{ marginTop: 12 }}><button type="submit">Create contest</button></div>
      </form>
    </div>
  );
}