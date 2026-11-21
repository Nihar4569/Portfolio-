import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRouteTransition, updateRouteTransition } from '../src/utils/routeTransition.js';

function navigate(state, pathname, options = {}) {
  return updateRouteTransition(state, {
    type: 'navigate',
    location: { pathname, search: options.search ?? '' },
    animate: options.animate ?? true,
  });
}

function finish(state, type, revision = state.revision) {
  return updateRouteTransition(state, { type, revision });
}

test('the old route stays mounted through exit, and a ready route still shows the loader', () => {
  const initial = createRouteTransition({ pathname: '/' });
  const leaving = navigate(initial, '/projects');
  assert.equal(leaving.screen.pathname, '/');
  assert.equal(leaving.phase, 'leaving');
  const loading = finish(leaving, 'covered');
  assert.equal(loading.screen.pathname, '/projects');
  assert.equal(finish(loading, 'mounted').phase, 'loading');
  const entering = finish(finish(loading, 'mounted'), 'loaderShown');
  assert.equal(entering.phase, 'entering');
  assert.equal(finish(entering, 'revealed').phase, 'idle');
});

test('a slow route remains covered, and a superseded page cannot trigger the reveal', () => {
  const initial = createRouteTransition({ pathname: '/' });
  const loading = finish(navigate(initial, '/projects'), 'covered');
  const waiting = finish(loading, 'loaderShown');
  assert.equal(waiting.phase, 'loading');
  const retargeted = navigate(waiting, '/contact');
  assert.equal(retargeted.screen.pathname, '/contact');
  assert.equal(finish(retargeted, 'mounted', loading.revision).phase, 'loading');
  assert.equal(finish(retargeted, 'mounted').phase, 'entering');
});

test('rapid navigation and going back before the cover completes keep the latest destination', () => {
  const initial = createRouteTransition({ pathname: '/' });
  const leaving = navigate(navigate(initial, '/projects'), '/albums');
  assert.equal(finish(leaving, 'covered').screen.pathname, '/albums');
  const canceled = navigate(leaving, '/');
  assert.equal(canceled.screen.pathname, '/');
  assert.equal(canceled.phase, 'entering');
  assert.equal(finish(canceled, 'covered'), canceled);
});

test('reduced motion and same-path project links update immediately', () => {
  const initial = createRouteTransition({ pathname: '/' });
  const projects = navigate(navigate(initial, '/contact'), '/projects', { animate: false });
  assert.equal(projects.phase, 'idle');
  assert.equal(projects.screen.pathname, '/projects');
  const detail = navigate(projects, '/projects', { search: '?project=9' });
  assert.equal(detail.phase, 'idle');
  assert.equal(detail.revision, projects.revision);
  assert.equal(detail.screen.search, '?project=9');
});
