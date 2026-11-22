import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

// Components
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import TechStack from '../components/home/TechStack';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import Timeline from '../components/home/Timeline';
import CrewNote from '../components/home/CrewNote';
import { PageContainer } from '../styles/SharedComponents';


// Data
import projects from '../data/projects';

const featuredProjects = projects.filter((project) => project.featured);

const HomePage = ({ opening }) => {
  return (
    <>
    <PageContainer>
      <Hero opening={opening} />
      
      <About />
      
      <TechStack />
      
      <ProjectsSection id="featured-work">
        <SectionContainer>
          <SectionTitle data-scroll-reveal="rise">Featured Projects</SectionTitle>
          <SectionSubtitle>
            AI automation, search infrastructure, and backend architecture.
          </SectionSubtitle>
          <CrewNote guide="atlas">FIR Vault and CareSync use role-based access to solve different problems. I can walk you through the tradeoffs.</CrewNote>
          <ProjectsGrid projects={featuredProjects} />
          <ViewAllButton to="/projects">
            <span>View all {projects.length} projects</span> <FiArrowRight aria-hidden="true" />
          </ViewAllButton>
        </SectionContainer>
      </ProjectsSection>
      
      <TimelineSection aria-labelledby="journey-title">
        <SectionContainer>
          <SectionTitle id="journey-title" data-scroll-reveal="rise">My Journey</SectionTitle>
          <Timeline />
        </SectionContainer>
      </TimelineSection>
      
      <CTASection>
        <CTAContainer>
          <CTAContent data-scroll-reveal="depth">
            <CTATitle>Let's Build Something Amazing Together</CTATitle>
            <CTADescription>
              Currently working as a Software Engineer at Cisco, I'm always open to discussing 
              interesting projects, collaborations, or just connecting with fellow developers!
            </CTADescription>
            <CTAButton to="/contact">Get In Touch</CTAButton>
          </CTAContent>
        </CTAContainer>
      </CTASection>
      </PageContainer>
    </>
  );
};

// Styled Components
const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const ProjectsSection = styled.section`
  scroll-margin-top: var(--portfolio-header-height);
  padding: 5rem 0;
  background-color: ${props => props.theme.surface};
  
  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`;

const TimelineSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.background};
  
  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  color: ${props => props.theme.text};
  letter-spacing: -0.05em;
  line-height: 1.12;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  max-width: 700px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    margin: 0 auto 2rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const ViewAllButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
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
  
  span {
    margin-right: 8px;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    
    svg {
      transform: translateX(5px);
    }
  }
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background: ${props => props.theme.surface};
  border-top: 1px solid ${props => props.theme.borderColor};
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const CTAContent = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.borderColor};
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  color: ${props => props.theme.buttonText};
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
`;

export default HomePage;
