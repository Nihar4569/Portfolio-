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

test('the guide introduces both papers and follows a named study with verified findings and sources', () => {
  assert.ok(answerPortfolio('Hi').followUps.includes('What research did Nihar publish?'));
  const overview = answerPortfolio('What research did Nihar publish?');
  assert.match(overview.text, /TrustMyIDS/);
  assert.match(overview.text, /Weather Prediction with SMOTE/);
  assert.equal(overview.sources.length, 2);

  const question = 'Tell me about TrustMyIDS';
  const findings = answerPortfolio('What did it find?', [question]);
  assert.match(findings.text, /99\.44% accuracy and F1.*CyberAI Cup 2024/);
  assert.ok(findings.sources.some(({ href }) => href === '/research/trustmyids.pdf'));
  assert.match(answerPortfolio('Who co-authored it?', [question]).text, /Sankar Kumar Mridha, Nihar Ranjan Sahu, Ritwik Kumar Bholika/);

  const weather = answerPortfolio('How did the weather prediction study work?');
  assert.match(weather.text, /random forest.*LSTM.*SMOTE-balanced/);
  assert.equal(weather.sources[0].href, 'https://github.com/exploreces/Weather-detection/blob/main/WD_full_paper_SADCSS.pdf');
  assert.match(answerPortfolio('What stack does the rainfall project use?').text, /Python, TensorFlow/);
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
  assert.equal(response.body.fallbackReason, 'model-not-configured');
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

test('the model receives the publication facts and returns only their registered links', async (context) => {
  context.mock.method(globalThis, 'fetch', async (_url, options) => {
    const prompt = JSON.parse(options.body);
    const { publicFacts } = JSON.parse(prompt.contents[0].parts[0].text);
    const [ids, weather] = publicFacts.publications;
    assert.match(ids.findings, /99\.44% accuracy and F1/);
    assert.match(weather.methods, /SMOTE-balanced/);
    assert.ok(ids.authors.includes('Nihar Ranjan Sahu'));
    assert.ok(prompt.generationConfig.responseJsonSchema.properties.sourceIds.items.enum.includes('trustmyids-pdf'));
    return geminiReply({ text: 'Here is the TrustMyIDS paper.', sourceIds: ['trustmyids-ieee', 'trustmyids-pdf', 'unregistered'], followUps: [] });
  });
  const response = await callCrew({ question: 'Can I read TrustMyIDS?', guide: 'pip' }, { GEMINI_KEY: 'publication-test' });
  assert.equal(response.body.generated, true);
  assert.deepEqual(response.body.sources.map(({ href }) => href), [
    'https://ieeexplore.ieee.org/document/11156784', '/research/trustmyids.pdf',
  ]);
});

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
  assert.equal(response.body.model, 'gemini-3.5-flash-lite');
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
  assert.equal(response.body.fallbackReason, 'provider-rate-limited');
  assert.equal(response.body.text, answerPortfolio(question).text);
  assert.deepEqual(response.body.sources, answerPortfolio(question).sources);
  await callCrew({ question: 'Compare FIR Vault and CareSync', guide: 'atlas' }, env);
  assert.equal(modelRequests, 2);
});

test('the backup answers a hiring follow-up with the same conversation when the primary hits quota', async (context) => {
  const history = [
    { question: 'Tell me about his work at Cisco', answer: 'He built agent workflows at Cisco and reduced model startup time.' },
    { question: 'convience me to hire him', answer: 'He combines experience at Cisco with a Smart India Hackathon win.' },
  ];
  const calls = [];
  let now = Date.now();
  context.mock.method(Date, 'now', () => now);
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    const model = url.includes('3.5-flash-lite') ? 'primary' : 'backup';
    calls.push(model);
    const prompt = JSON.parse(options.body);
    const input = JSON.parse(prompt.contents[0].parts[0].text);
    if (input.question === 'other than this?') {
      assert.deepEqual(input.conversation, history);
      assert.match(prompt.systemInstruction.parts[0].text, /different verified evidence/);
      if (model === 'primary') {
        return Response.json({ error: { details: [
          { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '90s' },
        ] } }, { status: 429 });
      }
    }
    return geminiReply({ text: 'At Evolvision, he consolidated dashboard API calls and cached frequently accessed data.',
      sourceIds: ['resume'], followUps: [] });
  });
  const env = { GEMINI_KEY: 'recruiter-conversation-test' };
  for (const [index, turn] of history.entries()) {
    const response = await callCrew({ question: turn.question, history: history.slice(0, index) }, env);
    assert.equal(response.body.model, 'gemini-3.5-flash-lite');
  }
  const followUp = await callCrew({ question: 'other than this?', history }, env);
  assert.equal(followUp.body.generated, true);
  assert.equal(followUp.body.model, 'gemini-3.1-flash-lite');
  assert.match(followUp.body.text, /Evolvision/);
  assert.equal(followUp.body.sources[0].href, '/resume.pdf');

  now += 75_000;
  assert.equal((await callCrew({ question: 'What else can I ask?', history }, env)).body.model, 'gemini-3.1-flash-lite');
  now += 16_000;
  assert.equal((await callCrew({ question: 'Can you describe his backend experience?', history }, env)).body.model, 'gemini-3.5-flash-lite');
  assert.deepEqual(calls, ['primary', 'primary', 'primary', 'backup', 'backup', 'primary']);
});

test('reaching a model’s local minute limit still leaves the other model available', async (context) => {
  let calls = 0;
  context.mock.method(globalThis, 'fetch', async () => {
    calls += 1;
    return geminiReply({ text: 'Nihar builds AI workflows and backend services.', sourceIds: [], followUps: [] });
  });
  const env = { GEMINI_KEY: 'model-budget-test' };
  for (let index = 0; index < 12; index += 1) {
    const { body } = await callCrew({ question: `Tell me about his work, part ${index}` }, env);
    assert.equal(body.model, index < 8 ? 'gemini-3.5-flash-lite' : 'gemini-3.1-flash-lite');
  }
  const limited = await callCrew({ question: 'Tell me about his work again' }, env);
  assert.equal(limited.body.generated, false);
  assert.equal(limited.body.fallbackReason, 'site-rate-limited');
  assert.equal(calls, 12);
});

test('an incomplete model output can be answered by the fallback model', async (context) => {
  const calls = [];
  context.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(url);
    if (url.includes('3.1-flash-lite')) return Response.json({ candidates: [{ finishReason: 'MAX_TOKENS' }] });
    return geminiReply({ text: 'Nihar uses LangGraph to coordinate agents.', sourceIds: ['project-9'], followUps: [] });
  });
  const { body } = await callCrew({ question: 'Which technologies does he use?' }, {
    GEMINI_KEY: 'truncated-model-test', GEMINI_MODEL: 'gemini-3.1-flash-lite',
  });
  assert.equal(body.model, 'gemini-3.5-flash-lite');
  assert.equal(calls.length, 2);
  assert.match(calls[0], /gemini-3\.1-flash-lite/);
});

test('a shared credential rejection stops attempts across both models', async (context) => {
  let calls = 0;
  context.mock.method(globalThis, 'fetch', async () => {
    calls += 1;
    return Response.json({ error: { details: [
      { '@type': 'type.googleapis.com/google.rpc.ErrorInfo', reason: 'API_KEY_INVALID' },
    ] } }, { status: 400 });
  });
  const env = { GEMINI_KEY: 'credential-rejection-test' };
  assert.equal((await callCrew({ question: 'Hello' }, env)).body.fallbackReason, 'credentials-unavailable');
  await callCrew({ question: 'What did Nihar build?' }, env);
  assert.equal(calls, 1);
});
