// Compare two sets of ids regardless of order.
const sameIds = (a, b) => {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size !== setB.size) return false;
  for (const id of setA) if (!setB.has(id)) return false;
  return true;
};

/**
 * Score one question.
 * @param {{ type, points, options: [{id, isCorrect}] }} question
 * @param {number[]} selectedOptionIds - ids the user picked
 * @returns {{ isCorrect: boolean, awardedPoints: number }}
 *
 * Rule (from the brief): correct answers add points; wrong answers have NO effect
 * (never negative). So the result is either "full points" or "zero" — never below 0.
 */
export const scoreQuestion = (question, selectedOptionIds) => {
  const correctIds = question.options
    .filter((o) => o.isCorrect)
    .map((o) => o.id);

  // Ignore any submitted id that isn't actually an option on this question.
  const validIds = new Set(question.options.map((o) => o.id));
  const cleaned = [...new Set(selectedOptionIds)].filter((id) => validIds.has(id));

  // SINGLE and BOOLEAN both mean "exactly one correct option": treat identically.
  // MULTI means "the selected set must exactly equal the correct set".
  const isCorrect = sameIds(cleaned, correctIds);

  return {
    isCorrect,
    awardedPoints: isCorrect ? question.points : 0,
  };
};