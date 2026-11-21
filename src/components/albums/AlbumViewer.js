import React, { useState, useEffect, useId } from 'react';
import styled from 'styled-components';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize } from 'react-icons/fi';
import { fetchPhotosFromDirectory } from '../../services/photoService';
import ModalOverlay from './ModalOverlay';

// Lazy loaded image component with loading state
function AlbumPhoto({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <ImageWrapper>
      {!isLoaded && !error && <ImagePlaceholder />}
      {error ? <ErrorMessage>Photo unavailable.</ErrorMessage> : <StyledImage
        src={src}
        alt={alt}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        $isLoaded={isLoaded}
      />}
    </ImageWrapper>
  );
}

const AlbumViewer = ({ album, name, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const titleId = useId();
  
  // Fetch photos when component mounts - non-blocking
  useEffect(() => {
    let isMounted = true;
    
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        const fetchedPhotos = await fetchPhotosFromDirectory(album.photoDirectory);
        if (isMounted) {
          setPhotos(fetchedPhotos);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching photos:", err);
        if (isMounted) {
          setError("Failed to load photos. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    void loadPhotos();
    
    return () => { isMounted = false; };
  }, [album.photoDirectory]);
  
  // Check if we have photos to display
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[currentIndex] : null;
  
  function changePhoto(offset) {
    setCurrentIndex((index) => (index + offset + photos.length) % photos.length);
  }
  
  return (
    <ModalOverlay onClose={onClose} labelledBy={titleId} fullscreen={isFullscreen}>
      <ViewerContainer $fullscreen={isFullscreen}>
        <ViewerHeader>
          <ViewerTitle id={titleId}>{album.title}</ViewerTitle>

          <HeaderControls>
            <WelcomeMessage>Hello, {name}!</WelcomeMessage>

            <HeaderButton type="button" onClick={() => setIsFullscreen((value) => !value)}
              aria-pressed={isFullscreen} aria-label="Full screen">
              {isFullscreen ? <FiMinimize aria-hidden="true" /> : <FiMaximize aria-hidden="true" />}
            </HeaderButton>

            <form method="dialog">
              <HeaderButton type="submit" aria-label="Close album"><FiX aria-hidden="true" /></HeaderButton>
            </form>
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
              <NavigationButton type="button" $side="left" aria-label="Previous photo" onClick={() => changePhoto(-1)}>
                <FiChevronLeft aria-hidden="true" />
              </NavigationButton>

              <PhotoContainer>
                <AlbumPhoto key={currentPhoto.id} src={currentPhoto.url} alt={`Photo ${currentIndex + 1} from ${album.title}`} />

                <PhotoCounter>
                  {currentIndex + 1} / {photos.length}
                </PhotoCounter>
              </PhotoContainer>

              <NavigationButton type="button" $side="right" aria-label="Next photo" onClick={() => changePhoto(1)}>
                <FiChevronRight aria-hidden="true" />
              </NavigationButton>
            </>
          )}
        </ViewerContent>

        {!isLoading && hasPhotos && <ThumbnailsContainer aria-label="Album photos">
          {photos.map((photo, index) => (
            <Thumbnail
              key={photo.id}
              type="button"
              aria-current={index === currentIndex ? 'true' : undefined}
              aria-label={`Show photo ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
            >
              <ThumbnailImage
                src={photo.thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </Thumbnail>
          ))}
        </ThumbnailsContainer>}
      </ViewerContainer>
    </ModalOverlay>
  );
};

// Styled Components
const ViewerContainer = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: ${props => props.$fullscreen ? 'var(--album-height)' : 'min(80vh, var(--album-height))'};
  height: ${props => props.$fullscreen ? 'var(--album-height)' : 'min(84dvh, var(--album-height))'};
`;

const ViewerHeader = styled.div`
  padding: clamp(0.35rem, 1.5dvh, 1rem) clamp(0.65rem, 3vw, 2rem);
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
`;

const ViewerTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.05rem, 3vw, 1.5rem);
  line-height: 1.2;
  color: ${props => props.theme.text};
  overflow-wrap: anywhere;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const WelcomeMessage = styled.span`
  color: ${props => props.theme.textSecondary};
  margin-right: 0.5rem;
  max-width: 18ch;
  text-align: end;
  overflow-wrap: anywhere;
  font-size: 0.9rem;
  @media (max-width: 600px), (max-height: 400px) { display: none; }
`;

const HeaderButton = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  font-size: 1.3rem;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const ViewerContent = styled.div`
  position: relative;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template: minmax(0, 1fr) / minmax(0, 1fr);
  padding: clamp(0.3rem, 1.7dvh, 1.5rem) clamp(0.5rem, 2vw, 1.5rem);
  background-color: ${props => props.theme.background};
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.$side}: clamp(6px, 2vw, 1rem);
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background-color: ${props => props.theme.cardBackground};
  color: ${props => props.theme.text};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
  }
`;

const PhotoContainer = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
`;

// Lazy image styled components
const ImageWrapper = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: 0;
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, ${props => props.theme.surface} 25%, ${props => props.theme.codeBackground} 50%, ${props => props.theme.surface} 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  @media (prefers-reduced-motion: no-preference) { animation: shimmer 1.5s infinite; }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: contain;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  @media (prefers-reduced-motion: no-preference) { transition: opacity 0.25s ease; }
`;

const PhotoCounter = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.82rem;
  margin-top: 4px;
  text-align: center;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  min-width: 0;
  overflow-x: auto;
  padding: clamp(0.35rem, 1.4dvh, 1rem);
  overscroll-behavior-inline: contain;
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

const Thumbnail = styled.button`
  flex: none;
  aspect-ratio: 4 / 3;
  height: clamp(44px, 9dvh, 60px);
  padding: 0;
  background: ${props => props.theme.codeBackground};
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  border: 2px solid transparent;
  opacity: 0.7;

  &[aria-current="true"] {
    border-color: ${props => props.theme.primary};
    opacity: 1;
  }
  
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
  min-height: 0;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.borderColor};
  border-top: 4px solid ${props => props.theme.primary};
  border-radius: 50%;
  @media (prefers-reduced-motion: no-preference) { animation: spin 1s linear infinite; }
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
  min-height: 0;
  padding: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.error};
  font-size: 1.1rem;
  text-align: center;
`;

export default AlbumViewer;
