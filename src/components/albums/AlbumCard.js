import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiLock, FiImage, FiKey } from 'react-icons/fi';
import AuthModal from './AuthModal';

const AlbumCard = ({ album }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isDark } = useContext(ThemeContext);
  
  const handleClick = () => {
    setShowAuthModal(true);
  };
  
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };
  
  return (
    <>
      <Card onClick={handleClick} isDark={isDark}>
        <CardImageContainer>
          <CardImage src={album.coverImage || "/images/placeholder/album.jpg"} alt={album.title} />
          <CardOverlay>
            <LockContainer>
              <OverlayIcon>
                <FiKey />
              </OverlayIcon>
              <OverlayText>Access Protected</OverlayText>
            </LockContainer>
          </CardOverlay>
        </CardImageContainer>
        
        <CardContent>
          <CardHeader>
            <LockIcon>
              <FiLock />
            </LockIcon>
            <CardTitle>{album.title}</CardTitle>
          </CardHeader>
          <CardDescription>{album.description}</CardDescription>
          
          <CardFooter>
            <PhotoCount>
              <FiImage />
              <span>{album.photos.length} Photos</span>
            </PhotoCount>
            <AccessButton>Enter Code</AccessButton>
          </CardFooter>
        </CardContent>
      </Card>
      
      {showAuthModal && (
        <AuthModal album={album} onClose={closeAuthModal} />
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
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  padding-top: 66.67%; // 3:2 aspect ratio
  overflow: hidden;
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
  color: ${props => props.theme.text};
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PhotoCount = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  
  svg {
    margin-right: 8px;
  }
`;

const AccessButton = styled.button`
  background: transparent;
  color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

export default AlbumCard;