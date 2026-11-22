import projects from './projects.js';
import { awards, crew, experienceSummary, profile, skillsSummary } from './profile.js';

export const starterQuestions = [
  'How does the AI automation platform work?',
  'Compare FIR Vault and CareSync',
  'How did Nihar improve performance?',
];

const projectNames = [
  [1, /\bfir(?: vault| tracker)?\b/],
  [2, /\b(?:care ?sync|healthcare management|hospital management)\b/],
  [3, /\b(?:nagrik|samvidhan|constitution(?:al literacy)?)\b/],
  [4, /\b(?:rainfall|smote|lstm)\b/],
  [5, /\b(?:classroom|screen sharing)\b/],
  [6, /\b(?:group chat|chat app)\b/],
  [7, /\b(?:career navigator|career guidance)\b/],
  [8, /\b(?:academic calendar|sih|smart india hackathon)\b/],
  [9, /\b(?:ai automation|automation platform|langgraph|supervisor|multi agent|agent workflow|react reasoning|adaptive cards?|human review|human in the loop|engineer review|approval workflow|controlled tools?)\b/],
  [10, /\b(?:course search|elasticsearch|autocomplete|course index|search suggestions|partial title)\b/],
];

const byId = new Map(projects.map((project) => [project.id, project]));
const archiveLink = { label: 'All projects', href: '/projects' };
const resumeLink = { label: 'July 2026 résumé', href: profile.resume, external: true };
const contactLink = { label: 'Contact Nihar', href: '/contact' };

const shortName = (project) => project.shortTitle ?? project.title.split(' – ')[0];
const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9+#]+/g, ' ').trim();

function mentionedProjects(question) {
  const exactId = question.match(/^(?:project )?(\d+)$/)?.[1];
  if (exactId && byId.has(Number(exactId))) return [byId.get(Number(exactId))];

  return projectNames.flatMap(([id, name]) => {
    const match = name.exec(question);
    return match ? [{ index: match.index, project: byId.get(id) }] : [];
  }).sort((a, b) => a.index - b.index).map(({ project }) => project);
}

function chosenProject(question, selection) {
  if (selection.length === 1 || /\b(?:first|former)\b/.test(question)) return selection[0];
  if (/\b(?:second|latter)\b/.test(question)) return selection[1];
}

function recentProjects(history) {
  let selection = [];
  for (const turn of history) {
    const question = normalize(turn);
    const named = mentionedProjects(question);
    if (named.length) selection = named;
    else {
      const chosen = chosenProject(question, selection);
      if (chosen) selection = [chosen];
    }
  }
  return selection;
}

export function projectLink(project) {
  return { label: shortName(project), href: `/projects?project=${project.id}` };
}

function projectReply(project, question) {
  let text;
  if (/\b(?:stack|technolog\w*|language|dependencies|framework\w*)\b/.test(question)) {
    text = `${shortName(project)} uses ${project.techStack.join(', ')}.`;
  } else if (/\b(?:github|source code|repo|demo|live link)\b/.test(question)) {
    text = project.links.github || project.links.live
      ? `Here are the published links for ${shortName(project)}.`
      : `${shortName(project)} is professional work described in Nihar’s case study and résumé.`;
  } else {
    const highlights = project.features.slice(0, 3).map((feature) => `• ${feature}`).join('\n');
    text = [project.description, highlights, project.outcome]
      .filter(Boolean).join('\n\n');
  }
  const sources = [projectLink(project)];
  if (project.links.github) sources.push({ label: 'Source code', href: project.links.github, external: true });
  if (project.links.live) sources.push({ label: 'Live project', href: project.links.live, external: true });
  if (project.id === 9) sources.push(resumeLink);
  return {
    text,
    sources,
    followUps: [`What stack does ${shortName(project)} use?`, 'Which projects should I start with?'],
    evidence: [project],
  };
}

function compareProjects(selection) {
  const compared = selection.slice(0, 3);
  const shared = compared[0].techStack.filter((tech) => compared.every((project) => project.techStack.includes(tech)));
  return {
    text: compared.map((project) => `${shortName(project)}\n${project.description}\n${project.features[0]}`)
      .concat(shared.length ? `They share ${shared.join(' and ')}.` : []).join('\n\n'),
    sources: compared.map(projectLink),
    followUps: compared.map((project) => `What stack does ${shortName(project)} use?`),
    evidence: compared,
  };
}

function recommend(ids, intro) {
  const choices = ids.map((id) => byId.get(id));
  return {
    text: [intro, ...choices.map((project) => `${shortName(project)}. ${project.description}`)].join('\n\n'),
    sources: [...choices.map(projectLink), archiveLink],
    followUps: choices.slice(0, 2).map((project) => `How does ${shortName(project)} work?`),
    evidence: choices,
  };
}

export function guideWelcome(guideId = 'scout') {
  const guide = Object.hasOwn(crew, guideId) ? crew[guideId] : crew.scout;
  return {
    text: `Hi, I’m ${guide.name}, one of Nihar’s portfolio assistants. ${guide.introduction}`,
    sources: [],
    followUps: [...new Set([guide.question, ...starterQuestions])].slice(0, 3),
  };
}

export function answerPortfolio(question, history = [], guideId = 'scout') {
  const query = normalize(question);
  if (/^(?:hi|hello|hey|hiya|namaste)(?: there| crew| scout| pip| atlas| byte)?$/.test(query) ||
      /^(?:good morning|good afternoon|good evening|who are you|what can you do)$/.test(query)) {
    return guideWelcome(guideId);
  }
  if (/^(?:thanks|thanks a lot|thank you|thank you so much|cheers)$/.test(query)) {
    return { text: 'You’re welcome! If you want to keep exploring, I’m here.', sources: [], followUps: [] };
  }
  const namedProjects = mentionedProjects(query);
  if (namedProjects.length > 1) return compareProjects(namedProjects);
  if (namedProjects.length === 1) return projectReply(namedProjects[0], query);

  if (/\b(?:solving for india|gfg amd)\b/.test(query)) {
    const { name, year, organizers, projectSummary } = awards.solvingForIndia;
    const text = `Nihar won the ${year} ${name}, organized by ${organizers}, with ${projectSummary}.`;
    return { text, sources: [{ label: 'About Nihar', href: '/' }], followUps: [], evidence: [{ summary: text }] };
  }

  if (/^(?:help|commands|menu)$/.test(query)) {
    return { text: 'Ask me about a project, compare two projects, or follow up with “what stack does it use?”. Shortcuts include about, skills, projects, experience, résumé, and contact.', sources: [archiveLink], followUps: starterQuestions };
  }
  if (/\b(?:contact|reach|email|get in touch|send message|write to)\b/.test(query)) {
    return { text: `You can email Nihar at ${profile.email} or use the contact form. He’s based in ${profile.location}.`, sources: [contactLink, { label: 'Email Nihar', href: `mailto:${profile.email}`, external: true }], followUps: ['Show me his résumé'] };
  }
  if (/\b(?:resume|cv)\b/.test(query)) {
    return { text: 'Here’s Nihar’s July 2026 résumé, including his engineering experience, projects, and education.', sources: [resumeLink], followUps: ['How did Nihar improve performance?'] };
  }
  if (/\b(?:github|linkedin|leetcode|socials?)\b/.test(query) && !/\b(?:it|that|this|project)\b/.test(query)) {
    return { text: 'Here are Nihar’s public profiles.', sources: ['github', 'linkedin', 'leetcode'].map((name) => ({ label: { github: 'GitHub', linkedin: 'LinkedIn', leetcode: 'LeetCode' }[name], href: profile[name], external: true })), followUps: [] };
  }
  if (/\b(?:it|its|that|this|those|first|second|former|latter)\b/.test(query) || /^(?:stack|what about the stack|how so|tell me more|source code|live demo)$/.test(query)) {
    const prior = recentProjects(history);
    const selected = chosenProject(query, prior);
    if (selected) return projectReply(selected, query);
    if (prior.length > 1) {
      return { text: 'Which of those projects should we look at?', sources: prior.map(projectLink), followUps: prior.map((project) => `What stack does ${shortName(project)} use?`) };
    }
  }
  if (/\b(?:speed|faster|performance|initialization|cold starts?|startup time|cache|caching|32 seconds|embeddings?)\b/.test(query)) {
    return { text: experienceSummary.performance, sources: [projectLink(byId.get(9)), resumeLink], followUps: [starterQuestions[0]], evidence: [{ summary: experienceSummary.performance }, byId.get(9)] };
  }
  if (/\b(?:experience|cisco|evolvision|internship|where does|job history|about|whoami|who is)\b/.test(query)) {
    return { text: `${experienceSummary.cisco}\n\n${experienceSummary.internship}`, sources: [resumeLink, projectLink(byId.get(9))], followUps: starterQuestions, evidence: [{ summary: `${experienceSummary.cisco} ${experienceSummary.internship}` }] };
  }
  if (/\b(?:education|degree|college|university)\b/.test(query)) {
    return { text: experienceSummary.education, sources: [resumeLink, projectLink(byId.get(8))], followUps: ['Tell me about the academic calendar'], evidence: [{ summary: experienceSummary.education }] };
  }
  if (/\b(?:skills|stack|technologies|expertise)\b/.test(query)) {
    return { text: skillsSummary, sources: [projectLink(byId.get(9)), projectLink(byId.get(10)), projectLink(byId.get(1))], followUps: starterQuestions, evidence: [{ summary: skillsSummary }, byId.get(9), byId.get(10)] };
  }
  if (/\b(?:rbac|role based access|permissions|audit log|audit trail)\b/.test(query)) {
    return compareProjects([byId.get(1), byId.get(2)]);
  }
  if (/\b(?:backend|architecture|spring boot|apis?|java|data)\b/.test(query)) {
    return recommend([10, 1, 2], 'Start here for three different backend problems.');
  }
  if (/\b(?:ai|llm|agents?|machine learning|rag)\b/.test(query)) {
    return recommend([9, 7], 'These projects show AI orchestration and a user-facing AI application.');
  }
  if (/\b(?:projects?|work|built|hire|portfolio|recommend|featured|start with)\b/.test(query)) {
    return recommend([9, 10, 1], 'These three case studies show Nihar’s work across AI, search, and backend architecture.');
  }
  return { text: 'I don’t have a verified answer to that. I can explain Nihar’s projects, experience, or technical choices.', sources: [archiveLink], followUps: starterQuestions };
}
