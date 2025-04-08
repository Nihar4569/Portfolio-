import React from 'react';
import styled from 'styled-components';
import AlbumCard from './AlbumCard';

const AlbumGrid = ({ albums }) => {
  return (
    <AlbumsContainer>
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

export default AlbumGrid;