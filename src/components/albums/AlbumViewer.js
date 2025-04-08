import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize } from 'react-icons/fi';

const AlbumViewer = ({ album, name, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isDark } = useContext(ThemeContext);
  
  const currentPhoto = album.photos[currentIndex];
  
  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? album.photos.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === album.photos.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const toggleFullscreen = (e) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <ViewerContainer isFullscreen={isFullscreen}>
      <ViewerHeader>
        <ViewerTitle>{album.title}</ViewerTitle>
        
        <HeaderControls>
          <WelcomeMessage>Hello, {name}!</WelcomeMessage>
          
          <FullscreenButton onClick={toggleFullscreen}>
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </FullscreenButton>
          
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </HeaderControls>
      </ViewerHeader>
      
      <ViewerContent>
        <NavigationButton left onClick={goToPrevious}>
          <FiChevronLeft />
        </NavigationButton>
        
        <PhotoContainer>
          <Photo src={currentPhoto.url || "/images/placeholder/photo.jpg"} alt={currentPhoto.caption} />
          
          <PhotoCaption>
            <span>{currentPhoto.caption}</span>
            <PhotoCounter>
              {currentIndex + 1} / {album.photos.length}
            </PhotoCounter>
          </PhotoCaption>
        </PhotoContainer>
        
        <NavigationButton right onClick={goToNext}>
          <FiChevronRight />
        </NavigationButton>
      </ViewerContent>
      
      <ThumbnailsContainer>
        {album.photos.map((photo, index) => (
          <Thumbnail 
            key={photo.id}
            active={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
            isDark={isDark}
          >
            <ThumbnailImage src={photo.url || "/images/placeholder/photo.jpg"} alt={`Thumbnail ${index + 1}`} />
          </Thumbnail>
        ))}
      </ThumbnailsContainer>
    </ViewerContainer>
  );
};

// Styled Components
const ViewerContainer = styled.div`
  width: 100%;
  background-color: ${props => props.theme.cardBackground};
  border-radius: ${props => props.isFullscreen ? '0' : '20px'};
  overflow: hidden;
  position: ${props => props.isFullscreen ? 'fixed' : 'relative'};
  top: ${props => props.isFullscreen ? '0' : 'auto'};
  left: ${props => props.isFullscreen ? '0' : 'auto'};
  right: ${props => props.isFullscreen ? '0' : 'auto'};
  bottom: ${props => props.isFullscreen ? '0' : 'auto'};
  z-index: ${props => props.isFullscreen ? '1010' : '1001'};
  display: flex;
  flex-direction: column;
  max-height: ${props => props.isFullscreen ? '100vh' : '80vh'};
`;

const ViewerHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
`;

const ViewerTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.text};
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
`;

const WelcomeMessage = styled.span`
  color: ${props => props.theme.textSecondary};
  margin-right: 1.5rem;
  font-size: 0.9rem;
`;

const FullscreenButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.primary};
    transform: rotate(90deg);
  }
`;

const ViewerContent = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${props => props.theme.background};
  min-height: 300px;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.left ? 'left: 1rem;' : 'right: 1rem;'}
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.theme.cardBackground};
  color: ${props => props.theme.text};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
    transform: translateY(-50%) scale(1.1);
  }
`;

const PhotoContainer = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Photo = styled.img`
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const PhotoCaption = styled.div`
  margin-top: 1rem;
  text-align: center;
  color: ${props => props.theme.text};
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
`;

const PhotoCounter = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1rem;
  background-color: ${props => props.theme.cardBackground};
  border-top: 1px solid ${props => props.theme.borderColor};
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.textSecondary};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.primary};
  }
`;

const Thumbnail = styled.div`
  flex: 0 0 80px;
  height: 60px;
  margin-right: 0.8rem;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  border: 2px solid ${props => props.active 
    ? props.isDark ? '#00bcd4' : '#3498db'
    : 'transparent'
  };
  opacity: ${props => props.active ? 1 : 0.6};
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default AlbumViewer;