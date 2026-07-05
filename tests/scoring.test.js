import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreQuestion } from '../src/modules/participation/scoring.js';

const single = {
  type: 'SINGLE', points: 1,
  options: [{ id: 1, isCorrect: true }, { id: 2, isCorrect: false }, { id: 3, isCorrect: false }],
};
const multi = {
  type: 'MULTI', points: 2,
  options: [{ id: 1, isCorrect: true }, { id: 2, isCorrect: false }, { id: 3, isCorrect: true }],
};
const boolean = {
  type: 'BOOLEAN', points: 1,
  options: [{ id: 10, isCorrect: false }, { id: 11, isCorrect: true }],
};

test('single: correct pick scores full points', () => {
  assert.deepEqual(scoreQuestion(single, [1]), { isCorrect: true, awardedPoints: 1 });
});

test('single: wrong pick scores zero', () => {
  assert.deepEqual(scoreQuestion(single, [2]), { isCorrect: false, awardedPoints: 0 });
});

test('single: picking extra options is wrong', () => {
  assert.deepEqual(scoreQuestion(single, [1, 2]), { isCorrect: false, awardedPoints: 0 });
});

test('boolean: correct pick scores', () => {
  assert.deepEqual(scoreQuestion(boolean, [11]), { isCorrect: true, awardedPoints: 1 });
});

test('multi: exact correct set scores full', () => {
  assert.deepEqual(scoreQuestion(multi, [1, 3]), { isCorrect: true, awardedPoints: 2 });
});

test('multi: partial selection scores zero', () => {
  assert.deepEqual(scoreQuestion(multi, [1]), { isCorrect: false, awardedPoints: 0 });
});

test('multi: extra wrong pick scores zero', () => {
  assert.deepEqual(scoreQuestion(multi, [1, 2, 3]), { isCorrect: false, awardedPoints: 0 });
});

test('junk option ids are ignored, not scored', () => {
  assert.deepEqual(scoreQuestion(single, [999]), { isCorrect: false, awardedPoints: 0 });
});