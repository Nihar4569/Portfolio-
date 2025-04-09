import React from 'react';
import styled from 'styled-components';
import AlbumCard from './AlbumCard';

const AlbumGrid = ({ albums }) => {
  return (
    <AlbumsContainer>
      <SectionIntro>
        <IntroTitle>My Albums</IntroTitle>
        <IntroDescription>
          Browse through my collection of photo albums. Some albums may require a secret code to access.
        </IntroDescription>
      </SectionIntro>
      
      <GridContainer className="album-grid-container">
        {albums.map(album => (
          <AlbumCard key={album.id} album={album} className="album-card" />
        ))}
      </GridContainer>
    </AlbumsContainer>
  );
};

// Styled Components
const AlbumsContainer = styled.div`
  width: 100%;
`;

const SectionIntro = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const IntroTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    margin: 15px auto 0;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const IntroDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export default AlbumGrid;