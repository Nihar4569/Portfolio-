export const profile = {
  name: 'Nihar Ranjan Sahu',
  title: 'Software Engineer',
  company: 'Cisco',
  location: 'Bengaluru, India',
  email: 'nihar4569@gmail.com',
  github: 'https://github.com/Nihar4569',
  linkedin: 'https://www.linkedin.com/in/nihar4569/',
  leetcode: 'https://leetcode.com/u/nihar4569/',
  resume: '/resume.pdf',
  hackathonCount: '4+',
};

export const awards = {
  smartIndia: {
    name: 'Smart India Hackathon',
    year: 2022,
    result: 'National Winner',
    organizers: 'Ministry of Education’s Innovation Cell (MIC) × AICTE',
  },
  solvingForIndia: {
    name: 'Solving For India Hackathon',
    year: 2023,
    result: 'Winner',
    organizers: 'GeeksforGeeks × AMD',
    projectSummary: 'a prototype that retrieves relevant medical information using vector embeddings',
  },
};

export const crew = {
  scout: {
    name: 'Scout', role: 'Portfolio guide', question: 'Which projects should I start with?',
    introduction: 'I can help you find a project to explore or get to know Nihar’s work.',
  },
  pip: {
    name: 'Pip', role: 'AI systems', question: 'How does the AI automation platform work?',
    introduction: 'I can walk you through Nihar’s AI workflows and how his agents work with engineers.',
  },
  atlas: {
    name: 'Atlas', role: 'Architecture', question: 'Compare FIR Vault and CareSync',
    introduction: 'I can help you trace how Nihar’s systems fit together and compare their design choices.',
  },
  byte: {
    name: 'Byte', role: 'Backend and data', question: 'How did Nihar improve performance?',
    introduction: 'I can show you how Nihar built search services and improved backend performance.',
  },
};

// Public summaries from the July 2026 résumé and confirmed portfolio details.
export const experienceSummary = {
  cisco: 'Nihar is a Software Engineer at Cisco in Bengaluru. He builds multi-agent engineering workflows with LangGraph and works on distributed embedding pipelines.',
  performance: 'At Cisco, Nihar reduced model initialization from 22 minutes to approximately 32 seconds, with 3×–12× improvements in embedding pipeline performance. His work used parallel processing, caching, and thread-safe state management. At Evolvision, he consolidated dashboard API calls and used Redis caching to help bring load time from about 8 seconds to 2 seconds.',
  internship: 'At Evolvision Technologies, Nihar worked on Java and Spring Boot applications and improved dashboard performance with Redis caching and API consolidation.',
  education: `Nihar earned a B.Tech in Computer Science and Engineering from Siksha ’O’ Anusandhan in Bhubaneswar. His team was the national winner at ${awards.smartIndia.name} ${awards.smartIndia.year} for an integrated academic calendar for the Ministry of Education. He also won the ${awards.solvingForIndia.year} ${awards.solvingForIndia.name}, organized by ${awards.solvingForIndia.organizers}.`,
};

export const skillsSummary = 'Nihar works with Java and Python, Spring Boot and FastAPI, and data stores including MongoDB, Milvus, and Redis. His AI work uses LangGraph, LangChain, and ReAct.';
