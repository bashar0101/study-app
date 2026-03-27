const config = require('../config/env');

// ──────────────────────────────────────────────
// Mock question bank for testing without an API key
// ──────────────────────────────────────────────
const QUESTION_BANK = {
  Mathematics: {
    MCQ: [
      { questionText: 'What is the derivative of x²?', options: ['x', '2x', '2', 'x²'], correctAnswer: '2x', explanation: 'The power rule states d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x.' },
      { questionText: 'What is the value of π (pi) rounded to two decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], correctAnswer: '3.14', explanation: 'Pi is approximately 3.14159..., which rounds to 3.14.' },
      { questionText: 'What is the integral of 2x dx?', options: ['x²', 'x² + C', '2x²', '2x² + C'], correctAnswer: 'x² + C', explanation: 'The antiderivative of 2x is x² plus the constant of integration C.' },
      { questionText: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correctAnswer: '12', explanation: '12 × 12 = 144, therefore √144 = 12.' },
      { questionText: 'In a right triangle, what is sin(30°)?', options: ['0.5', '0.707', '0.866', '1'], correctAnswer: '0.5', explanation: 'sin(30°) = 1/2 = 0.5, a fundamental trigonometric value.' },
      { questionText: 'What is log₁₀(1000)?', options: ['2', '3', '4', '10'], correctAnswer: '3', explanation: '10³ = 1000, so log₁₀(1000) = 3.' },
      { questionText: 'Which formula represents the quadratic formula?', options: ['x = -b/2a', 'x = (-b ± √(b²-4ac))/2a', 'x = -b ± √(b²-4ac)', 'x = b² - 4ac'], correctAnswer: 'x = (-b ± √(b²-4ac))/2a', explanation: 'The quadratic formula solves ax² + bx + c = 0.' },
      { questionText: 'What is 7! (7 factorial)?', options: ['720', '5040', '40320', '362880'], correctAnswer: '5040', explanation: '7! = 7×6×5×4×3×2×1 = 5040.' },
    ],
    TRUE_FALSE: [
      { questionText: 'The sum of angles in a triangle is 180°.', correctAnswer: 'True', explanation: 'This is a fundamental property of Euclidean geometry.' },
      { questionText: 'A prime number can be divided evenly by numbers other than 1 and itself.', correctAnswer: 'False', explanation: 'By definition, a prime number has exactly two factors: 1 and itself.' },
      { questionText: 'The number zero is a positive integer.', correctAnswer: 'False', explanation: 'Zero is neither positive nor negative.' },
      { questionText: 'Every square is a rectangle.', correctAnswer: 'True', explanation: 'A square meets all the criteria of a rectangle (4 right angles) with the added constraint of equal sides.' },
    ],
    SHORT_ANSWER: [
      { questionText: 'What is the Pythagorean theorem formula?', correctAnswer: 'a² + b² = c²', explanation: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.' },
      { questionText: 'What does the term "asymptote" mean in mathematics?', correctAnswer: 'A line that a curve approaches but never touches', explanation: 'An asymptote is a line that a graph approaches as it tends toward infinity.' },
      { questionText: 'Define the term "polynomial".', correctAnswer: 'An expression of variables and coefficients using addition, subtraction, multiplication, and non-negative integer exponents', explanation: 'Examples include x² + 3x + 1 and 5x³ - 2x.' },
    ],
    ESSAY: [
      { questionText: 'Explain the fundamental theorem of calculus and its significance in mathematics.', correctAnswer: 'The fundamental theorem of calculus links differentiation and integration, showing they are inverse operations. Part 1 states that integration can be reversed by differentiation. Part 2 states that definite integrals can be evaluated using antiderivatives.', explanation: 'This theorem is the backbone of calculus.' },
      { questionText: 'Discuss the importance of the number e in mathematics and its applications.', correctAnswer: 'The number e (≈2.718) is the base of natural logarithms. It appears in compound interest, probability, and calculus. The function eˣ is unique because it is its own derivative.', explanation: 'Euler\'s number is one of the most important constants.' },
    ],
  },
  Physics: {
    MCQ: [
      { questionText: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctAnswer: 'Newton', explanation: 'The Newton (N) is the SI unit of force, defined as kg·m/s².' },
      { questionText: 'What is the speed of light in a vacuum?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], correctAnswer: '3×10⁸ m/s', explanation: 'The speed of light c ≈ 299,792,458 m/s ≈ 3×10⁸ m/s.' },
      { questionText: 'Which law states F = ma?', options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Law of Gravitation'], correctAnswer: 'Newton\'s Second Law', explanation: 'Newton\'s Second Law relates force, mass, and acceleration.' },
      { questionText: 'What is the unit of electrical resistance?', options: ['Ampere', 'Volt', 'Ohm', 'Watt'], correctAnswer: 'Ohm', explanation: 'Resistance is measured in Ohms (Ω), defined by Ohm\'s Law: V = IR.' },
      { questionText: 'What type of energy does a moving car have?', options: ['Potential energy', 'Kinetic energy', 'Thermal energy', 'Chemical energy'], correctAnswer: 'Kinetic energy', explanation: 'Kinetic energy is the energy of motion, calculated as KE = ½mv².' },
    ],
    TRUE_FALSE: [
      { questionText: 'Sound travels faster in water than in air.', correctAnswer: 'True', explanation: 'Sound travels ~1500 m/s in water vs ~343 m/s in air due to higher density.' },
      { questionText: 'An object at rest has zero momentum.', correctAnswer: 'True', explanation: 'Momentum p = mv. If velocity v = 0, then momentum = 0.' },
      { questionText: 'Light travels in curved lines through uniform media.', correctAnswer: 'False', explanation: 'Light travels in straight lines through uniform media (rectilinear propagation).' },
    ],
    SHORT_ANSWER: [
      { questionText: 'State Newton\'s Third Law of Motion.', correctAnswer: 'For every action, there is an equal and opposite reaction.', explanation: 'When object A exerts a force on object B, object B exerts an equal and opposite force on A.' },
      { questionText: 'What is the relationship between wavelength, frequency, and wave speed?', correctAnswer: 'Wave speed = wavelength × frequency (v = λf)', explanation: 'This fundamental wave equation relates the three properties.' },
    ],
    ESSAY: [
      { questionText: 'Explain Einstein\'s theory of special relativity and its key postulates.', correctAnswer: 'Special relativity has two postulates: (1) the laws of physics are the same in all inertial frames, and (2) the speed of light is constant regardless of the observer\'s motion. Key consequences include time dilation, length contraction, and E=mc².', explanation: 'Published in 1905, it revolutionized our understanding of space and time.' },
    ],
  },
  Chemistry: {
    MCQ: [
      { questionText: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswer: 'Au', explanation: 'Au comes from the Latin word "aurum" meaning gold.' },
      { questionText: 'How many electrons can the first electron shell hold?', options: ['2', '4', '6', '8'], correctAnswer: '2', explanation: 'The first shell (n=1) can hold a maximum of 2 electrons (2n² = 2).' },
      { questionText: 'What is the pH of pure water at 25°C?', options: ['0', '1', '7', '14'], correctAnswer: '7', explanation: 'Pure water is neutral with a pH of 7.' },
      { questionText: 'Which gas makes up the majority of Earth\'s atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], correctAnswer: 'Nitrogen', explanation: 'Nitrogen makes up approximately 78% of Earth\'s atmosphere.' },
    ],
    TRUE_FALSE: [
      { questionText: 'Water is a polar molecule.', correctAnswer: 'True', explanation: 'Water has a bent shape with unequal charge distribution, making it polar.' },
      { questionText: 'Noble gases are highly reactive.', correctAnswer: 'False', explanation: 'Noble gases have full electron shells, making them very stable and unreactive.' },
    ],
    SHORT_ANSWER: [
      { questionText: 'What is Avogadro\'s number and what does it represent?', correctAnswer: '6.022 × 10²³; it represents the number of particles in one mole of a substance.', explanation: 'This constant links the atomic scale to the macroscopic scale.' },
    ],
    ESSAY: [
      { questionText: 'Describe the differences between ionic and covalent bonding, providing examples of each.', correctAnswer: 'Ionic bonding involves transfer of electrons between metals and non-metals (e.g., NaCl). Covalent bonding involves sharing of electrons between non-metals (e.g., H₂O). Ionic compounds have high melting points and conduct electricity when dissolved, while covalent compounds generally have lower melting points.', explanation: 'These are the two primary types of chemical bonds.' },
    ],
  },
  Biology: {
    MCQ: [
      { questionText: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], correctAnswer: 'Mitochondria', explanation: 'Mitochondria produce ATP through cellular respiration.' },
      { questionText: 'What molecule carries genetic information?', options: ['RNA', 'DNA', 'Protein', 'Lipid'], correctAnswer: 'DNA', explanation: 'DNA (deoxyribonucleic acid) stores genetic instructions.' },
      { questionText: 'Which blood type is the universal donor?', options: ['A', 'B', 'AB', 'O'], correctAnswer: 'O', explanation: 'Type O negative blood can be given to any blood type.' },
      { questionText: 'What process do plants use to convert sunlight into energy?', options: ['Respiration', 'Photosynthesis', 'Fermentation', 'Osmosis'], correctAnswer: 'Photosynthesis', explanation: 'Photosynthesis converts CO₂ and water into glucose using sunlight.' },
    ],
    TRUE_FALSE: [
      { questionText: 'Humans have 46 chromosomes.', correctAnswer: 'True', explanation: 'Humans have 23 pairs of chromosomes, totaling 46.' },
      { questionText: 'Bacteria are eukaryotic organisms.', correctAnswer: 'False', explanation: 'Bacteria are prokaryotic — they lack a membrane-bound nucleus.' },
    ],
    SHORT_ANSWER: [
      { questionText: 'What are the four bases found in DNA?', correctAnswer: 'Adenine (A), Thymine (T), Guanine (G), and Cytosine (C)', explanation: 'A pairs with T, and G pairs with C.' },
    ],
    ESSAY: [
      { questionText: 'Explain the process of natural selection and how it drives evolution.', correctAnswer: 'Natural selection occurs when individuals with favorable traits survive and reproduce more successfully. Over generations, these advantageous traits become more common in the population. Key requirements include variation, heritability, competition, and differential reproduction.', explanation: 'Darwin\'s theory of evolution by natural selection.' },
    ],
  },
  'Computer Science': {
    MCQ: [
      { questionText: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Control Processing Unit'], correctAnswer: 'Central Processing Unit', explanation: 'The CPU executes instructions and processes data.' },
      { questionText: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 'O(log n)', explanation: 'Binary search halves the search space each step, giving logarithmic time.' },
      { questionText: 'Which data structure uses FIFO ordering?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctAnswer: 'Queue', explanation: 'Queue follows First-In-First-Out (FIFO) principle.' },
      { questionText: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctAnswer: 'Hyper Text Markup Language', explanation: 'HTML is the standard markup language for creating web pages.' },
    ],
    TRUE_FALSE: [
      { questionText: 'An array has O(1) time complexity for accessing elements by index.', correctAnswer: 'True', explanation: 'Arrays provide constant-time access since elements are stored contiguously in memory.' },
      { questionText: 'Python is a compiled language.', correctAnswer: 'False', explanation: 'Python is an interpreted language, though it compiles to bytecode internally.' },
    ],
    SHORT_ANSWER: [
      { questionText: 'What is the difference between a stack and a queue?', correctAnswer: 'A stack uses LIFO (Last-In-First-Out) ordering, while a queue uses FIFO (First-In-First-Out) ordering.', explanation: 'Stacks are like a pile of plates; queues are like a line of people.' },
    ],
    ESSAY: [
      { questionText: 'Compare and contrast relational databases and NoSQL databases, discussing when to use each.', correctAnswer: 'Relational databases (SQL) use structured tables with schemas, support ACID transactions, and excel at complex queries. NoSQL databases offer flexible schemas, horizontal scaling, and are better for unstructured data. Use SQL for financial systems, analytics; use NoSQL for real-time apps, content management.', explanation: 'Database choice depends on data structure, scaling needs, and consistency requirements.' },
    ],
  },
  History: {
    MCQ: [
      { questionText: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: '1945', explanation: 'WWII ended in 1945 with the surrender of Germany in May and Japan in September.' },
      { questionText: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], correctAnswer: 'George Washington', explanation: 'George Washington served as the first U.S. President from 1789 to 1797.' },
      { questionText: 'The French Revolution began in which year?', options: ['1776', '1789', '1799', '1804'], correctAnswer: '1789', explanation: 'The storming of the Bastille on July 14, 1789, is considered the start.' },
    ],
    TRUE_FALSE: [
      { questionText: 'The Great Wall of China is visible from space with the naked eye.', correctAnswer: 'False', explanation: 'This is a common myth. The wall is too narrow to be seen from space without aid.' },
      { questionText: 'The Roman Empire fell in 476 AD.', correctAnswer: 'True', explanation: 'The Western Roman Empire fell in 476 AD when Romulus Augustulus was deposed.' },
    ],
    SHORT_ANSWER: [
      { questionText: 'What was the significance of the Magna Carta?', correctAnswer: 'The Magna Carta (1215) established the principle that everyone, including the king, is subject to the law. It laid the groundwork for constitutional governance.', explanation: 'It was a foundational document for modern democracy.' },
    ],
    ESSAY: [
      { questionText: 'Analyze the causes and consequences of World War I.', correctAnswer: 'WWI was caused by militarism, alliances, imperialism, and nationalism (MAIN), triggered by the assassination of Archduke Franz Ferdinand. Consequences included the fall of empires, the Treaty of Versailles, the League of Nations, and conditions that led to WWII.', explanation: 'WWI reshaped the political landscape of the 20th century.' },
    ],
  },
  'English Literature': {
    MCQ: [
      { questionText: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correctAnswer: 'William Shakespeare', explanation: 'Shakespeare wrote Romeo and Juliet around 1594-1596.' },
      { questionText: 'What literary device compares two unlike things using "like" or "as"?', options: ['Metaphor', 'Simile', 'Personification', 'Alliteration'], correctAnswer: 'Simile', explanation: 'A simile uses "like" or "as" for comparison (e.g., "brave as a lion").' },
    ],
    TRUE_FALSE: [
      { questionText: '"1984" was written by George Orwell.', correctAnswer: 'True', explanation: 'George Orwell published 1984 in 1949 as a dystopian novel.' },
    ],
    SHORT_ANSWER: [
      { questionText: 'What is the difference between a metaphor and a simile?', correctAnswer: 'A metaphor directly states one thing is another (e.g., "time is money"), while a simile compares using "like" or "as" (e.g., "fast as lightning").', explanation: 'Both are figures of speech used for comparison.' },
    ],
    ESSAY: [
      { questionText: 'Discuss the major themes in Shakespeare\'s "Hamlet" and their relevance today.', correctAnswer: 'Major themes include revenge, moral corruption, mortality, and the complexity of action. Hamlet\'s indecision reflects the human struggle between thought and action. These themes remain relevant as we still grapple with justice, ethics, and existential questions.', explanation: 'Hamlet is considered one of the most complex works in English literature.' },
    ],
  },
  Economics: {
    MCQ: [
      { questionText: 'What does GDP stand for?', options: ['Gross Domestic Product', 'General Domestic Price', 'Gross Development Plan', 'Global Domestic Production'], correctAnswer: 'Gross Domestic Product', explanation: 'GDP measures the total value of goods and services produced in a country.' },
      { questionText: 'What happens to demand when the price of a good increases (ceteris paribus)?', options: ['Demand increases', 'Demand decreases', 'Demand stays the same', 'Demand becomes zero'], correctAnswer: 'Demand decreases', explanation: 'The law of demand states price and quantity demanded are inversely related.' },
    ],
    TRUE_FALSE: [
      { questionText: 'Inflation means a general decrease in price levels.', correctAnswer: 'False', explanation: 'Inflation is a general increase in prices. A decrease is called deflation.' },
      { questionText: 'Opportunity cost is the value of the next best alternative foregone.', correctAnswer: 'True', explanation: 'Every choice has an opportunity cost — what you give up by choosing one option.' },
    ],
    SHORT_ANSWER: [
      { questionText: 'Explain the concept of supply and demand.', correctAnswer: 'Supply and demand is the relationship between the quantity of a product sellers are willing to produce and the quantity buyers want to purchase at various prices. Equilibrium is reached where supply equals demand.', explanation: 'This is the most fundamental concept in economics.' },
    ],
    ESSAY: [
      { questionText: 'Discuss the advantages and disadvantages of free trade versus protectionism.', correctAnswer: 'Free trade promotes efficiency, lower prices, and access to diverse goods. However, it can lead to job losses in uncompetitive sectors. Protectionism shields domestic industries but raises prices and can cause trade wars. The optimal policy depends on a country\'s economic development and strategic goals.', explanation: 'This is a central debate in international economics.' },
    ],
  },
};

// Fallback for subjects not in the bank
const GENERIC_QUESTIONS = {
  MCQ: [
    { questionText: 'Which of the following best describes the scientific method?', options: ['Making random guesses', 'Systematic observation, measurement, and experimentation', 'Reading textbooks', 'Memorizing facts'], correctAnswer: 'Systematic observation, measurement, and experimentation', explanation: 'The scientific method is a systematic approach to inquiry.' },
  ],
  TRUE_FALSE: [
    { questionText: 'Critical thinking involves evaluating evidence before drawing conclusions.', correctAnswer: 'True', explanation: 'Critical thinking requires analysis and evaluation of evidence.' },
  ],
  SHORT_ANSWER: [
    { questionText: 'Why is it important to cite your sources in academic work?', correctAnswer: 'Citing sources gives credit to original authors, allows readers to verify claims, and demonstrates the depth of your research.', explanation: 'Academic integrity requires proper attribution.' },
  ],
  ESSAY: [
    { questionText: 'Discuss the importance of interdisciplinary learning in modern education.', correctAnswer: 'Interdisciplinary learning connects knowledge across subjects, fostering creativity and problem-solving. Real-world problems rarely fit neatly into one discipline, so students who can integrate knowledge from multiple fields are better prepared.', explanation: 'Modern challenges require cross-disciplinary thinking.' },
  ],
};

// ──────────────────────────────────────────────
// Mock implementations
// ──────────────────────────────────────────────
function getQuestionsFromBank(subject, questionType, count, previousQuestions = []) {
  const subjectBank = QUESTION_BANK[subject] || QUESTION_BANK['Computer Science'];
  const typeBank = subjectBank[questionType] || subjectBank['MCQ'] || GENERIC_QUESTIONS[questionType] || GENERIC_QUESTIONS['MCQ'];

  // Filter out previously asked questions
  const available = typeBank.filter(
    (q) => !previousQuestions.includes(q.questionText)
  );

  // If we need more than available, allow repeats with shuffled text
  const result = [];
  for (let i = 0; i < count; i++) {
    if (available.length > 0) {
      const idx = Math.floor(Math.random() * available.length);
      result.push({ ...available[idx] });
      available.splice(idx, 1);
    } else {
      // Reuse from full bank with slight modification
      const fallback = typeBank[i % typeBank.length];
      result.push({
        ...fallback,
        questionText: fallback.questionText + ` (Variant ${i + 1})`,
      });
    }
  }

  // Ensure MCQ options exist for MCQ type, omit for others
  return result.map((q) => {
    if (questionType === 'MCQ') {
      return { ...q, options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'] };
    }
    const { options, ...rest } = q;
    return rest;
  });
}

function mockEvaluateAnswer({ correctAnswer, userAnswer, questionType }) {
  const userLower = (userAnswer || '').trim().toLowerCase();
  const correctLower = (correctAnswer || '').trim().toLowerCase();

  // Simple similarity check
  if (questionType === 'MCQ' || questionType === 'TRUE_FALSE') {
    const isCorrect = userLower === correctLower;
    return {
      score: isCorrect ? 100 : 0,
      isCorrect,
      feedback: isCorrect ? 'Correct! Well done.' : `Not quite. The correct answer is: ${correctAnswer}`,
      strengths: isCorrect ? ['Accurate knowledge of this topic'] : [],
      improvements: isCorrect ? [] : ['Review this concept and try again'],
    };
  }

  // For short answer / essay: check keyword overlap
  const correctWords = new Set(correctLower.split(/\s+/).filter((w) => w.length > 3));
  const userWords = new Set(userLower.split(/\s+/).filter((w) => w.length > 3));
  let matches = 0;
  for (const word of userWords) {
    if (correctWords.has(word)) matches++;
  }

  const coverage = correctWords.size > 0 ? matches / correctWords.size : 0;
  const lengthRatio = Math.min(userAnswer.length / Math.max(correctAnswer.length, 1), 1.5);
  const score = Math.min(100, Math.round(coverage * 70 + lengthRatio * 30));
  const isCorrect = score >= 70;

  return {
    score,
    isCorrect,
    feedback: score >= 80
      ? 'Excellent answer! You demonstrated strong understanding.'
      : score >= 60
      ? 'Good effort! Your answer covers some key points but could be more complete.'
      : score >= 40
      ? 'You\'re on the right track, but your answer needs more detail and accuracy.'
      : 'Your answer needs significant improvement. Review the core concepts and try again.',
    strengths: score >= 50
      ? ['Shows understanding of the topic', 'Addresses the question directly']
      : ['Attempted to answer the question'],
    improvements: score < 80
      ? ['Include more specific details', 'Use key terminology', 'Provide examples where possible']
      : [],
  };
}

// ──────────────────────────────────────────────
// Real AI implementation (Anthropic Claude)
// ──────────────────────────────────────────────
let aiClient = null;
let aiDisabled = false; // Set to true after unrecoverable errors (billing, auth)

function getAIClient() {
  if (aiDisabled) return null;
  if (aiClient) return aiClient;
  try {
    const apiKey = config.ai.apiKey;
    if (!apiKey || apiKey === 'sk-ant-...' || apiKey.includes('your-')) {
      return null;
    }
    const Anthropic = require('@anthropic-ai/sdk');
    aiClient = new Anthropic({ apiKey });
    return aiClient;
  } catch {
    return null;
  }
}

function isAIEnabled() {
  return !!getAIClient();
}

// Errors that mean we should stop trying the real API
function isUnrecoverableError(err) {
  const msg = err.message || '';
  return msg.includes('credit balance') || msg.includes('invalid x-api-key') || msg.includes('authentication');
}

// ──────────────────────────────────────────────
// Public API — uses real AI if available, mock otherwise
// ──────────────────────────────────────────────

const generateQuestions = async ({ subject, topic, difficulty, questionType, count, previousQuestions = [] }) => {
  const client = getAIClient();

  if (!client) {
    console.log(`[AI] Using mock questions for ${subject}/${questionType} (no API key configured)`);
    return getQuestionsFromBank(subject, questionType, count, previousQuestions);
  }

  // Real AI call
  const systemPrompt = `You are an expert academic question generator. Generate ${count} ${difficulty.toLowerCase()} ${questionType} questions about ${topic || 'general topics'} in ${subject}.

Rules:
- Questions must be clear, unambiguous, and educationally valuable
- ${questionType === 'MCQ' ? 'For MCQ: exactly 4 options, one correct, three plausible distractors.' : questionType === 'TRUE_FALSE' ? 'For True/False: the correct answer must be exactly "True" or "False".' : questionType === 'ESSAY' ? 'For Essay: create open-ended questions requiring detailed answers.' : 'For Short Answer: expect a brief 1-3 sentence response.'}
- Include a brief explanation for the correct answer
${previousQuestions.length > 0 ? `- Do NOT repeat these questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}` : ''}
- Respond ONLY in valid JSON format

Output format:
[{ "questionText": "...", ${questionType === 'MCQ' ? '"options": ["A", "B", "C", "D"], ' : ''}"correctAnswer": "...", "explanation": "..." }]`;

  for (let attempt = 0; attempt < config.ai.maxRetries; attempt++) {
    try {
      const response = await client.messages.create({
        model: config.ai.model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: 'Generate the questions now.' }],
        system: systemPrompt,
      });

      const text = response.content[0].text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found');
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error(`[AI] Attempt ${attempt + 1} failed:`, err.message);
      if (isUnrecoverableError(err)) {
        aiDisabled = true;
        console.log('[AI] API permanently unavailable — switching to mock mode for this session');
        return getQuestionsFromBank(subject, questionType, count, previousQuestions);
      }
      if (attempt === config.ai.maxRetries - 1) {
        console.log('[AI] Falling back to mock questions');
        return getQuestionsFromBank(subject, questionType, count, previousQuestions);
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
};

const evaluateAnswer = async ({ questionText, correctAnswer, userAnswer, questionType }) => {
  const client = getAIClient();

  if (!client) {
    return mockEvaluateAnswer({ correctAnswer, userAnswer, questionType });
  }

  // Real AI call
  const systemPrompt = `You are a fair and constructive academic evaluator.

Question: ${questionText}
Reference answer: ${correctAnswer}
Student's answer: ${userAnswer}

Evaluate the student's answer. Be encouraging but honest.

Respond ONLY in valid JSON:
{ "score": 0-100, "isCorrect": true/false, "feedback": "...", "strengths": ["..."], "improvements": ["..."] }`;

  try {
    const response = await client.messages.create({
      model: config.ai.model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'Evaluate the answer now.' }],
      system: systemPrompt,
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('[AI] Evaluation failed, using mock:', err.message);
    if (isUnrecoverableError(err)) {
      aiDisabled = true;
      console.log('[AI] API permanently unavailable — switching to mock mode for this session');
    }
    return mockEvaluateAnswer({ correctAnswer, userAnswer, questionType });
  }
};

const generateHints = async ({ questionText, subject, topic }) => {
  // Hints always use mock for simplicity — works great without AI
  return [
    `Think about the key concepts related to ${topic || subject}.`,
    `Consider how this topic connects to the fundamentals of ${subject}.`,
    `The answer involves a core principle — review the main definitions and formulas.`,
  ];
};

module.exports = {
  generateQuestions,
  evaluateAnswer,
  generateHints,
  isAIEnabled,
};
