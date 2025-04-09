import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiAward, FiBriefcase, FiCode, FiCalendar } from 'react-icons/fi';

const Timeline = () => {
  const { isDark } = useContext(ThemeContext);
  
  const events = [
    {
      id: 1,
      type: 'achievement',
      icon: <FiAward />,
      title: 'Smart India Hackathon 2022 Winner',
      organization: 'Ministry of Education',
      date: '2022',
      description: 'Developed an integrated annual academic calendar for all Indian universities, winning the national-level hackathon.'
    },
    {
      id: 2,
      type: 'project',
      icon: <FiCode />,
      title: 'Delhi Health Connect (CareSync)',
      organization: 'Personal Project',
      date: '2023',
      description: 'Developed a healthcare management system for the Delhi Government that efficiently manages hospital resources and patient care in real-time.'
    },
    {
      id: 3,
      type: 'achievement',
      icon: <FiAward />,
      title: 'Selected for Regional Round - Solving For India Hackathon',
      organization: 'GeeksforGeeks | AMD',
      date: '2023',
      description: 'Selected for the East Zone regional round of the Solving For India Hackathon organized by GeeksforGeeks.'
    },
    {
      id: 4,
      type: 'project',
      icon: <FiCode />,
      title: 'Classroom Management System',
      organization: 'Personal Project',
      date: '2023',
      description: 'Built a real-time classroom communication platform with interactive features for both teachers and students.'
    },
    {
      id: 5,
      type: 'research',
      icon: <FiBriefcase />,
      title: 'Rainfall Prediction Research',
      organization: 'University Project',
      date: '2024',
      description: 'Conducted research on improving rainfall prediction accuracy using SMOTE and LSTM technologies.'
    },
    {
      id: 6,
      type: 'project',
      icon: <FiCode />,
      title: 'Nagrik Aur Samvidhan (Citizen & Constitution)',
      organization: 'Personal Project',
      date: '2023',
      description: 'A platform designed to simplify and spread awareness about the Constitution of India using a gamified approach to make learning about constitutional rights, duties, and principles more engaging and accessible.'
    },
    {
      id: 7,
      type: 'project',
      icon: <FiCode />,
      title: 'Rainfall Prediction Using SMOTE and LSTM',
      organization: 'Personal Project',
      date: '2023',
      description: 'A research project that improves rainfall prediction accuracy by addressing class imbalance and capturing temporal dependencies in weather data.'
    },
    {
      id: 8,
      type: 'project',
      icon: <FiCode />,
      title: 'Group Chat Application',
      organization: 'Personal Project',
      date: '2023',
      description: 'A real-time group chat application that allows users to create groups, join them, and communicate through text and multimedia sharing.'
    },
    {
      id: 9,
      type: 'project',
      icon: <FiCode />,
      title: 'AI Career Navigator',
      organization: 'Personal Project',
      date: '2023',
      description: 'A web-based career recommendation system that uses machine learning to provide personalized career guidance and educational pathways.'
    },
    {
      id: 10,
      type: 'project',
      icon: <FiCode />,
      title: 'Integrated Annual Academic Calendar',
      organization: 'Ministry of Education',
      date: '2022',
      description: 'A Smart India Hackathon 2022 winning project that centralizes academic calendars for all Indian universities, promoting efficiency and uniformity in the education system.'
    }
  ];
  
  
  
  return (
    <TimelineContainer>
      {events.map((event, index) => (
        <TimelineItem key={event.id} isLeft={index % 2 === 0} isDark={isDark}>
          <TimelineContent isLeft={index % 2 === 0}>
            <TimelineDate>
              <FiCalendar /> {event.date}
            </TimelineDate>
            <TimelineTitle>{event.title}</TimelineTitle>
            <TimelineOrganization>{event.organization}</TimelineOrganization>
            <TimelineDescription>{event.description}</TimelineDescription>
          </TimelineContent>
          
          <TimelineDot type={event.type} isDark={isDark}>
            {event.icon}
          </TimelineDot>
          
          <TimelineLine isDark={isDark} isLast={index === events.length - 1} />
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};

// Styled Components
const TimelineContainer = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const TimelineItem = styled.div`
  position: relative;
  display: flex;
  justify-content: ${props => props.isLeft ? 'flex-start' : 'flex-end'};
  padding: 2rem 0;
  width: 100%;
  
  @media (max-width: 768px) {
    justify-content: flex-end;
    padding-left: 2.5rem;
  }
`;

const TimelineContent = styled.div`
  width: 45%;
  padding: 1.5rem;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 20px;
    ${props => props.isLeft ? 'right: -10px' : 'left: -10px'};
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
    width: 100%;
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
  
  background: ${props => {
    switch(props.type) {
      case 'education':
        return props.isDark ? 'linear-gradient(135deg, #00bcd4, #00e676)' : 'linear-gradient(135deg, #3498db, #2ecc71)';
      case 'achievement':
        return props.isDark ? 'linear-gradient(135deg, #f39c12, #e74c3c)' : 'linear-gradient(135deg, #f1c40f, #e74c3c)';
      case 'project':
        return props.isDark ? 'linear-gradient(135deg, #9c27b0, #673ab7)' : 'linear-gradient(135deg, #9b59b6, #3498db)';
      case 'research':
        return props.isDark ? 'linear-gradient(135deg, #4caf50, #8bc34a)' : 'linear-gradient(135deg, #27ae60, #2ecc71)';
      default:
        return props.isDark ? 'linear-gradient(135deg, #00bcd4, #00e676)' : 'linear-gradient(135deg, #3498db, #2ecc71)';
    }
  }};
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    left: 16px;
    transform: none;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  top: 0;
  bottom: ${props => props.isLast ? '50%' : '0'};
  left: 50%;
  width: 3px;
  background: ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  transform: translateX(-50%);
  
  @media (max-width: 768px) {
    left: 16px;
    transform: none;
  }
`;

export default Timeline;