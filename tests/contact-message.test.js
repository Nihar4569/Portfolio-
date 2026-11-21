import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contactMessage } from '../src/utils/contactMessage.js';

test('contact messages retain their paragraphs and include the reply address and time', () => {
  const input = new FormData();
  input.set('user_name', '  Kavya Rao  ');
  input.set('user_email', 'kavya@example.test');
  input.set('subject', '  Backend role  ');
  input.set('message', '\nI would like to discuss a backend role.\n\nCould we talk on Monday?  ');

  const payload = contactMessage(input, new Date('2026-11-21T15:30:00Z'));
  assert.equal(payload.user_name, 'Kavya Rao');
  assert.equal(payload.user_email, 'kavya@example.test');
  assert.equal(payload.subject, 'Backend role');
  assert.match(payload.timestamp, /21 Nov 2026, 9:00 pm IST/i);
  assert.equal(payload.message, [
    'From: Kavya Rao',
    'Reply to: kavya@example.test',
    'Subject: Backend role',
    `Received: ${payload.timestamp}`,
    '',
    'I would like to discuss a backend role.',
    '',
    'Could we talk on Monday?',
  ].join('\n'));

  input.set('subject', '  ');
  assert.equal(contactMessage(input).subject, 'Portfolio inquiry');
});
