import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeLeadAttempt, isAllowedLeadOrigin, readLeadJson, LeadBodyTooLarge, MAX_LEAD_BYTES } from '../src/lib/lead-security.ts';
const request = (body, headers={}) => new Request('https://hosteditify.com/api/lead', { method:'POST', body, headers });

test('rejects cross-site browser submissions and accepts own origin', () => {
  assert.equal(isAllowedLeadOrigin(request('{}', { origin:'https://evil.example' })), false);
  assert.equal(isAllowedLeadOrigin(request('{}', { 'sec-fetch-site':'cross-site' })), false);
  assert.equal(isAllowedLeadOrigin(request('{}', { origin:'https://hosteditify.com' })), true);
});
test('bounds both declared and streamed body size, including multibyte input', async () => {
  await assert.rejects(readLeadJson(request('{}', { 'content-length':String(MAX_LEAD_BYTES+1) })), LeadBodyTooLarge);
  await assert.rejects(readLeadJson(request('x'.repeat(MAX_LEAD_BYTES+1))), LeadBodyTooLarge);
  await assert.rejects(readLeadJson(request('😀'.repeat(5000))), LeadBodyTooLarge);
  assert.deepEqual(await readLeadJson(request('{"name":"A"}')), { name:'A' });
  await assert.rejects(readLeadJson(request('{bad')), SyntaxError);
});
test('limits repeated attempts, expires windows and isolates clients', () => {
  const now=1_000_000;
  for(let i=0;i<8;i++) assert.equal(consumeLeadAttempt('client-one',now),0);
  assert.equal(consumeLeadAttempt('client-one',now),600);
  assert.equal(consumeLeadAttempt('client-two',now),0);
  assert.equal(consumeLeadAttempt('client-one',now+600_000),0);
});
