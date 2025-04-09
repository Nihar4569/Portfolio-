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
import { PageContainer } from '../styles/SharedComponents';


// Data
import projects from '../data/projects';

const HomePage = () => {
  // Filter featured projects for homepage
  const featuredProjects = projects.filter(project => project.featured);
  
  return (
    <>
    <PageContainer>
      <Hero />
      
      <About />
      
      <TechStackSection>
        <SectionContainer>
          <SectionTitle>Tech Stack</SectionTitle>
          <SectionSubtitle>
            The technologies and tools that power my development workflow
          </SectionSubtitle>
          <TechStack />
        </SectionContainer>
      </TechStackSection>
      
      <ProjectsSection>
        <SectionContainer>
          <SectionTitle>Featured Projects</SectionTitle>
          <SectionSubtitle>
            Some of my most impactful work, from healthcare management systems to hackathon winners
          </SectionSubtitle>
          <ProjectsGrid projects={featuredProjects} />
          <ViewAllButton to="/projects">
            <span>View All Projects</span> <FiArrowRight />
          </ViewAllButton>
        </SectionContainer>
      </ProjectsSection>
      
      <TimelineSection>
        <SectionContainer>
          <SectionTitle>My Journey</SectionTitle>
          <SectionSubtitle>
            Key milestones and achievements in my development career
          </SectionSubtitle>
          <Timeline />
        </SectionContainer>
      </TimelineSection>
      
      <CTASection>
        <CTAContainer>
          <CTAContent>
            <CTATitle>Need a passionate developer for your project?</CTATitle>
            <CTADescription>
              I'm currently available for freelance work, internships, and full-time opportunities.
              Let's discuss how I can help bring your vision to life!
            </CTADescription>
            <CTAButton to="/contact">Contact Me</CTAButton>
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
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  max-width: 700px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  line-height: 1.6;
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
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    
    svg {
      transform: translateX(5px);
    }
  }
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background: linear-gradient(135deg, ${props => props.theme.isDark 
    ? 'rgba(0, 230, 118, 0.1)' 
    : 'rgba(52, 152, 219, 0.1)'
  } 0%, ${props => props.theme.isDark 
    ? 'rgba(33, 150, 243, 0.1)' 
    : 'rgba(46, 204, 113, 0.1)'
  } 100%);
  text-align: center;
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const CTAContent = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.borderColor};
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

export default HomePage;