import projects from './projects.js';
import { profile } from './profile.js';

const routes = new Map([
  ['~', '/'],
  ['home', '/'],
  ['projects', '/projects'],
  ['albums', '/albums'],
  ['contact', '/contact'],
]);

const files = new Map([
  ['about.txt', 'Who is Nihar?'],
  ['skills.txt', 'Show me his skills'],
  ['experience.txt', 'Show me his experience'],
  ['resume.pdf', 'Show me his résumé'],
  ['contact.txt', 'How can I contact Nihar?'],
]);

const commands = [
  ['help', 'List commands'],
  ['whoami', 'Show Nihar’s name and role'],
  ['pwd', 'Show the current page path'],
  ['ls', 'List pages or projects'],
  ['cd <page>', 'Navigate to a page'],
  ['open <page or project>', 'Open a page or project case study'],
  ['cat <file>', 'Read a portfolio file'],
  ['project <name or id>', 'Show project details'],
  ['ask <question>', 'Ask Scout about the portfolio'],
  ['clear', 'Clear the terminal'],
];

export const terminalShortcuts = ['help', 'ls', 'cat about.txt', 'ask How does AI automation work?'];

function reply(text, sources = []) {
  return { type: 'reply', text, sources };
}

function ask(question) {
  return { type: 'ask', question };
}

function routeFor(input) {
  const name = input.toLowerCase().replace(/^~?\/|\/$/g, '');
  if (!name || name === '..') return '/';
  return routes.get(name);
}

function findProject(input) {
  if (!input) return;
  const name = input.toLowerCase();
  const matches = projects.filter(({ id, title, shortTitle }) =>
    String(id) === name || (shortTitle ?? title.split(' – ')[0]).toLowerCase() === name || title.toLowerCase() === name
  );
  if (matches.length === 1) return matches[0];
  const partial = projects.filter((project) => project.title.toLowerCase().includes(name));
  if (partial.length === 1) return partial[0];
}

function listProjects() {
  return reply(
    projects.map(({ id, title }) => `${String(id).padStart(2, ' ')}  ${title}`).join('\n'),
    [{ label: 'All projects', href: '/projects' }],
  );
}

export function terminalPath(pathname) {
  return pathname === '/' ? '~' : `~${pathname.replace(/\/$/, '')}`;
}

export function completeTerminalInput(input) {
  const match = input.match(/^([a-z]+) (.*)$/i);
  const command = match?.[1].toLowerCase();
  const prefix = (match?.[2] ?? input).toLowerCase();
  if (!prefix) return;
  let candidates;
  if (command === 'cat') candidates = [...files.keys()];
  else if (command === 'cd' || command === 'open') candidates = [...routes.keys()];
  else if (!command) candidates = commands.map(([label]) => label.split(' ')[0]);
  else return;
  const matches = candidates.filter((item) => item.startsWith(prefix));
  if (matches.length === 1 && matches[0] !== prefix) {
    return command ? `${command} ${matches[0]}` : matches[0];
  }
}

export function runTerminalCommand(line, pathname) {
  const value = line.trim();
  const [name, ...words] = value.split(/\s+/);
  const command = name.toLowerCase();
  const args = words.join(' ');

  switch (command) {
    case 'help':
      return reply(commands.map(([label, description]) => `${label.padEnd(23)}${description}`).join('\n'));
    case 'whoami':
      return reply(`${profile.name}\n${profile.title} at ${profile.company}\n${profile.location}`);
    case 'pwd':
      return reply(terminalPath(pathname));
    case 'ls': {
      const destination = args ? routeFor(args) : pathname.replace(/\/$/, '');
      if (destination === '/projects') return listProjects();
      if (args && !destination) return reply(`Unknown page: ${args}`);
      return reply(
        `home/   projects/   albums/   contact/\n${[...files.keys()].join('   ')}`,
        [...routes.entries()].slice(1).map(([label, href]) => ({ label, href })),
      );
    }
    case 'cd':
    case 'open': {
      const destination = routeFor(args);
      if (destination) return { type: 'navigate', to: destination };
      const project = command === 'open' && findProject(args);
      if (project) return { type: 'navigate', to: `/projects?project=${project.id}` };
      return reply(`Unknown page or project: ${args}. Try ls or project <name>.`);
    }
    case 'cat': {
      const question = files.get(args.toLowerCase().replace(/^\.\//, ''));
      return question ? ask(question) : reply('Try cat about.txt, skills.txt, experience.txt, resume.pdf, or contact.txt.');
    }
    case 'projects':
      return listProjects();
    case 'project': {
      const project = findProject(args);
      return project ? ask(String(project.id)) : reply('Which project? Use ls projects for names and IDs.');
    }
    case 'ask':
      return args ? ask(args) : reply('Usage: ask <question about Nihar’s work>');
    case 'clear':
    case 'cls':
      return { type: 'clear' };
    default:
      return value.endsWith('?') ? ask(value) : reply(`Unknown command: ${name}. Type help or ask <question>.`);
  }
}
