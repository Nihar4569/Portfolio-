const projects = [
  {
    id: 1,
    title: "Delhi Health Connect (CareSync)",
    description: "A comprehensive healthcare management system designed for the Delhi Government that efficiently manages hospital resources and patient care in real-time.",
    features: [
      "Real-time tracking of hospital beds, patient registrations, and doctor assignments",
      "Medicine stock management system",
      "Transparent audit logs for monitoring key activities",
      "Hospital verification workflow",
      "Scalable healthcare data management"
    ],
    techStack: ["MongoDB", "Express.js", "React.js", "Node.js", "Spring Boot"],
    links: {
      github: "https://github.com/Nihar4569/CareSync--A-Hospital-Management-App",
      live: "https://caresyncdelhi.vercel.app/"
    },
    image: "/images/projects/health-connect.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Nagrik Aur Samvidhan (Citizen & Constitution)",
    description: "A platform designed to simplify and spread awareness about the Constitution of India using a gamified approach to make learning about constitutional rights, duties, and principles more engaging and accessible.",
    features: [
      "Gamified learning of constitutional concepts",
      "Interactive quizzes and challenges",
      "Simplified explanations of complex legal principles",
      "Progress tracking and achievement system",
      "Accessible design for users of all ages"
    ],
    techStack: ["React", "Node.js", "MongoDB", "Express.js", "Redux"],
    links: {
      github: "https://github.com/Nihar4569/Nagrik-Aur-Samvidhan-Constitutional-Literacy-Platform?tab=readme-ov-file",
      live: "https://github.com/Nihar4569/Nagrik-Aur-Samvidhan-Constitutional-Literacy-Platform?tab=readme-ov-file"
    },
    image: "/images/projects/nagrik-samvidhan.jpg",
    featured: false
  },
  {
    id: 3,
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
    image: "/images/projects/rainfall-prediction.jpg",
    featured: false
  },
  {
    id: 4,
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
    image: "/images/projects/classroom.jpg",
    featured: true
  },
  {
    id: 5,
    title: "Group Chat Application",
    description: "A real-time group chat application that allows users to create groups, join them, and communicate through text and multimedia sharing.",
    features: [
      "Create and join chat groups",
      "User authentication and authorization",
      "Real-time messaging using WebSocket",
      "File sharing (images, PDFs, and other documents)",
      "User presence indicators and notifications"
    ],
    techStack: ["React", "Node.js", "MongoDB", "Express.js"],
    links: {
      github: "https://github.com/Nihar4569/Chat_App",
      live: "https://chat-app-liart-sigma.vercel.app/"
    },
    image: "/images/projects/group-chat.jpg",
    featured: false
  },
  {
    id: 6,
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
    image: "/images/projects/career-navigator.jpg",
    featured: false
  },
  {
    id: 7,
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
    image: "/images/projects/academic-calendar.jpg",
    featured: true
  }
];

export default projects;
