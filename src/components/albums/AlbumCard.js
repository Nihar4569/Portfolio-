import React, { useState } from 'react';
import styled from 'styled-components';
import { FiLock, FiImage, FiKey, FiUnlock } from 'react-icons/fi';
import AuthModal from './AuthModal';
import AlbumViewer from './AlbumViewer';

const AlbumCard = ({ album }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAlbumViewer, setShowAlbumViewer] = useState(false);
  const [viewerName, setViewerName] = useState('Guest');
  
  const handleClick = () => {
    // If album is not locked, open directly
    if (!album.lock) {
      setViewerName('Guest');
      setShowAlbumViewer(true);
    } else {
      // If album is locked, show auth modal
      setShowAuthModal(true);
    }
  };
  
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };
  
  const closeAlbumViewer = () => {
    setShowAlbumViewer(false);
  };
  
  // Callback for successful authentication
  const onAuthSuccess = (name) => {
    setViewerName(name);
    setShowAuthModal(false);
    setShowAlbumViewer(true);
  };
  
  return (
    <>
      <Card onClick={handleClick} data-sound="click" data-scroll-reveal="depth">
        <CardImageContainer>
          {album.coverImage
            ? <CardImage src={album.coverImage} alt="" loading="lazy" decoding="async" />
            : <FiImage aria-hidden="true" />}
          <CardOverlay>
            <LockContainer>
              <OverlayIcon>
                {album.lock ? <FiKey /> : <FiUnlock />}
              </OverlayIcon>
              <OverlayText>
                {album.lock ? 'Access Protected' : 'Public Album'}
              </OverlayText>
            </LockContainer>
          </CardOverlay>
        </CardImageContainer>
        
        <CardContent>
          <CardHeader>
            <LockIcon>
              {album.lock ? <FiLock /> : <FiUnlock />}
            </LockIcon>
            <CardTitle>{album.title}</CardTitle>
          </CardHeader>
          <CardDescription>{album.description}</CardDescription>
          
          <CardFooter>
            {!!album.photoCount && <PhotoCount>
              <FiImage />
              <span>{album.photoCount} Photos</span>
            </PhotoCount>}
            <AccessButton type="button" aria-label={`${album.lock ? 'Enter code for' : 'View'} ${album.title}`}>
              {album.lock ? 'Enter Code' : 'View Album'}
            </AccessButton>
          </CardFooter>
        </CardContent>
      </Card>
      
      {showAuthModal && (
        <AuthModal 
          album={album} 
          onClose={closeAuthModal} 
          onAuthSuccess={onAuthSuccess}
        />
      )}

      {showAlbumViewer && (
        <AlbumViewer album={album} name={viewerName} onClose={closeAlbumViewer} />
      )}
    </>
  );
};

// Styled Components
const Card = styled.article`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;

  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    transition: translate 230ms ease-out;
    &:hover { translate: 0 -4px; }
  }
  
  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  aspect-ratio: 3 / 2;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: ${props => props.theme.codeBackground};
  color: ${props => props.theme.textSecondary};
  font-size: 2rem;
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.7)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
  
  ${Card}:hover ${CardImage} {
    transform: scale(1.1);
  }
`;

const LockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const OverlayIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
`;

const OverlayText = styled.p`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const LockIcon = styled.div`
  color: ${props => props.theme.textSecondary};
  margin-right: 0.8rem;
  font-size: 1.2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  overflow-wrap: anywhere;
  color: ${props => props.theme.text};
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PhotoCount = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  
  svg {
    margin-right: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const AccessButton = styled.button`
  min-height: 44px;
  background: transparent;
  color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
  }
  
  @media (max-width: 480px) {
    padding: 0.35rem 0.7rem;
    font-size: 0.75rem;
  }
`;

export default AlbumCard;
