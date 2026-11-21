import assert from 'node:assert/strict';
import { test } from 'node:test';
import { answerPortfolio } from '../src/data/assistant.js';
import projects, { projectTechnologies } from '../src/data/projects.js';
import { completeTerminalInput, runTerminalCommand, terminalPath } from '../src/data/terminal.js';

test('listing the Projects directory reads the current archive', () => {
  const listing = runTerminalCommand('ls', '/projects');
  assert.equal(listing.type, 'reply');
  for (const project of projects) assert.ok(listing.text.includes(project.title));
  assert.equal(terminalPath('/projects'), '~/projects');
  const technologies = projectTechnologies(projects);
  assert.ok(technologies.includes('React'));
  assert.ok(technologies.includes('ReAct'));
  assert.ok(!technologies.includes('React.js'));
});

test('commands only navigate to portfolio routes and known case studies', () => {
  assert.deepEqual(runTerminalCommand('cd /albums/', '/'), { type: 'navigate', to: '/albums' });
  assert.deepEqual(runTerminalCommand('open course search', '/'), { type: 'navigate', to: '/projects?project=10' });
  assert.deepEqual(runTerminalCommand('cd ..', '/albums'), { type: 'navigate', to: '/' });
  assert.equal(runTerminalCommand('open https://example.com/', '/').type, 'reply');
  assert.equal(runTerminalCommand('cat ../.env.local', '/').type, 'reply');
});

test('file reads, projects, and ask resolve through the portfolio assistant', () => {
  const resume = runTerminalCommand('cat resume.pdf', '/');
  assert.equal(resume.type, 'ask');
  assert.equal(answerPortfolio(resume.question).sources[0].href, '/resume.pdf');
  const project = runTerminalCommand('project AI automation', '/');
  assert.equal(answerPortfolio(project.question).sources[0].href, '/projects?project=9');
  const question = runTerminalCommand('ask Compare FIR Vault and CareSync', '/');
  assert.equal(answerPortfolio(question.question).sources.length, 2);
});

test('completion only replaces unambiguous partial commands or arguments', () => {
  assert.equal(completeTerminalInput('wh'), 'whoami');
  assert.equal(completeTerminalInput('cat sk'), 'cat skills.txt');
  assert.equal(completeTerminalInput('cd pro'), 'cd projects');
  assert.equal(completeTerminalInput('c'), undefined);
  assert.equal(completeTerminalInput('cat skills.txt'), undefined);
  assert.deepEqual(runTerminalCommand('clear', '/'), { type: 'clear' });
});
