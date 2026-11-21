const projects = [
  {
    id: 9,
    title: 'AI Automation Platform',
    shortTitle: 'AI automation',
    category: 'AI systems at Cisco',
    description: 'A LangGraph workflow for routing engineering requests, coordinating specialist agents, and involving engineers in decisions that change system state.',
    techStack: ['Python', 'LangGraph', 'LangChain', 'ReAct', 'FastAPI'],
    features: [
      'A supervisor classifies requests and routes them to specialist workers based on intent and confidence.',
      'Specialist agents use ReAct reasoning and controlled tool execution.',
      'Webex Adaptive Cards connect human decisions with backend workflows for actions that change system state.',
      'Parallel processing, caching, and thread-safe state management improve the distributed embedding pipeline.',
    ],
    outcome: 'Model initialization fell from 22 minutes to roughly 32 seconds. Embedding pipeline performance improved by 3×–12×.',
    links: {},
    guide: 'pip',
    featured: true,
  },
  {
    id: 10,
    title: 'Course Search API',
    shortTitle: 'Course Search API',
    category: 'Search infrastructure',
    description: 'A Spring Boot and Elasticsearch service for searching courses by text, refining results with filters, and suggesting titles as users type.',
    techStack: ['Java', 'Spring Boot', 'Elasticsearch', 'Docker'],
    features: [
      'Full-text search over course titles and descriptions, with category, age, price, and date filters.',
      'Pagination and sorting by upcoming dates or price.',
      'A suggestions endpoint for partial course titles.',
      'A sample course index and Docker Compose setup for local development.',
    ],
    links: { github: 'https://github.com/Nihar4569/Elasticsearch-course-search' },
    guide: 'byte',
    featured: true,
  },
  {
    id: 1,
    title: "FIR Vault – Case Management System",
    description: "A backend-driven FIR tracking and case management system supporting structured record management across multiple jurisdictions with secure, permission-driven workflows.",
    features: [
      "Multi-portal architecture with User, Police, Station, and Admin interfaces",
      "Role-based access control (RBAC) for citizens, police personnel, and administrators",
      "Structured backend services using MVC architecture for modular, scalable code",
      "Real-time FIR tracking and status updates for complainants",
      "Case management workflow from submission to resolution"
    ],
    techStack: ["Spring Boot", "React.js", "MongoDB Atlas", "REST APIs"],
    links: {
      github: "https://github.com/Nihar4569/FIR_VAULT_FRONTEND",
      live: "https://firvault.vercel.app/"
    },
    image: "/images/projects/fir-tracker.avif",
    featured: true
  },
  {
    id: 2,
    title: "CareSync – Healthcare Management Platform",
    description: "A scalable healthcare management system supporting real-time bed tracking, patient registration, doctor assignment, and inventory management designed for government use cases.",
    features: [
      "Real-time tracking of hospital beds, patient registrations, and doctor assignments",
      "Role-based access control (RBAC) and audit logging for secure workflows",
      "Modular REST APIs using Spring Boot for maintainable backend architecture",
      "Medicine stock and inventory management system",
      "Operational transparency with comprehensive audit trails"
    ],
    techStack: ["Java", "Spring Boot", "MongoDB", "React"],
    links: {
      github: "https://github.com/Nihar4569/CareSync--A-Hospital-Management-App",
      live: "https://caresyncdelhi.vercel.app/"
    },
    image: "/images/projects/health-connect.avif",
    featured: true
  },
  {
    id: 3,
    title: "Nagrik Aur Samvidhan (Citizen & Constitution)",
    description: "A platform designed to simplify and spread awareness about the Constitution of India using a gamified approach to make learning about constitutional rights, duties, and principles more engaging and accessible.",
    features: [
      "Gamified learning of constitutional concepts",
      "Interactive quizzes and challenges",
      "Simplified explanations of complex legal principles",
      "Progress tracking and achievement system",
      "Accessible design for users of all ages"
    ],
    techStack: ["React", "Node.js", "MongoDB", "Express.js"],
    links: {
      github: "https://github.com/Nihar4569/Nagrik-Aur-Samvidhan-Constitutional-Literacy-Platform?tab=readme-ov-file",
      live: "https://github.com/Nihar4569/Nagrik-Aur-Samvidhan-Constitutional-Literacy-Platform?tab=readme-ov-file"
    },
    image: "/images/projects/nagrik-samvidhan.avif",
    featured: false
  },
  {
    id: 4,
    title: "Rainfall Prediction Using SMOTE and LSTM",
    description: "A research project that improves rainfall prediction accuracy by addressing class imbalance and capturing temporal dependencies in weather data.",
    features: [
      "Enhanced model sensitivity for extreme rainfall events using SMOTE",
      "Temporal dependencies capture through LSTM architecture",
      "Improved overall prediction accuracy",
      "Data preprocessing and feature engineering for weather data",
      "Comprehensive model evaluation and validation"
    ],
    techStack: ["Python", "TensorFlow", "Scikit-learn", "Pandas", "Matplotlib"],
    links: {
      github: "https://github.com/Nihar4569/An-Empirical-Study-on-Harmonizing-Classification-Precision-by-Adopting-a-SMOTE-Based-Data-Balancing-",
      live: ""
    },
    image: "/images/projects/rainfall-prediction.avif",
    featured: false
  },
  {
    id: 5,
    title: "Classroom Management System",
    description: "A real-time classroom communication platform that enhances the virtual learning experience with interactive features for both teachers and students.",
    features: [
      "Real-time screen sharing with audio functionality",
      "Super admin controls for verifying teachers and managing access",
      "Automatic classroom routing based on subjects",
      "Integrated messaging and file sharing capabilities",
      "Seamless user experience with modern UI design"
    ],
    techStack: ["React", "Firebase", "Chakra UI", "Node.js", "Express.js"],
    links: {
      github: "https://github.com/Nihar4569/ClassRoom_Management",
      live: "https://soaclassroom.vercel.app/"
    },
    image: "/images/projects/classroom.avif",
    featured: true
  },
  {
    id: 6,
    title: "Group Chat Application",
    description: "A real-time group chat application that allows users to create groups, join them, and communicate through text and multimedia sharing.",
    features: [
      "Create and join chat groups",
      "User authentication and authorization",
      "Real-time messaging using WebSocket",
      "File sharing (images, PDFs, and other documents)",
      "User presence indicators and notifications"
    ],
    techStack: ["React", "Node.js", "FireBase Authentication","FireBase Realtime Database"],
    links: {
      github: "https://github.com/Nihar4569/Chat_App",
      live: "https://chat-app-liart-sigma.vercel.app/"
    },
    image: "/images/projects/group-chat.avif",
    featured: false
  },
  {
    id: 7,
    title: "AI Career Navigator",
    description: "A web-based career recommendation system that uses machine learning to provide personalized career guidance and educational pathways.",
    features: [
      "Personalized career recommendations based on user profiles",
      "Aptitude test module for accurate career matching",
      "Detailed job descriptions and educational pathways",
      "Salary insights and market trends",
      "Educational resource recommendations"
    ],
    techStack: ["Python", "Flask", "MongoDB", "HTML", "CSS", "Machine Learning"],
    links: {
      github: "https://github.com/Nihar4569/AI-Career-Navigator",
      live: "https://github.com/Nihar4569/AI-Career-Navigator"
    },
    image: "/images/projects/career-navigator.avif",
    featured: false
  },
  {
    id: 8,
    title: "Integrated Annual Academic Calendar",
    description: "A Smart India Hackathon 2022 winning project that centralizes academic calendars for all Indian universities, promoting efficiency and uniformity in the education system.",
    features: [
      "Centralized academic schedule management",
      "Event management system for regulatory control",
      "University and government body collaboration tools",
      "Real-time event updates and notifications",
      "Compliance with educational regulations"
    ],
    techStack: ["HTML", "CSS", "JavaScript", "MySQL"],
    links: {
      github: "https://github.com/Nihar4569/academicalendar",
      live: "http://academicalendar.kesug.com/"
    },
    image: "/images/projects/academic-calendar.avif",
    featured: false
  }
];

export function technologyLabel(technology) {
  return technology === 'React.js' ? 'React' : technology;
}

export function projectTechnologies(items) {
  return [...new Set(items.flatMap(({ techStack }) => techStack.map(technologyLabel)))].sort();
}

export function filterProjects(items, query, technology) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter((project) => {
    if (technology && !project.techStack.some((tech) => technologyLabel(tech) === technology)) return false;
    const searchable = [project.title, project.shortTitle, project.category, project.description,
      ...project.techStack, ...project.features].join(' ').toLowerCase();
    return words.every((word) => searchable.includes(word));
  });
}

export default projects;
