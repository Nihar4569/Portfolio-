import React from 'react';
import styled from 'styled-components';
import projects from '../data/projects';
import ProjectsGrid from '../components/projects/ProjectsGrid';

const ProjectsPage = () => {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <PageTitle>My Projects</PageTitle>
          <PageSubtitle>Explore my work across various technologies and domains</PageSubtitle>
        </HeroContent>
      </HeroSection>
      
      <ProjectsSection>
        <SectionContainer>
          <ProjectsGrid projects={projects} />
        </SectionContainer>
      </ProjectsSection>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background-color: ${props => props.theme.surface};
  padding: 8rem 0 4rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const ProjectsSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.background};
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

export default ProjectsPage;