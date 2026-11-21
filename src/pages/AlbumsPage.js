import React from 'react';
import styled from 'styled-components';
import albums from '../data/albums';
import AlbumGrid from '../components/albums/AlbumGrid';
import { PageContainer } from '../styles/SharedComponents';


const AlbumsPage = () => {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <PageTitle>Photo Albums</PageTitle>
          <PageSubtitle>A collection of memories with friends, hackathons, and more</PageSubtitle>
        </HeroContent>
      </HeroSection>
      
      <AlbumsSection>
        <SectionContainer>
          <AlbumGrid albums={albums} />
        </SectionContainer>
      </AlbumsSection>
    </PageContainer>
  );
};

// Styled Components
const HeroSection = styled.section`
  background-color: ${props => props.theme.surface};
  padding: 8rem 0 4rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 6rem 0 3rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 0 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  letter-spacing: -0.06em;
  line-height: 1.08;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const AlbumsSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.background};
  
  @media (max-width: 768px) {
    padding: 2rem 0 3rem;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

export default AlbumsPage;
