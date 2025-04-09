import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize, FiLoader } from 'react-icons/fi';
import { fetchPhotosFromDirectory } from '../../services/photoService';

const AlbumViewer = ({ album, name, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const { isDark } = useContext(ThemeContext);
  
  // Fetch photos when component mounts
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        const fetchedPhotos = await fetchPhotosFromDirectory(album.photoDirectory);
        setPhotos(fetchedPhotos);
        setError(null);
      } catch (err) {
        console.error("Error fetching photos:", err);
        setError("Failed to load photos. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPhotos();
  }, [album.photoDirectory]);
  
  // Check if we have photos to display
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[currentIndex] : null;
  
  const goToPrevious = (e) => {
    e.stopPropagation();
    if (!hasPhotos) return;
    
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = (e) => {
    e.stopPropagation();
    if (!hasPhotos) return;
    
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const toggleFullscreen = (e) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };
  
  const handleContentClick = (e) => {
    e.stopPropagation(); // Prevent clicks inside content from closing the viewer
  };
  
  return (
    <ViewerContainer isFullscreen={isFullscreen} onClick={handleContentClick}>
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
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading photos...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
          </ErrorContainer>
        ) : !hasPhotos ? (
          <ErrorContainer>
            <ErrorMessage>No photos found in this album.</ErrorMessage>
          </ErrorContainer>
        ) : (
          <>
            <NavigationButton left onClick={goToPrevious}>
              <FiChevronLeft />
            </NavigationButton>
            
            <PhotoContainer>
              <Photo src={currentPhoto.url || "/images/placeholder/photo.jpg"} alt="Album photo" />
              
              <PhotoCounter>
                {currentIndex + 1} / {photos.length}
              </PhotoCounter>
            </PhotoContainer>
            
            <NavigationButton right onClick={goToNext}>
              <FiChevronRight />
            </NavigationButton>
          </>
        )}
      </ViewerContent>
      
      <ThumbnailsContainer>
        {!isLoading && hasPhotos && photos.map((photo, index) => (
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
  max-width: ${props => props.isFullscreen ? '100%' : '900px'};
  max-height: ${props => props.isFullscreen ? '100vh' : '80vh'};
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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

const PhotoCounter = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: right;
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

// Add loading and error styled components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.borderColor};
  border-top: 4px solid ${props => props.theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  padding: 2rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.error};
  font-size: 1.1rem;
  text-align: center;
`;

export default AlbumViewer;