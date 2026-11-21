import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleCrew } from '../api/crew.js';
import { answerPortfolio } from '../src/data/assistant.js';

test('the guide connects search questions to the published project and code', () => {
  const answer = answerPortfolio('How does the Course Search API work?');
  assert.match(answer.text, /Elasticsearch/);
  assert.ok(answer.sources.some(({ href }) => href === '/projects?project=10'));
  assert.ok(answer.sources.some(({ href }) => href === 'https://github.com/Nihar4569/Elasticsearch-course-search'));
});

test('the guide can compare projects and follow an explicit selection', () => {
  const comparison = 'Compare FIR Vault with Course Search';
  const answer = answerPortfolio(comparison);
  assert.deepEqual(answer.sources.map(({ href }) => href), ['/projects?project=1', '/projects?project=10']);
  assert.match(answerPortfolio('What stack did it use?', [comparison]).text, /Which of those projects/);
  const followUp = answerPortfolio('What stack did it use?', [comparison, 'Tell me about the second one']);
  assert.match(followUp.text, /^Course Search API uses .*Elasticsearch/);
});

test('a question with no portfolio evidence returns a grounded fallback', () => {
  const answer = answerPortfolio('What is his favorite movie?');
  assert.match(answer.text, /verified answer/);
  assert.equal(answer.evidence, undefined);
});

test('all four guides greet visitors in their own role when Gemini is unavailable', () => {
  for (const guide of ['Scout', 'Pip', 'Atlas', 'Byte']) {
    const answer = answerPortfolio('HI!', [], guide.toLowerCase());
    assert.ok(answer.text.startsWith(`Hi, I’m ${guide}`));
    assert.deepEqual(answer.sources, []);
    assert.ok(answer.followUps.length > 0);
  }
});

test('the guide retrieves architecture and cold-start evidence from common phrasing', () => {
  assert.deepEqual(
    answerPortfolio('What projects demonstrate role-based access?').sources.map(({ href }) => href),
    ['/projects?project=1', '/projects?project=2'],
  );
  assert.match(answerPortfolio('How did Nihar reduce cold starts?').text, /22 minutes/);
});

async function callCrew(body, env = {}, headers = {}) {
  const request = {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'portfolio.test', ...headers },
    socket: { remoteAddress: '127.0.0.1' },
    body,
  };
  const response = {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(data) { this.body = JSON.parse(data); },
  };
  await handleCrew(request, response, env);
  return response;
}

test('the server returns the curated answer and sources without a model key', async () => {
  const question = 'How does the AI automation platform work?';
  const response = await callCrew({ question });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['Cache-Control'], 'no-store');
  const { text, sources } = answerPortfolio(question);
  assert.equal(response.body.text, text);
  assert.deepEqual(response.body.sources, sources);
  assert.equal(response.body.generated, false);
  assert.equal('evidence' in response.body, false);
});

test('the server rejects malformed history, oversized bodies, and cross-origin posts', async () => {
  const responses = await Promise.all([
    callCrew({ question: 'AI projects?', history: [123] }),
    callCrew({ question: 'a'.repeat(16_384) }),
    callCrew({ question: 'AI projects?' }, {}, { origin: 'https://other.test' }),
    callCrew({ question: 'AI projects?', guide: 'constructor' }),
    callCrew({ question: 'AI projects?', history: [{ question: 'Hi', answer: 'a'.repeat(721) }] }),
  ]);
  assert.deepEqual(responses.map(({ statusCode }) => statusCode), [400, 413, 403, 400, 400]);
});

function geminiReply(answer) {
  return Response.json({
    candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(answer) }] } }],
  });
}

test('Gemini uses public facts, conversation, and trusted source IDs, and reuses an identical answer', async (context) => {
  let modelRequests = 0;
  const history = [{ question: 'Where should I start?', answer: 'Start with the AI automation platform.' }];
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    modelRequests += 1;
    assert.match(url, /models\/gemini-3\.5-flash-lite:generateContent$/);
    assert.equal(options.headers['x-goog-api-key'], 'test-key');
    const prompt = JSON.parse(options.body);
    assert.match(prompt.systemInstruction.parts[0].text, /Pip.*agent routing/);
    assert.equal(prompt.generationConfig.thinkingConfig.thinkingLevel, 'MINIMAL');
    assert.equal(prompt.generationConfig.responseMimeType, 'application/json');
    assert.equal('tools' in prompt, false);
    const input = JSON.parse(prompt.contents[0].parts[0].text);
    assert.deepEqual(input.conversation, history);
    assert.equal(input.publicFacts.projects[0].id, 9);
    assert.equal('links' in input.publicFacts.projects[0], false);
    return geminiReply({
      text: 'LangGraph routes requests to specialists.',
      sourceIds: ['project-9', 'resume', 'invented-url', 'project-9'],
      followUps: [' How does engineer review work? ', 'How does engineer review work?', 'https://untrusted.invalid'],
    });
  });
  const env = { GEMINI_KEY: 'test-key' };
  const question = 'How does the AI automation platform work?';
  const input = { question, guide: 'pip', history };
  const [response, duplicate] = await Promise.all([callCrew(input, env), callCrew(input, env)]);
  assert.equal(response.body.text, 'LangGraph routes requests to specialists.');
  assert.equal(response.body.generated, true);
  assert.deepEqual(response.body.sources, answerPortfolio(question).sources);
  assert.deepEqual(response.body.followUps, ['How does engineer review work?']);
  assert.deepEqual(duplicate.body, response.body);
  assert.deepEqual((await callCrew(input, env)).body, response.body);
  assert.equal(modelRequests, 1);
});

test('greetings, indirect project questions, and unverified topics reach Gemini', async (context) => {
  const answers = {
    HI: { text: 'Hey, I’m Scout! What would you like to explore?', sourceIds: [] },
    'Which project narrows a catalog by price?': {
      text: 'Course Search API lets visitors filter by price.', sourceIds: ['project-10'],
    },
    'What is his favorite movie?': { text: 'Nihar’s portfolio doesn’t say.', sourceIds: [] },
  };
  const calls = [];
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    const prompt = JSON.parse(options.body);
    const { question } = JSON.parse(prompt.contents[0].parts[0].text);
    calls.push(prompt.systemInstruction.parts[0].text);
    return geminiReply({ ...answers[question], followUps: [] });
  });
  const env = { GEMINI_KEY: 'test-key' };
  const guides = ['scout', 'byte', 'atlas'];
  for (const [index, [question, answer]] of Object.entries(answers).entries()) {
    const response = await callCrew({ question, guide: guides[index] }, env);
    assert.equal(response.body.generated, true);
    assert.equal(response.body.text, answer.text);
    assert.deepEqual(response.body.sources.map(({ href }) => href), answer.sourceIds.length ? ['/projects?project=10'] : []);
  }
  assert.match(calls[0], /Scout.*greetings/);
  assert.match(calls[1], /Byte.*backend/);
  assert.match(calls[2], /Atlas.*architecture/);
});

test('an unusable model reply falls back to a friendly greeting', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => geminiReply({ text: 'Visit https://untrusted.invalid' }));
  const response = await callCrew({ question: 'Hello', guide: 'atlas' }, { GEMINI_KEY: 'test-key' });
  assert.equal(response.body.generated, false);
  assert.match(response.body.text, /^Hi, I’m Atlas/);
});

test('the endpoint keeps text and source links available when Gemini runs out of quota', async (context) => {
  let modelRequests = 0;
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    modelRequests += 1;
    assert.equal(options.headers['x-goog-api-key'], 'legacy-configured-key');
    return new Response(null, { status: 429 });
  });
  const env = { GEMINI_API_KEY: 'legacy-configured-key' };
  const question = 'How does Course Search handle partial titles?';
  const response = await callCrew({ question, guide: 'byte' }, env);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.generated, false);
  assert.equal(response.body.text, answerPortfolio(question).text);
  assert.deepEqual(response.body.sources, answerPortfolio(question).sources);
  await callCrew({ question: 'Compare FIR Vault and CareSync', guide: 'atlas' }, env);
  assert.equal(modelRequests, 1);
});
