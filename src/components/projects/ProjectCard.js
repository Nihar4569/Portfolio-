import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiGithub, FiExternalLink, FiInfo, FiX } from 'react-icons/fi';

const ProjectCard = ({ project }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { isDark } = useContext(ThemeContext);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  return (
    <>
      <Card isDark={isDark}>
        <CardImageContainer>
          <CardImage src={project.image || "/images/placeholder/project.jpg"} alt={project.title} />
          <CardOverlay>
            <OverlayButtons>
              {project.links.github && (
                <OverlayButton href={project.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                  <FiGithub />
                </OverlayButton>
              )}
              
              {project.links.live && (
                <OverlayButton href={project.links.live} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                  <FiExternalLink />
                </OverlayButton>
              )}
              
              <OverlayButton as="button" onClick={toggleDetails} aria-label="Project Details">
                <FiInfo />
              </OverlayButton>
            </OverlayButtons>
          </CardOverlay>
          
          {project.featured && <FeaturedBadge isDark={isDark}>Featured</FeaturedBadge>}
        </CardImageContainer>
        
        <CardContent>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
          
          <TechStack>
            {project.techStack.map((tech, index) => (
              <TechTag key={index} isDark={isDark}>{tech}</TechTag>
            ))}
          </TechStack>
        </CardContent>
      </Card>
      
      {showDetails && (
        <ProjectDetailsModal>
          <ModalOverlay onClick={toggleDetails} />
          
          <ModalContent isDark={isDark}>
            <ModalHeader>
              <ModalTitle>{project.title}</ModalTitle>
              <CloseButton onClick={toggleDetails}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <ModalImage src={project.image || "/images/placeholder/project.jpg"} alt={project.title} />
              
              <ModalDescription>{project.description}</ModalDescription>
              
              <ModalSection>
                <ModalSectionTitle>Features</ModalSectionTitle>
                <FeaturesList>
                  {project.features.map((feature, index) => (
                    <FeatureItem key={index}>{feature}</FeatureItem>
                  ))}
                </FeaturesList>
              </ModalSection>
              
              <ModalSection>
                <ModalSectionTitle>Technologies Used</ModalSectionTitle>
                <ModalTechStack>
                  {project.techStack.map((tech, index) => (
                    <ModalTechTag key={index} isDark={isDark}>{tech}</ModalTechTag>
                  ))}
                </ModalTechStack>
              </ModalSection>
              
              <ModalButtons>
                {project.links.github && (
                  <ModalButton href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <FiGithub /> View Code
                  </ModalButton>
                )}
                
                {project.links.live && (
                  <ModalButton primary href={project.links.live} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink /> Live Demo
                  </ModalButton>
                )}
              </ModalButtons>
            </ModalBody>
          </ModalContent>
        </ProjectDetailsModal>
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
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  padding-top: 56.25%; // 16:9 aspect ratio
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
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.7)
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
  
  ${Card}:hover ${CardImage} {
    transform: scale(1.1);
  }
`;

const OverlayButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const OverlayButton = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &:hover {
    transform: translateY(-5px);
    background-color: ${props => props.theme.secondary};
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.4rem 1rem;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #00bcd4, #00e676)' 
    : 'linear-gradient(135deg, #3498db, #2ecc71)'
  };
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  z-index: 1;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: ${props => props.theme.text};
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const TechTag = styled.span`
  padding: 0.3rem 0.7rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.8rem;
  border-radius: 15px;
`;

// Modal Styles
const ProjectDetailsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 1001;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.isDark ? '#1e1e1e' : '#f1f1f1'};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDark ? '#555' : '#888'};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.isDark ? '#777' : '#555'};
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.cardBackground};
  z-index: 1;
  border-radius: 20px 20px 0 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.text};
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

const ModalBody = styled.div`
  padding: 2rem;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ModalDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
`;

const ModalSection = styled.div`
  margin-bottom: 2rem;
`;

const ModalSectionTitle = styled.h3`
  font-size: 1.3rem;
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, ${props => props.theme.primary}, ${props => props.theme.secondary});
    border-radius: 2px;
  }
`;

const FeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.8rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
  line-height: 1.5;
  
  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${props => props.theme.primary};
    font-size: 1.2rem;
  }
`;

const ModalTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const ModalTechTag = styled.span`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.theme.primary};
    color: white;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ModalButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.primary ? props.theme.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.text};
  border: 2px solid ${props => props.primary ? props.theme.primary : props.theme.borderColor};
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.primary ? props.theme.secondary : props.theme.background};
    border-color: ${props => props.primary ? props.theme.secondary : props.theme.primary};
  }
`;

export default ProjectCard;