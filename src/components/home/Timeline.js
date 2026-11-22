import React from 'react';
import styled from 'styled-components';
import { FiAward, FiBriefcase, FiCode, FiCalendar } from 'react-icons/fi';
import { awards } from '../../data/profile';
import CrewNote from './CrewNote';

const { smartIndia, solvingForIndia } = awards;

const Timeline = () => {
  
  const events = [
    {
      id: 1,
      type: 'work',
      icon: <FiBriefcase />,
      title: 'Software Engineer',
      organization: 'Cisco, Bengaluru',
      date: 'Oct 2025 - Present',
      guide: 'pip',
      note: 'Specialist agents handle different parts of a request. Engineers can review changes before they reach the system.',
      question: 'How does Nihar coordinate specialist agents with LangGraph at Cisco?',
      description: 'Achieved 97% reduction in model initialization time (22min → 32s) through parallelization. Architected LangGraph-based multi-agent automation platform with ReAct reasoning and Webex Adaptive Card workflows.'
    },
    {
      id: 2,
      type: 'work',
      icon: <FiBriefcase />,
      title: 'Software Developer Intern',
      organization: 'Evolvision Technologies',
      date: 'Jun - Oct 2025',
      guide: 'byte',
      note: 'Redis served frequently requested data while fewer API calls helped the dashboard load faster.',
      question: 'How did Nihar speed up the Evolvision dashboard?',
      description: 'Reduced dashboard load time from ~8s to ~2s by consolidating API calls. Implemented Redis caching for frequently accessed data. Built enterprise apps with Java, Spring Boot, and REST APIs.'
    },
    {
      id: 3,
      type: 'education',
      icon: <FiAward />,
      title: 'B.Tech in Computer Science',
      organization: "Siksha 'O' Anusandhan, Bhubaneswar",
      date: '2021 - 2025',
      guide: 'scout',
      note: 'Alongside his degree, Nihar served as hostel coordinator for more than 1,200 boarders.',
      question: 'What did Nihar study at university?',
      description: 'Graduated with B.Tech in Computer Science and Engineering. Active member of Google Developer Student Club and Hostel Coordinator for 1200+ boarders.'
    },
    {
      id: 4,
      type: 'project',
      icon: <FiCode />,
      title: 'FIR Vault – Case Management',
      organization: 'Personal Project',
      date: '2024',
      guide: 'atlas',
      note: 'Separate portals give users, police, stations, and admins the permissions they need to work with case records.',
      question: 'How does FIR Vault manage case records and control access?',
      description: 'Developed a backend-driven FIR tracking system with structured record management across jurisdictions, RBAC, and MVC architecture using Spring Boot and MongoDB.'
    },
    {
      id: 5,
      type: 'project',
      icon: <FiCode />,
      title: 'CareSync – Healthcare Management',
      organization: 'Personal Project',
      date: '2024',
      guide: 'byte',
      note: 'Bed availability, patient registrations, and doctor assignments all update in real time.',
      question: 'How does CareSync track hospital beds and patient assignments?',
      description: 'Designed a scalable healthcare system with real-time bed tracking, patient registration, doctor assignment, and RBAC with audit logging for government use cases.'
    },
    {
      id: 6,
      type: 'achievement',
      icon: <FiAward />,
      title: `${solvingForIndia.name} – ${solvingForIndia.result}`,
      organization: solvingForIndia.organizers,
      date: String(solvingForIndia.year),
      guide: 'pip',
      note: 'The winning prototype used vector embeddings to retrieve relevant medical information.',
      question: 'What did Nihar build for the Solving For India Hackathon?',
      description: `Won with ${solvingForIndia.projectSummary}.`
    },
    {
      id: 7,
      type: 'project',
      icon: <FiCode />,
      title: 'Virtual Classroom',
      organization: 'Personal Project',
      date: '2023',
      guide: 'atlas',
      note: 'Teachers can share their screens while students stay connected through live messaging.',
      question: 'How does the Classroom Management System support screen sharing and messaging?',
      description: 'Built a real-time classroom communication platform with screen sharing, automatic routing, and real-time messaging using React, Firebase, and Node.js.'
    },
    {
      id: 8,
      type: 'achievement',
      icon: <FiAward />,
      title: `${smartIndia.name} ${smartIndia.year} – ${smartIndia.result}`,
      organization: 'Ministry of Education (Problem ID: DR717)',
      date: String(smartIndia.year),
      guide: 'scout',
      note: 'The team built one place to manage academic calendars for universities across India.',
      question: 'What did Nihar build for the Smart India Hackathon academic calendar project?',
      description: 'Won the national-level hackathon by developing an integrated annual academic calendar for all Indian universities. Led end-to-end development under intense 36-hour deadline.'
    }
  ];

  return (
    <TimelineContainer role="list">
      {events.map((event, index) => (
        <TimelineItem key={event.id} className="journey-row" data-card-side={index % 2 === 0 ? 'left' : 'right'}>
          <TimelineContent className="journey-card" $isLeft={index % 2 === 0} data-scroll-reveal="depth">
            <TimelineDate>
              <FiCalendar aria-hidden="true" /> {event.date}
            </TimelineDate>
            <TimelineTitle>{event.title}</TimelineTitle>
            <TimelineOrganization>{event.organization}</TimelineOrganization>
            <TimelineDescription>{event.description}</TimelineDescription>
          </TimelineContent>
          
          <TimelineDot aria-hidden="true">
            {event.icon}
          </TimelineDot>
          
          <TimelineLine aria-hidden="true" $isLast={index === events.length - 1} />

          <CrewNote journey guide={event.guide} topic={event.title} question={event.question}>
            {event.note}
          </CrewNote>
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};

// Styled Components
const TimelineContainer = styled.ol`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
  list-style: none;
`;

const TimelineItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(65px, 10%, 100px) minmax(0, 1fr);
  grid-template-areas: 'card rail guide';
  align-items: center;
  padding: 2rem 0;
  width: 100%;

  &[data-card-side='right'] { grid-template-areas: 'guide rail card'; }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'card' 'guide';
    gap: 12px;
    padding: 1rem 0 1rem 2rem;

    &[data-card-side='right'] { grid-template-areas: 'card' 'guide'; }
  }
`;

const TimelineContent = styled.div`
  grid-area: card;
  min-width: 0;
  padding: 1.5rem;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;

  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    transition: translate 220ms ease;
    &:hover { translate: 0 -4px; }
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 20px;
    ${props => props.$isLeft ? 'right: -10px' : 'left: -10px'};
    width: 20px;
    height: 20px;
    background-color: ${props => props.theme.cardBackground};
    transform: rotate(45deg);
    
    @media (max-width: 768px) {
      left: -10px;
      right: auto;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.15rem;
  }
`;

const TimelineDate = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background-color: ${props => props.theme.background};
  border-radius: 15px;
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  
  svg {
    margin-right: 6px;
  }
`;

const TimelineTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const TimelineOrganization = styled.h4`
  font-size: 1rem;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
`;

const TimelineDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
`;

const TimelineDot = styled.div`
  position: absolute;
  top: 3.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 2;
  
  background: ${props => props.theme.codeBackground};
  color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.inputBorder};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    top: 2.25rem;
    left: 11px;
    width: 26px;
    height: 26px;
    font-size: 0.86rem;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  top: 0;
  bottom: ${props => props.$isLast ? '50%' : '0'};
  left: 50%;
  width: 3px;
  background: ${props => props.theme.borderColor};
  transform: translateX(-50%);
  
  @media (max-width: 768px) {
    left: 11px;
    width: 2px;
  }
`;

export default Timeline;
