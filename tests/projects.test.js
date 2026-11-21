import assert from 'node:assert/strict';
import { test } from 'node:test';
import projects, { filterProjects } from '../src/data/projects.js';
import skills from '../src/data/skills.js';

test('the archive keeps all projects and finds feature text with filters applied', () => {
  assert.deepEqual(filterProjects(projects, '', ''), projects);
  const matches = filterProjects(projects, 'upcoming dates price', 'Elasticsearch');
  assert.deepEqual(matches.map(({ id }) => id), [10]);
  assert.deepEqual(filterProjects(projects, 'upcoming dates price', 'MongoDB'), []);
});

test('each skill category links to a project in the archive', () => {
  for (const { projectId } of skills) {
    assert.ok(projects.some((project) => project.id === projectId));
  }
});
