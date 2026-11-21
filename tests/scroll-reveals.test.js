import assert from 'node:assert/strict';
import { test } from 'node:test';
import { observeScrollReveals } from '../src/utils/scrollReveals.js';

function revealNode() {
  return {
    nodeType: 1,
    revealed: false,
    matches() { return !this.revealed; },
    querySelectorAll() { return []; },
    setAttribute(name) {
      assert.equal(name, 'data-scroll-revealed');
      this.revealed = true;
    },
  };
}

test('fallback reveals newly mounted cards and releases removed cards', (context) => {
  const first = revealNode();
  const root = { nodeType: 1, matches: () => false, querySelectorAll: () => [first] };
  const pending = new Set();
  let onVisibility;
  let onUpdates;
  let cleanedUp = false;

  const globals = {
    CSS: { supports: () => false },
    window: { matchMedia: () => ({ matches: true }) },
    IntersectionObserver: class {
      constructor(callback) { onVisibility = callback; }
      observe(node) { pending.add(node); }
      unobserve(node) { pending.delete(node); }
      disconnect() { pending.clear(); }
    },
    MutationObserver: class {
      constructor(callback) { onUpdates = callback; }
      observe() {}
      disconnect() { cleanedUp = true; }
    },
  };
  const previous = Object.fromEntries(Object.keys(globals).map((name) => [name, globalThis[name]]));
  Object.assign(globalThis, globals);
  context.after(() => Object.assign(globalThis, previous));

  const stop = observeScrollReveals(root);
  assert.ok(pending.has(first));
  onVisibility([{ target: first, isIntersecting: false }]);
  assert.equal(first.revealed, false);

  const added = revealNode();
  onUpdates([{ removedNodes: [first], addedNodes: [added] }]);
  assert.deepEqual([...pending], [added]);
  onVisibility([{ target: added, isIntersecting: true }]);
  assert.equal(added.revealed, true);
  assert.equal(pending.size, 0);

  stop();
  assert.equal(cleanedUp, true);
});
