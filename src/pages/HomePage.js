import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';  // Import Link for navigation

// Components
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import TechStack from '../components/home/TechStack';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import Timeline from '../components/home/Timeline';

// Data
import projects from '../data/projects';

const HomePage = () => {
  // Filter featured projects for homepage
  const featuredProjects = projects.filter(project => project.featured);
  
  return (
    <>
      <Hero />
      
      <About />
      
      <TechStackSection>
        <SectionTitle>Tech Stack</SectionTitle>
        <TechStack />
      </TechStackSection>
      
      <ProjectsSection>
        <SectionContainer>
          <SectionTitle>Featured Projects</SectionTitle>
          <ProjectsGrid projects={featuredProjects} />
          <ViewAllButton to="/projects">View All Projects</ViewAllButton>
        </SectionContainer>
      </ProjectsSection>
      
      <TimelineSection>
        <SectionContainer>
          <SectionTitle>My Journey</SectionTitle>
          <Timeline />
        </SectionContainer>
      </TimelineSection>
    </>
  );
};

// Styled Components
const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const TechStackSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.background};
  text-align: center;
`;

const ProjectsSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.surface};
`;

const TimelineSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.background};
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    border-radius: 2px;
  }
`;

const ViewAllButton = styled(Link)`  // Change 'styled.a' to 'styled(Link)'
  display: block;
  width: fit-content;
  margin: 3rem auto 0;
  padding: 0.8rem 2rem;
  background-color: transparent;
  color: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export default HomePage;
