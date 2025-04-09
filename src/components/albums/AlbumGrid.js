import React from 'react';
import styled from 'styled-components';
import AlbumCard from './AlbumCard';

const AlbumGrid = ({ albums }) => {
  return (
    <AlbumsContainer>
      <SectionIntro>
        <IntroTitle>Personal Photo Albums</IntroTitle>
        <IntroDescription>
          These albums are password-protected and contain memories from my journey as a developer, student, and person.
          You'll need the secret code to access each album.
        </IntroDescription>
      </SectionIntro>
      
      <GridContainer>
        {albums.map(album => (
          <AlbumCard key={album.id} album={album} />
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
`;

const IntroDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  font-size: 1.1rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

export default AlbumGrid;